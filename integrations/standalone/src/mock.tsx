import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import { App, ClientContextProvider, QueryProvider, initQueryClient } from '@axonivy/user-editor';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { UserClientMock } from './mock/user-client-mock';
import { readonlyParam } from './url-helper';

export function start() {
  const client = new UserClientMock();
  const queryClient = initQueryClient();
  const readonly = readonlyParam();

  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('Root element not found');
  }
  initTranslation();
  createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider defaultTheme='light'>
        <ClientContextProvider client={client}>
          <QueryProvider client={queryClient}>
            <ReadonlyProvider readonly={readonly}>
              <HotkeysProvider initiallyActiveScopes={['global']}>
                <App context={{ app: '', project: '', file: '' }} />
              </HotkeysProvider>
            </ReadonlyProvider>
          </QueryProvider>
        </ClientContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
