import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { customRender } from 'test-utils';
import RoleCombobox from './RoleCombobox';

const roles: Array<string> = ['Employee', 'Teamleader', 'Manager', 'HR Manager'];

const renderCombobox = (data?: Array<string>) => {
  let value = data ?? ['Employee'];
  customRender(<RoleCombobox value={value} onChange={change => (value = change)} roles={roles} />);
  return { data: () => value };
};

test('select', async () => {
  const { data } = renderCombobox();
  const input = screen.getByRole('combobox');
  expect(input).toHaveAttribute('data-value', 'Employee');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

  await userEvent.click(input);
  expect(screen.getByRole('listbox')).toBeVisible();
  expect(screen.getAllByRole('option')).toHaveLength(4);
  expect(screen.getByRole('option', { name: 'Employee' })).toHaveAttribute('data-selected');
  await userEvent.click(screen.getByRole('option', { name: 'Teamleader' }));
  expect(data()).toEqual(['Employee', 'Teamleader']);
});

test('select can be handled with keyboard', async () => {
  const { data } = renderCombobox();
  const input = screen.getByRole('combobox');
  expect(input).toHaveAttribute('data-value', 'Employee');
  await userEvent.keyboard('[Tab]');
  expect(input).toHaveFocus();
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

  await userEvent.keyboard('[ArrowDown]');
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(screen.getAllByRole('option')).toHaveLength(4);
  expect(screen.getByRole('option', { name: 'Employee' })).toHaveAttribute('data-selected');
  expect(screen.getByRole('option', { name: 'Employee' })).toHaveAttribute('data-highlighted');
  await userEvent.keyboard('t');
  expect(screen.getAllByRole('option')).toHaveLength(1);
  await userEvent.keyboard('[ArrowDown]');
  expect(screen.getByRole('option', { name: 'Teamleader' })).toHaveAttribute('data-highlighted');
  await userEvent.keyboard('[Enter]');
  expect(data()).toEqual(['Employee', 'Teamleader']);
});

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

test('readonly mode', () => {
  customRender(<RoleCombobox value={['Employee']} onChange={() => {}} roles={roles} />, { wrapperProps: { readonly: true } });
  expect(screen.getByRole('combobox')).toBeDisabled();
});
