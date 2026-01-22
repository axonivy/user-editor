import type { UserMetaRequestTypes } from '@axonivy/user-editor-protocol';
import { useQuery } from '@tanstack/react-query';
import { useClient } from '../context/ClientContext';
import { genQueryKey } from '../query/query-client';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof UserMetaRequestTypes>(
  path: TMeta,
  args: UserMetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<UserMetaRequestTypes[TMeta][1]>,
  options?: { disable?: boolean }
): { data: UserMetaRequestTypes[TMeta][1] } {
  const client = useClient();
  return useQuery({
    enabled: !options?.disable,
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args),
    initialData: initialData
  });
}
