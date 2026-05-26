import type { StateAttrMap } from '../types';
import type { TitleState } from './title-core';

export const TitleDataAttrs = {
  hasTitle: 'data-has-title',
} as const satisfies StateAttrMap<TitleState>;
