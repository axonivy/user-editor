import type { EditorFileContent, UserActionArgs, UserContext, UserEditorData, UserSaveDataArgs, ValidationResult } from './data/user';

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface UserClient {
  initialize(context: UserContext): Promise<void>;
  data(context: UserContext): Promise<UserEditorData>;
  saveData(saveData: UserSaveDataArgs): Promise<EditorFileContent>;

  validate(context: UserContext): Promise<ValidationResult[]>;
  action(action: UserActionArgs): void;

  onDataChanged: Event<void>;
  onValidationChanged: Event<void>;
}
