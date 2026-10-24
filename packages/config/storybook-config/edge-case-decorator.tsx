import type { Decorator } from '@storybook/react-vite';

/** Explain the scenario without constraining the form or its debug panel. */
const edgeCaseDecorator: Decorator = (Story, { parameters }) => {
  return (
    <div className="flex flex-col gap-6">
      <aside
        aria-label="What this checks"
        className="w-80 max-w-full rounded-lg border border-default-200 bg-default-100 p-3 text-sm text-foreground"
      >
        <p className="mb-1 font-semibold">What this checks</p>
        <p>{parameters.edgeCaseDescription}</p>
      </aside>
      <Story />
    </div>
  );
};

export default edgeCaseDecorator;
