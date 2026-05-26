import type { MediaMetadataState } from '../../../core/media/state';
import { definePlayerFeature } from '../../feature';

export const metadataFeature = definePlayerFeature({
  name: 'metadata',
  state: ({ set }): MediaMetadataState => ({
    title: null,
    setTitle(title: string | null) {
      set({ title });
    },
  }),

  attach({ signal, get, store }) {
    if (!('mediaSession' in navigator)) return;

    const sync = () => {
      const { title } = get();
      navigator.mediaSession.metadata = title ? new MediaMetadata({ title }) : null;
    };

    const unsub = store.subscribe(sync);
    signal.addEventListener('abort', unsub, { once: true });

    sync();
  },
});
