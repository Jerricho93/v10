import { cleanup, render } from '@testing-library/react';
import { videoFeatures } from '@videojs/core/dom';
import { afterEach, describe, expect, it } from 'vitest';

import { PlayerContextProvider, type PlayerContextValue } from '../../../player/context';
import { createPlayer } from '../../../player/create-player';
import { Title } from '../index';

afterEach(cleanup);

describe('Title.Value', () => {
  it('returns null when no metadataFeature is present in the store', () => {
    const { container } = render(
      <PlayerContextProvider value={emptyPlayerContext()}>
        <Title.Value data-testid="title" />
      </PlayerContextProvider>
    );

    expect(container.querySelector('[data-testid="title"]')).toBeNull();
  });

  it('renders empty and aria-hidden when title is null', () => {
    const { Provider } = createPlayer({ features: videoFeatures });

    const { container } = render(
      <Provider>
        <Title.Value data-testid="title" />
      </Provider>
    );

    const el = container.querySelector('[data-testid="title"]');
    expect(el).not.toBeNull();
    expect(el?.textContent).toBe('');
    expect(el?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders title text when title is set via Provider', () => {
    const { Provider } = createPlayer({ features: videoFeatures });

    const { container } = render(
      <Provider title="Big Buck Bunny">
        <Title.Value data-testid="title" />
      </Provider>
    );

    const el = container.querySelector('[data-testid="title"]');
    expect(el?.textContent).toBe('Big Buck Bunny');
    expect(el?.getAttribute('aria-hidden')).toBeNull();
    expect(el?.hasAttribute('data-has-title')).toBe(true);
  });
});

function emptyPlayerContext(): PlayerContextValue {
  return {
    store: {
      state: {},
      subscribe: () => () => {},
    },
    media: null,
    setMedia: () => {},
    container: null,
    setContainer: () => {},
  } as unknown as PlayerContextValue;
}
