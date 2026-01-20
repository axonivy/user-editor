/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReadonlyProvider } from '@axonivy/ui-components';
import { type UserContext, type UserData, type ValidationResult } from '@axonivy/user-editor-protocol';
import { render, renderHook, type RenderHookOptions, type RenderOptions, type RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import { type ReactElement, type ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';
import { AppProvider } from '../context/AppContext';
import enMessages from '../translation/user-editor/en.json';

type ContextHelperProps = {
  appContext?: {
    context?: UserContext;
    data?: Array<UserData>;
    setData?: (data: Array<UserData>) => void;
    validations?: Array<ValidationResult>;
    helpUrl?: string;
  };
  readonly?: boolean;
};

const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n.use(initReactI18next).init({
    supportedLngs: ['en'],
    fallbackLng: 'en',
    ns: ['user-editor'],
    defaultNS: 'user-editor',
    resources: {
      en: { 'user-editor': enMessages }
    }
  });
};

const ContextHelper = ({ appContext, readonly, children }: ContextHelperProps & { children: ReactNode }) => {
  const data = appContext?.data ?? ([] as Array<UserData>);
  initTranslation();
  return (
    <ReadonlyProvider readonly={readonly ?? false}>
      <AppProvider
        value={{
          context: appContext?.context ?? ({ file: '' } as UserContext),
          data,
          // @ts-ignore
          setData: appContext?.setData ? getData => appContext.setData(getData(data)) : () => {},
          selectedIndex: -1,
          setSelectedIndex: () => {},
          history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
          validations: appContext?.validations ?? [],
          detail: false,
          setDetail: () => {},
          helpUrl: appContext?.helpUrl ?? ''
        }}
      >
        {children}
      </AppProvider>
    </ReadonlyProvider>
  );
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { wrapperProps: ContextHelperProps }
): RenderResult => {
  return render(ui, { wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />, ...options });
};
