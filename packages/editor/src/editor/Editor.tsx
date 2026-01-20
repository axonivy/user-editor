import {
  Flex,
  PanelMessage,
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  Spinner,
  useDefaultLayout,
  useHistoryData,
  type Unary
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { UserContext, UserData, UserEditorData } from '@axonivy/user-editor-protocol';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { AppProvider } from '../context/AppContext';
import { useClient } from '../context/ClientContext';
import { genQueryKey } from '../query/query-client';
import './Editor.css';
import { ErrorFallback } from './main/ErrorFallback';
import { Main } from './main/Main';
import { UserToolbar } from './main/UserToolbar';
import { Sidebar } from './sidebar/Sidebar';

export type UserEditorProps = { context: UserContext; directSave?: boolean };

export const Editor = ({ context, directSave }: UserEditorProps) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [detail, setDetail] = useState(true);
  const [initialData, setInitialData] = useState<Array<UserData> | undefined>(undefined);
  const history = useHistoryData<Array<UserData>>();
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'user-editor-resize', storage: localStorage });

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(
    () => ({
      data: (context: UserContext) => genQueryKey('data', context),
      saveData: (context: UserContext) => genQueryKey('saveData', context),
      validation: (context: UserContext) => genQueryKey('validations', context)
    }),
    []
  );

  const { data, isPending, isError, isSuccess, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  const { data: validations } = useQuery({
    queryKey: queryKeys.validation(context),
    queryFn: () => client.validate(context),
    initialData: [],
    enabled: isSuccess
  });

  useEffect(() => {
    const validationDispose = client.onValidationChanged(() => queryClient.invalidateQueries({ queryKey: queryKeys.validation(context) }));
    const dataDispose = client.onDataChanged(() => queryClient.invalidateQueries({ queryKey: queryKeys.data(context) }));
    return () => {
      validationDispose.dispose();
      dataDispose.dispose();
    };
  }, [client, context, queryClient, queryKeys]);

  if (data?.data !== undefined && initialData === undefined) {
    setInitialData(data.data);
    history.push(data.data);
  }

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(context),
    mutationFn: async (updateData: Unary<Array<UserData>>) => {
      const saveData = queryClient.setQueryData<UserEditorData>(queryKeys.data(context), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        return client.saveData({ context, data: saveData.data, directSave: directSave ?? false });
      }
      return Promise.resolve();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.validation(context) })
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }
  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('common.message.errorOccurred', { message: error.message })} />;
  }
  if (data.data === undefined) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('message.notFound')} />;
  }

  return (
    <AppProvider
      value={{
        data: data.data,
        setData: mutation.mutate,
        selectedIndex,
        setSelectedIndex,
        context: data.context,
        history,
        validations,
        detail,
        setDetail,
        helpUrl: data.helpUrl
      }}
    >
      <ResizableGroup orientation='horizontal' defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged} className='user-editor'>
        <ResizablePanel id='main' defaultSize='50%' minSize='30%' className='user-editor-main-panel'>
          <Flex direction='column' className='panel'>
            <UserToolbar />
            <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[data]}>
              <Main />
            </ErrorBoundary>
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel id='properties' defaultSize='25%' minSize='20%' className='user-editor-detail-panel'>
              <Flex direction='column' className='panel'>
                <Sidebar />
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizableGroup>
    </AppProvider>
  );
};
