import { BasicField, BasicInput, Flex, PanelMessage, type MessageData } from '@axonivy/ui-components';
import type { Severity, UserData, ValidationResult } from '@axonivy/user-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useValidations } from '../../hooks/useValidation';
import './DetailContent.css';
import { NameInput } from './components/NameInput';
import { PropertiesTable } from './components/PropertiesTable';
import RoleCombobox from './components/RoleCombobox';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const user = useMemo(() => data[selectedIndex], [data, selectedIndex]);
  const validations = useValidations(user?.name ?? '');
  const properties = useMemo(() => Object.entries(user?.properties ?? {}).map(([key, value]) => ({ key, value })), [user?.properties]);
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
  const passwordMessage = fieldMessage(validations, user.name, 'password');
  const fullNameMessage = fieldMessage(validations, user.name, 'fullName');
  const emailAddressMessage = fieldMessage(validations, user.name, 'emailAddress');
  const rolesMessage = fieldMessage(validations, user.name, 'roles');

  return (
    <Flex direction='column' gap={4} className='user-editor-detail-content'>
      <NameInput
        value={user.name}
        onChange={value => handleAttributeChange('name', value)}
        users={data.filter(u => u.name !== user.name)}
        message={nameMessage}
      />
      <BasicField label={t('common.label.password')} message={passwordMessage}>
        <BasicInput value={user.password} onChange={event => handleAttributeChange('password', event.target.value)} />
      </BasicField>
      <BasicField label={t('common.label.fullName')} message={fullNameMessage}>
        <BasicInput value={user.fullName} onChange={event => handleAttributeChange('fullName', event.target.value)} />
      </BasicField>
      <BasicField label={t('common.label.emailAddress')} message={emailAddressMessage}>
        <BasicInput value={user.emailAddress} onChange={event => handleAttributeChange('emailAddress', event.target.value)} />
      </BasicField>
      <BasicField label={t('common.label.roles')} message={rolesMessage}>
        <RoleCombobox
          value={user.roles}
          onChange={value => handleAttributeChange('roles', value)}
          roles={['Employee', 'Teamleader', 'Manager', 'HR Manager']}
        />
      </BasicField>
      <PropertiesTable
        key={user.name}
        data={properties}
        onChange={change => handleAttributeChange('properties', Object.fromEntries(change.map(({ key, value }) => [key, value])))}
      />
    </Flex>
  );
};

const fieldMessage = (validations: Array<ValidationResult>, user: string, field: keyof UserData) =>
  validations
    .filter(v => v.path === `${user}.${field}`)
    .map<MessageData>(v => ({ message: v.message, variant: v.severity.toLocaleLowerCase() as Lowercase<Severity> }))[0];
