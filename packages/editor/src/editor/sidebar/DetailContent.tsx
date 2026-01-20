import { BasicField, BasicInput, Flex, PanelMessage, type MessageData } from '@axonivy/ui-components';
import type { Severity, UserData, ValidationResult } from '@axonivy/user-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useValidations } from '../../context/useValidation';
import './DetailContent.css';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const user = useMemo(() => data[selectedIndex], [data, selectedIndex]);
  const validations = useValidations(user?.name ?? '');
  if (user === undefined) {
    return <PanelMessage message={t('label.noUserSelected')} />;
  }
  const handleAttributeChange = <T extends keyof UserData>(key: T, value: UserData[T]) =>
    setData(old => {
      const oldUser = old[selectedIndex];
      if (oldUser) {
        oldUser[key] = value;
      }
      return structuredClone(old);
    });

  const nameMessage = fieldMessage(validations, user.name, 'name');

  return (
    <Flex direction='column' gap={4} className='user-editor-detail-content'>
      <BasicField label={t('common.label.name')} message={nameMessage}>
        <BasicInput value={user.name} onChange={event => handleAttributeChange('name', event.target.value)} />
      </BasicField>
    </Flex>
  );
};

const fieldMessage = (validations: Array<ValidationResult>, user: string, field: keyof UserData) =>
  validations
    .filter(v => v.path === `${user}.${field}`)
    .map<MessageData>(v => ({ message: v.message, variant: v.severity.toLocaleLowerCase() as Lowercase<Severity> }))[0];
