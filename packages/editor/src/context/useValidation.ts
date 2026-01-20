import type { ValidationResult } from '@axonivy/user-editor-protocol';
import { useAppContext } from './AppContext';

export function useValidations(path: string): ValidationResult[] {
  const { validations } = useAppContext();
  if (path === '') {
    return [];
  }
  return validations.filter(val => val.path.startsWith(path));
}
