import type { ValidationResult } from '@axonivy/user-editor-protocol';
import { rowClass } from './ValidationRow';

test('rowClass', () => {
  expect(rowClass([])).toEqual('');
  expect(rowClass([{ severity: 'INFO' }] as ValidationResult[])).toEqual('');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'WARNING' }] as ValidationResult[])).toEqual('user-editor-row-warning');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'WARNING' }, { severity: 'ERROR' }] as ValidationResult[])).toEqual(
    'user-editor-row-error'
  );
});
