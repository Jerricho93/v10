import { TitleCore, TitleDataAttrs } from '@videojs/core';
import { applyElementProps, applyStateDataAttrs, logMissingFeature, selectMetadata } from '@videojs/core/dom';
import type { PropertyDeclarationMap, PropertyValues } from '@videojs/element';

import { playerContext } from '../../player/context';
import { PlayerController } from '../../player/player-controller';
import { MediaElement } from '../media-element';

export class TitleElement extends MediaElement {
  static readonly tagName = 'media-title';

  static override properties = {
    label: { type: String },
  } satisfies PropertyDeclarationMap<keyof TitleCore.Props>;

  label = TitleCore.defaultProps.label;

  readonly #core = new TitleCore();
  readonly #state = new PlayerController(this, playerContext, selectMetadata);

  readonly #textNode = document.createTextNode('');

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.#textNode.parentNode) {
      this.appendChild(this.#textNode);
    }

    if (__DEV__ && !this.#state.value) {
      logMissingFeature(this.localName, this.#state.displayName!);
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this.#core.setProps(this);
  }

  protected override update(changed: PropertyValues): void {
    super.update(changed);

    const media = this.#state.value;

    if (!media) return;

    this.#core.setMedia(media);
    const state = this.#core.getState();

    this.#textNode.textContent = state.text;

    applyElementProps(this, this.#core.getAttrs(state));
    applyStateDataAttrs(this, state, TitleDataAttrs);
  }
}
