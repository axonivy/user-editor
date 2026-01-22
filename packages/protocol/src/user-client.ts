import type { EditorFileContent, UserActionArgs, UserContext, UserEditorData, UserSaveDataArgs, ValidationResult } from './data/user';
import type { UserMetaRequestTypes } from './user-protocol';

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

  meta<TMeta extends keyof UserMetaRequestTypes>(
    path: TMeta,
    args: UserMetaRequestTypes[TMeta][0]
  ): Promise<UserMetaRequestTypes[TMeta][1]>;

  validate(context: UserContext): Promise<ValidationResult[]>;
  action(action: UserActionArgs): void;

  onDataChanged: Event<void>;
  onValidationChanged: Event<void>;
}
