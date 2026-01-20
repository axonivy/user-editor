import type { UserData, ValidationResult } from '@axonivy/user-editor-protocol';

export const validateMock = (data: Array<UserData>): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  data.forEach(user => {
    if (user.name.includes('#')) {
      validations.push({ path: `${user.name}.name`, message: `User ${user.name} contains invalid characters`, severity: 'ERROR' });
    }
  });
  return validations;
};
