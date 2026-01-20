import { type useHistoryData } from '@axonivy/ui-components';
import { type UserContext, type UserData, type ValidationResult } from '@axonivy/user-editor-protocol';
import { createContext, useContext } from 'react';
import type { UpdateConsumer } from '../types/types';

export type AppContext = {
  data: Array<UserData>;
  setData: UpdateConsumer<Array<UserData>>;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  context: UserContext;
  history: ReturnType<typeof useHistoryData<Array<UserData>>>;
  validations: Array<ValidationResult>;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  helpUrl: string;
};

export const appContext = createContext<AppContext>({
  data: [],
  setData: data => data,
  selectedIndex: -1,
  setSelectedIndex: () => {},
  context: { app: '', pmv: '', file: '' },
  history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
  validations: [],
  detail: true,
  setDetail: () => {},
  helpUrl: ''
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext & { setUnhistoriedVariables: UpdateConsumer<Array<UserData>> } => {
  const context = useContext(appContext);
  return {
    ...context,
    setData: updateData => {
      context.setData(old => {
        const newData = updateData(old);
        context.history.push(newData);
        return newData;
      });
    },
    setUnhistoriedVariables: context.setData
  };
};
