/* eslint-disable import/no-extraneous-dependencies */

import config from '@fuf-stack/vitest-config';
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(config, defineConfig({
  test: {
    // isolate: false
  },
}))
