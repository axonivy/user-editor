import { Emitter } from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  UserActionArgs,
  UserClient,
  UserEditorData,
  UserSaveDataArgs,
  ValidationResult
} from '@axonivy/user-editor-protocol';
import { data } from './data-mock';
import { validateMock } from './validation-mock';

export class UserClientMock implements UserClient {
  private userData: UserEditorData;
  constructor() {
    this.userData = {
      context: { app: 'mockApp', pmv: 'mockPmv', file: 'users.yaml' },
      data: data,
      helpUrl: 'https://dev.axonivy.com',
      readonly: false
    };
  }

  protected onValidationChangedEmitter = new Emitter<void>();
  onValidationChanged = this.onValidationChangedEmitter.event;
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged = this.onDataChangedEmitter.event;

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  data(): Promise<UserEditorData> {
    return Promise.resolve(this.userData);
  }

  saveData(saveData: UserSaveDataArgs): Promise<EditorFileContent> {
    this.userData.data = saveData.data;
    return Promise.resolve({ content: '' });
  }

  validate(): Promise<ValidationResult[]> {
    return Promise.resolve(validateMock(this.userData.data));
  }

  action(action: UserActionArgs): void {
    console.log('action', JSON.stringify(action));
  }
}
