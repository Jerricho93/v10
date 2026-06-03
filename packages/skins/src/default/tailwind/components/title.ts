import { cn } from '@videojs/utils/style';

export const title = cn(
  'absolute top-0 inset-x-0',
  'py-4 px-6 @2xl/media-root:py-6 @2xl/media-root:px-8',
  'pointer-events-none',
  'text-sm @2xl/media-root:text-base font-medium',
  '[color:var(--media-color-primary,oklch(1_0_0))]',
  '[text-shadow:0_1px_0_var(--media-current-shadow-color)]',
  'truncate',
  'opacity-0',
  'transition-opacity',
  'duration-(--media-controls-transition-duration)',
  'ease-out',
  'peer-[[data-visible]:has([data-paused])]/controls:opacity-100',
  'peer-data-open/error:hidden',
  'not-data-has-title:hidden'
);
