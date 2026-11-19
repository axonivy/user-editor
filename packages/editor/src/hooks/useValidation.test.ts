import type { UserData, ValidationResult } from '@axonivy/user-editor-protocol';
import { customRenderHook } from 'test-utils';
import { useValidations } from './useValidation';

test('useValidations', () => {
  expect(renderValidations('').result.current).toEqual([]);
  expect(renderValidations('Employee').result.current).toEqual([validations[0]]);
  expect(renderValidations('Teamleader').result.current).toEqual([validations[1], validations[2], validations[3]]);
  expect(renderValidations('Manager').result.current).toEqual([validations[4]]);
  expect(renderValidations('HR Manager').result.current).toEqual([]);
});

const renderValidations = (path: string) => {
  return customRenderHook(() => useValidations(path), { wrapperProps: { appContext: { data, validations } } });
};

const data: Array<UserData> = [
  { name: 'Employee', fullName: '', emailAddress: '', password: '', roles: [], properties: {} },
  { name: 'Teamleader', fullName: '', emailAddress: '', password: '', roles: [], properties: {} },
  { name: 'Manager', fullName: '', emailAddress: '', password: '', roles: [], properties: {} },
  { name: 'HR Manager', fullName: '', emailAddress: '', password: '', roles: [], properties: {} }
];

const validations: Array<ValidationResult> = [
  { message: 'message0', path: 'Employee.id', severity: 'INFO', code: '', url: '' },
  { message: 'message1', path: 'Teamleader.parent', severity: 'INFO', code: '', url: '' },
  { message: 'message2', path: 'Teamleader', severity: 'WARNING', code: '', url: '' },
  { message: 'message3', path: 'Teamleader', severity: 'ERROR', code: '', url: '' },
  { message: 'message4', path: 'Manager', severity: 'INFO', code: '', url: '' }
];
