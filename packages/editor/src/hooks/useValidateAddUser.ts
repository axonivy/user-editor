import type { MessageData } from '@axonivy/ui-components';
import type { UserData } from '@axonivy/user-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useValidateName = (name: string, users: Array<UserData>) => {
  const { t } = useTranslation();
  return useMemo<MessageData | undefined>(() => {
    switch (validateName(name, users)) {
      case 'emptyName':
        return toErrorMessage(t('message.emptyName'));
      case 'alreadyExists':
        return toErrorMessage(t('message.userAlreadyExists'));
      default:
        return;
    }
  }, [name, users, t]);
};

export const validateName = (name: string, users: Array<UserData>) => {
  const trimmedName = name.trim();
  if (trimmedName === '') {
    return 'emptyName';
  }
  if (users.map(user => user.name).includes(trimmedName)) {
    return 'alreadyExists';
  }
  return undefined;
};

const toErrorMessage = (message: string): MessageData => ({ message: message, variant: 'error' });
