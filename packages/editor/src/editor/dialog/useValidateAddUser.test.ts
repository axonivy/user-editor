import type { UserData } from '@axonivy/user-editor-protocol';
import { customRenderHook } from 'test-utils';
import { useValidateAddUser } from './useValidateAddUser';

const data: Array<UserData> = [{ name: 'Employee' }, { name: 'Teamleader' }, { name: 'Manager' }, { name: 'HR Manager' }];

const validate = (name: string) => {
  const { result } = customRenderHook(() => useValidateAddUser(name, data));
  return result.current;
};

test('validate', () => {
  expect(validate('Name').nameValidationMessage).toBeUndefined();
  const emptyError = { message: 'Name cannot be empty.', variant: 'error' };
  expect(validate('').nameValidationMessage).toEqual(emptyError);
  expect(validate('   ').nameValidationMessage).toEqual(emptyError);
  const alreadyExistError = { message: 'User already exists.', variant: 'error' };
  expect(validate('Employee').nameValidationMessage).toEqual(alreadyExistError);
  expect(validate('Teamleader    ').nameValidationMessage).toEqual(alreadyExistError);
});
