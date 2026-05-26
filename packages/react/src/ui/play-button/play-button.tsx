'use client';

import { PlayButtonCore, PlayButtonDataAttrs } from '@videojs/core';
import { logMissingFeature, selectMetadata, selectPlayback } from '@videojs/core/dom';
import type { ForwardedRef } from 'react';
import { forwardRef, useLayoutEffect, useState } from 'react';

import { usePlayer } from '../../player/context';
import type { UIComponentProps } from '../../utils/types';
import { renderElement } from '../../utils/use-render';
import { useButton } from '../hooks/use-button';
import { useAriaKeyShortcuts } from '../hotkey/use-aria-key-shortcuts';
import { useOptionalTooltipContext } from '../tooltip/context';

export interface PlayButtonProps extends UIComponentProps<'button', PlayButtonCore.State>, PlayButtonCore.Props {}

/**
 * A button that toggles playback.
 *
 * @example
 * ```tsx
 * <PlayButton />
 *
 * <PlayButton
 *   render={(props, state) => (
 *     <button {...props}>
 *       {state.paused ? <PlayIcon /> : <PauseIcon />}
 *     </button>
 *   )}
 * />
 * ```
 */
export const PlayButton = forwardRef(function PlayButton(
  componentProps: PlayButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const { render, className, style, label, disabled, ...elementProps } = componentProps;

  const tooltipCtx = useOptionalTooltipContext();
  const playback = usePlayer(selectPlayback);
  const metadata = usePlayer(selectMetadata);
  const shortcuts = useAriaKeyShortcuts('togglePaused');

  const [core] = useState(() => new PlayButtonCore());
  core.setProps({ label, disabled });
  if (metadata) core.setMetadata(metadata);

  const { getButtonProps, buttonRef } = useButton({
    displayName: 'PlayButton',
    onActivate: () => core.toggle(playback!),
    isDisabled: () => !!disabled || !playback,
  });

  if (playback) core.setMedia(playback);
  const state = playback ? core.getState() : null;
  const buttonLabel = state ? core.getLabel(state) : undefined;

  useLayoutEffect(() => {
    if (!tooltipCtx) return;
    tooltipCtx.setContent(buttonLabel);
    return () => tooltipCtx.setContent(undefined);
  }, [tooltipCtx, buttonLabel]);

  if (!playback || !state) {
    if (__DEV__) logMissingFeature('PlayButton', 'playback');
    return null;
  }

  const attrs = { ...core.getAttrs(state), 'aria-keyshortcuts': shortcuts };

  return renderElement(
    'button',
    { render, className, style },
    {
      state,
      stateAttrMap: PlayButtonDataAttrs,
      ref: [forwardedRef, buttonRef],
      props: [attrs, elementProps, getButtonProps()],
    }
  );
});

export namespace PlayButton {
  export type Props = PlayButtonProps;
  export type State = PlayButtonCore.State;
}
