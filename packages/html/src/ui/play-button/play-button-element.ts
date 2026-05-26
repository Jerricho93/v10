import { type MediaPlaybackState, PlayButtonCore, PlayButtonDataAttrs } from '@videojs/core';
import { selectMetadata, selectPlayback } from '@videojs/core/dom';
import type { PropertyValues } from '@videojs/element';

import { playerContext } from '../../player/context';
import { PlayerController } from '../../player/player-controller';
import { MediaButtonElement } from '../media-button-element';

export class PlayButtonElement extends MediaButtonElement<PlayButtonCore> {
  static readonly tagName = 'media-play-button';

  protected readonly core = new PlayButtonCore();
  protected readonly stateAttrMap = PlayButtonDataAttrs;
  protected readonly mediaState = new PlayerController(this, playerContext, selectPlayback);
  readonly #metadata = new PlayerController(this, playerContext, selectMetadata);
  protected override readonly hotkeyAction = 'togglePaused';

  protected override update(changed: PropertyValues): void {
    const metadata = this.#metadata.value;
    if (metadata) this.core.setMetadata(metadata);
    super.update(changed);
  }

  protected activate(state: MediaPlaybackState): void {
    this.core.toggle(state);
  }
}
