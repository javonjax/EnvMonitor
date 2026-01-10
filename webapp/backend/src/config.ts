import type { EnvConfig } from './types.js';
import { generateConfig } from './utils.js';

export let config: EnvConfig | null = null;

export const loadConfig = async () => {
  config = await generateConfig();
  return config;
};

export const getConfig = () => {
  if (!config) {
    throw new Error('Config not found.');
  }
  return config;
};
