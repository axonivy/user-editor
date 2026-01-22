import type { UserActionArgs } from '@axonivy/user-editor-protocol';
import { useAppContext } from '../context/AppContext';
import { useClient } from '../context/ClientContext';

export function useAction(actionId: UserActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: UserActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
