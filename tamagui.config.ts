import { createTamagui } from '@tamagui/core';
import { defaultConfig } from '@tamagui/config/v5';
import { animationsReanimated } from '@tamagui/config/v5-reanimated';

const config = createTamagui({
  ...defaultConfig,
  animations: animationsReanimated,
});

export type Conf = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
