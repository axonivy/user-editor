import type { UserClient } from '@axonivy/user-editor-protocol';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

export interface ClientContext {
  client: UserClient;
}

const ClientContextInstance = createContext<ClientContext | undefined>(undefined);
export const useClient = (): UserClient => {
  const context = useContext(ClientContextInstance);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientContext');
  }
  return context.client;
};

export const ClientContextProvider = ({ client, children }: { client: UserClient; children: ReactNode }) => {
  return <ClientContextInstance.Provider value={{ client }}>{children}</ClientContextInstance.Provider>;
};
