/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { EditorFileContent, UserActionArgs, UserContext, UserEditorData, UserSaveDataArgs, ValidationResult } from './data/user';

export type RoleMeta = { id: string; label: string };

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
