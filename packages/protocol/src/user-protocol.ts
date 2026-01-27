/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { EditorFileContent, RoleMeta, UserContext, UserEditorData, UserSaveDataArgs, ValidationResult } from './data/user';

export interface UserActionArgs {
  actionId: 'openUrl';
  context: UserContext;
  payload: string;
}

export interface UserMetaRequestTypes {
  'meta/roles/all': [UserContext, Array<RoleMeta>];
}

export interface UserRequestTypes extends UserMetaRequestTypes {
  initialize: [UserContext, void];
  data: [UserContext, UserEditorData];
  saveData: [UserSaveDataArgs, EditorFileContent];

  validate: [UserContext, ValidationResult[]];
}

export interface UserNotificationTypes {
  action: UserActionArgs;
}

export interface UserOnNotificationTypes {
  dataChanged: void;
  validationChanged: void;
}
