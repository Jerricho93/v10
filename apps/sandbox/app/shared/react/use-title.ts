import { SOURCES } from '@app/shared/sources';
import { useSource } from './use-source';

export function useTitle(audioOnly?: boolean): string {
  const source = useSource(audioOnly);
  return SOURCES[source].label.split(' - ').slice(1).join(' - ');
}
