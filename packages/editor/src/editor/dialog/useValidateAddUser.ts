import type { MessageData } from '@axonivy/ui-components';
import type { UserData } from '@axonivy/user-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useValidateAddUser = (name: string, users: Array<UserData>) => {
  const { t } = useTranslation();

  const trimmedName = name.trim();
  const nameValidationMessage = useMemo<MessageData | undefined>(() => {
    if (trimmedName === '') {
      return toErrorMessage(t('message.emptyName'));
    }
    if (users.map(user => user.name).includes(trimmedName)) {
      return toErrorMessage(t('message.userAlreadyExists'));
    }
    return;
  }, [trimmedName, users, t]);
  return { nameValidationMessage };
};

const toErrorMessage = (message: string): MessageData => ({ message: message, variant: 'error' });
