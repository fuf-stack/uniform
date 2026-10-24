#!/bin/bash
set -euo pipefail

# Run from the repository root. Only --start-new-cycle resets active state.
START_NEW_CYCLE=false
if [[ $# -gt 1 ]]; then
  echo "Usage: $0 [--start-new-cycle]" >&2
  exit 1
fi
case "${1:-}" in
  "") ;;
  --start-new-cycle) START_NEW_CYCLE=true ;;
  *)
    echo "Usage: $0 [--start-new-cycle]" >&2
    exit 1
    ;;
esac

BRANCH_NAME="next"
MANIFEST_FILE=".release-please-manifest.json"
NEXT_MANIFEST_FILE=".release-please-manifest-next.json"
NEXT_CONFIG_FILE="release-please-config-next.json"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Commit or stash local changes before bootstrapping next." >&2
  exit 1
fi

git fetch origin
BOOTSTRAP_SHA=$(git rev-parse origin/main)

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  git checkout "$BRANCH_NAME"
  if git show-ref --verify --quiet "refs/remotes/origin/$BRANCH_NAME"; then
    git merge --ff-only "origin/$BRANCH_NAME"
  fi
  git merge origin/main --no-edit
elif git show-ref --verify --quiet "refs/remotes/origin/$BRANCH_NAME"; then
  git checkout --track -b "$BRANCH_NAME" "origin/$BRANCH_NAME"
  git merge origin/main --no-edit
else
  git checkout -b "$BRANCH_NAME" origin/main
fi

# Ordinary runs seed only missing or outdated versions. An explicit new cycle
# seeds every package from stable, including packages still ahead of stable.
TEMP_MANIFEST=$(mktemp)
TEMP_CONFIG=$(mktemp)
trap 'rm -f "$TEMP_MANIFEST" "$TEMP_CONFIG"' EXIT
jq --argjson startNewCycle "$START_NEW_CYCLE" --slurpfile next "$NEXT_MANIFEST_FILE" '
  def core: split("-")[0] | split(".") | map(tonumber);
  to_entries | map(
    .key as $path | .value as $stable |
    ($next[0][$path] // "0.0.0") as $current |
    .value = (if ($startNewCycle | not) and ($current | contains("-next.")) and
                  (($current | core) > ($stable | core))
              then $current
              else (($stable | core | .[0] + 1 | tostring) + ".0.0-next.0")
              end)
  ) | from_entries
' "$MANIFEST_FILE" > "$TEMP_MANIFEST"

# bootstrap-sha is ignored after the first release. last-release-sha is not.
# Ordinary runs preserve the cutoff; a new cycle starts at current main.
jq --arg sha "$BOOTSTRAP_SHA" --argjson startNewCycle "$START_NEW_CYCLE" '
  .versioning = "prerelease" |
  .prerelease = true |
  ."prerelease-type" = "next" |
  ."bootstrap-sha" = (if $startNewCycle then $sha
                     else (."bootstrap-sha" // ."last-release-sha" // $sha)
                     end) |
  del(."last-release-sha")
' "$NEXT_CONFIG_FILE" > "$TEMP_CONFIG"
# Ignore formatting differences so a rerun does not create a release commit.
if [[ "$(jq -Sc . "$TEMP_MANIFEST")" != "$(jq -Sc . "$NEXT_MANIFEST_FILE")" ]]; then
  mv "$TEMP_MANIFEST" "$NEXT_MANIFEST_FILE"
fi
if [[ "$(jq -Sc . "$TEMP_CONFIG")" != "$(jq -Sc . "$NEXT_CONFIG_FILE")" ]]; then
  mv "$TEMP_CONFIG" "$NEXT_CONFIG_FILE"
fi

git add "$NEXT_MANIFEST_FILE" "$NEXT_CONFIG_FILE"
if ! git diff --cached --quiet; then
  if [[ "$START_NEW_CYCLE" == true ]]; then
    git commit -m "chore: start next prerelease cycle"
  else
    git commit -m "chore: bootstrap next branch for prereleases"
  fi
fi

echo "Review the next branch, then push with: git push -u origin next"
