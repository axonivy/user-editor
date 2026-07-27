import type { RoleMeta } from '@axonivy/user-editor-protocol';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { customRender } from 'test-utils';
import RoleCombobox from './RoleCombobox';

const roles: Array<RoleMeta> = [
  { id: 'Employee', label: 'Employee' },
  { id: 'Teamleader', label: '' },
  { id: 'Manager', label: '' },
  { id: 'HR Manager', label: '' }
];

const renderCombobox = (data?: Array<string>) => {
  let value = data ?? ['Employee'];
  customRender(<RoleCombobox value={value} onChange={change => (value = change)} />, { wrapperProps: { meta: { roles } } });
  return { data: () => value };
};

test('unknown value', async () => {
  const { data } = renderCombobox(['unknown']);
  const input = screen.getByRole('combobox');
  expect(input).toHaveAttribute('data-value', 'unknown');
  await userEvent.click(input);
  expect(screen.getByRole('listbox')).toBeVisible();
  expect(screen.getAllByRole('option')).toHaveLength(5);
  expect(screen.getByRole('option', { name: 'unknown' })).toHaveAttribute('data-selected');
  expect(data()).toEqual(['unknown']);
});
