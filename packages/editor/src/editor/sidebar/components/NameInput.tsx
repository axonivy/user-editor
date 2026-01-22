import { BasicField, Input, type MessageData } from '@axonivy/ui-components';
import type { UserData } from '@axonivy/user-editor-protocol';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidateName, validateName } from '../../../hooks/useValidateAddUser';

type NameInputProps = {
  value: string;
  onChange: (change: string) => void;
  users: UserData[];
  message?: MessageData;
};

export const NameInput = ({ value, onChange, users, message }: NameInputProps) => {
  const { t } = useTranslation();
  const [currentValue, setCurrentValue] = useState(value ?? '');
  const [prevValue, setPrevValue] = useState(value);
  const nameValidationMessage = useValidateName(currentValue, users);
  if (value !== undefined && prevValue !== value) {
    setCurrentValue(value);
    setPrevValue(value);
  }
  const updateValue = (value: string) => {
    setCurrentValue(value);
    if (validateName(value, users) === undefined) {
      onChange?.(value);
    }
  };
  return (
    <BasicField label={t('common.label.name')} message={nameValidationMessage ?? message}>
      <Input value={currentValue} onChange={event => updateValue(event.target.value)} />
    </BasicField>
  );
};
