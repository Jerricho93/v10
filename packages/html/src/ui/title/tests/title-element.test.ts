import { videoFeatures } from '@videojs/core/dom';
import { afterEach, describe, expect, it } from 'vitest';

import { createPlayer } from '../../../player/create-player';
import { MediaElement } from '../../media-element';
import { TitleElement } from '../title-element';

const { ProviderMixin } = createPlayer({ features: videoFeatures });

class TestPlayerElement extends ProviderMixin(MediaElement) {
  static readonly tagName = 'test-title-player';
}

customElements.define(TestPlayerElement.tagName, TestPlayerElement);
customElements.define(TitleElement.tagName, TitleElement);

afterEach(() => {
  document.body.replaceChildren();
});

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function waitForAssertion(assertion: () => void): Promise<void> {
  let error: unknown;

  for (let index = 0; index < 10; index++) {
    try {
      assertion();
      return;
    } catch (caught) {
      error = caught;
      await nextFrame();
    }
  }

  throw error;
}

describe('TitleElement', () => {
  it('has the correct tag name', () => {
    expect(TitleElement.tagName).toBe('media-title');
  });

  it('renders empty text and is aria-hidden when no title is set', async () => {
    const player = document.createElement(TestPlayerElement.tagName) as TestPlayerElement;
    const title = document.createElement(TitleElement.tagName) as TitleElement;
    player.append(title);
    document.body.append(player);

    await waitForAssertion(() => {
      expect(title.textContent).toBe('');
      expect(title.getAttribute('aria-hidden')).toBe('true');
      expect(title.hasAttribute('data-has-title')).toBe(false);
    });
  });

  it('renders title text and removes aria-hidden when title is set', async () => {
    const player = document.createElement(TestPlayerElement.tagName) as TestPlayerElement;
    const title = document.createElement(TitleElement.tagName) as TitleElement;
    player.append(title);
    document.body.append(player);

    (player.store.state as { setTitle: (t: string | null) => void }).setTitle('Big Buck Bunny');

    await waitForAssertion(() => {
      expect(title.textContent).toBe('Big Buck Bunny');
      expect(title.getAttribute('aria-hidden')).toBeNull();
      expect(title.hasAttribute('data-has-title')).toBe(true);
    });
  });

  it('updates text reactively when title changes', async () => {
    const player = document.createElement(TestPlayerElement.tagName) as TestPlayerElement;
    const title = document.createElement(TitleElement.tagName) as TitleElement;
    player.append(title);
    document.body.append(player);

    const setTitle = (t: string | null) => (player.store.state as { setTitle: (t: string | null) => void }).setTitle(t);

    setTitle('First Title');
    await waitForAssertion(() => expect(title.textContent).toBe('First Title'));

    setTitle('Updated Title');
    await waitForAssertion(() => expect(title.textContent).toBe('Updated Title'));

    setTitle(null);
    await waitForAssertion(() => {
      expect(title.textContent).toBe('');
      expect(title.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
