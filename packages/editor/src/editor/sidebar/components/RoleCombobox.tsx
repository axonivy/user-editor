import { type BasicComboboxItem, BasicMultiCombobox, useField, useReadonly } from '@axonivy/ui-components';
import type { RoleMeta } from '@axonivy/user-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../hooks/useMeta';

type RoleComboboxProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export default function RoleCombobox({ value, onChange }: RoleComboboxProps) {
  const { inputProps } = useField();
  const { t } = useTranslation();
  const readonly = useReadonly();
  const { context } = useAppContext();

  const roles = useMeta('meta/roles/all', context, []).data;
  const items = useMemo<BasicComboboxItem[]>(() => {
    const merged = [...roles];
    const mergedIds = merged.map(r => r.id);
    value.filter(v => !mergedIds.includes(v)).forEach(v => merged.push({ id: v, label: '' }));
    return merged.map(role => ({ value: role.id, label: roleLabel(role) }));
  }, [roles, value]);
  const comboValue = useMemo(() => value.map(v => items.find(r => r.value === v) ?? { value: v, label: v }), [value, items]);

  return (
    <BasicMultiCombobox
      items={items}
      isItemEqualToValue={(itemValue, value) => itemValue.value === value.value}
      value={comboValue}
      onValueChange={items => onChange(items.map(item => item.value))}
      disabled={readonly}
      chipRenderer={item => item.value}
      chipRemoveLabel={t('common.label.remove')}
      emptyLabel={t('label.noRolesFound')}
      {...inputProps}
    />
  );
}

export const roleLabel = (role: RoleMeta) => `${role.id}${role.label ? ` (${role.label})` : ''}`;
