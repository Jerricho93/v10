import { defaults } from '@videojs/utils/object';
import { isFunction } from '@videojs/utils/predicate';
import type { NonNullableObject } from '@videojs/utils/types';

import type { MediaMetadataState } from '../../media/state';

export interface TitleProps {
  /** Custom label for accessibility. Defaults to the title text. */
  label?: string | ((state: TitleState) => string) | undefined;
}

export interface TitleState {
  /** The current media title, or `null` if not set. */
  title: string | null;
  /** Formatted display text (title or empty string). */
  text: string;
  /** Whether a title is currently set. */
  hasTitle: boolean;
}

export class TitleCore {
  static readonly defaultProps: NonNullableObject<TitleProps> = {
    label: '',
  };

  #props = { ...TitleCore.defaultProps };
  #media: MediaMetadataState | null = null;

  constructor(props?: TitleProps) {
    if (props) this.setProps(props);
  }

  setProps(props: TitleProps): void {
    this.#props = defaults(props, TitleCore.defaultProps);
  }

  setMedia(media: MediaMetadataState): void {
    this.#media = media;
  }

  getLabel(state: TitleState): string {
    const { label } = this.#props;

    if (isFunction(label)) {
      const customLabel = label(state);
      if (customLabel) return customLabel;
    } else if (label) {
      return label;
    }

    return state.text;
  }

  getAttrs(state: TitleState) {
    return {
      'aria-label': this.getLabel(state) || undefined,
      'aria-hidden': state.hasTitle ? undefined : ('true' as const),
    };
  }

  getState(): TitleState {
    const title = this.#media?.title ?? null;
    return {
      title,
      text: title ?? '',
      hasTitle: title !== null && title.length > 0,
    };
  }
}

export namespace TitleCore {
  export type Props = TitleProps;
  export type State = TitleState;
}
