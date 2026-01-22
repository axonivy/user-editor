import { Button, cn, Flex, IvyIcon, useField, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Combobox } from '@base-ui/react/combobox';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RoleCombobox.module.css';

type RoleComboboxProps = {
  value: string[];
  onChange: (value: string[]) => void;
  roles: Array<string>;
};

export default function RoleCombobox({ value, onChange, roles }: RoleComboboxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { inputProps } = useField();
  const { t } = useTranslation();
  const readonly = useReadonly();
  const items = useMemo(() => {
    const merged = [...roles];
    value.filter(v => !merged.includes(v)).forEach(v => merged.push(v));
    return merged;
  }, [roles, value]);

  return (
    <Combobox.Root items={items} multiple value={value} onValueChange={onChange} disabled={readonly}>
      <Combobox.Chips className={cn(styles.Chips, 'ui-combobox-root')} ref={containerRef}>
        <Combobox.Value>
          {(roles: string[]) => (
            <>
              {roles.map(role => (
                <Combobox.Chip key={role} className={styles.Chip} aria-label={role}>
                  {role}
                  <Combobox.ChipRemove aria-label={t('common.label.remove')} render={<Button icon={IvyIcons.Close} />} />
                </Combobox.Chip>
              ))}
              <Flex alignItems='center' gap={1} className={styles.InputGroup}>
                <Combobox.Input className={styles.Input} {...inputProps} data-value={roles.join(',')} />
                <Combobox.Trigger className={styles.Trigger} render={<Button icon={IvyIcons.Chevron} rotate={90} />} />
              </Flex>
            </>
          )}
        </Combobox.Value>
      </Combobox.Chips>

      <Combobox.Portal>
        <Combobox.Positioner className={styles.Positioner} sideOffset={4} anchor={containerRef}>
          <Combobox.Popup className={styles.Popup}>
            <Combobox.Empty className={styles.Empty}>{t('label.noRolesFound')}</Combobox.Empty>
            <Combobox.List>
              {(role: string) => (
                <Combobox.Item key={role} className={styles.Item} value={role}>
                  <Combobox.ItemIndicator className={styles.ItemIndicator}>
                    <IvyIcon icon={IvyIcons.Check} />
                  </Combobox.ItemIndicator>
                  <div className={styles.ItemText}>{role}</div>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
