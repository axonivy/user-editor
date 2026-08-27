import { cn, MessageRow, SelectRow, TableCell, type DataTableFeatures } from '@axonivy/ui-components';
import type { Severity, UserData, ValidationResult } from '@axonivy/user-editor-protocol';
import { flexRender, type Row } from '@tanstack/react-table';
import { useValidations } from '../../hooks/useValidation';

type ValidationRowProps = {
  row: Row<DataTableFeatures, UserData>;
};

export const ValidationRow = ({ row }: ValidationRowProps) => {
  const validations = useValidations(row.original.name);
  return (
    <>
      <SelectRow row={row} className={rowClass(validations)}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </SelectRow>
      {validations?.map((val, index) => (
        <MessageRow
          // eslint-disable-next-line @eslint-react/no-array-index-key
          key={`${index}-${val.message}`}
          columnCount={row.getVisibleCells().length}
          message={{ message: val.message, variant: val.severity.toLocaleLowerCase() as Lowercase<Severity> }}
        />
      ))}
    </>
  );
};

export const rowClass = (validations?: Array<ValidationResult>) => {
  if (!validations) {
    return '';
  }
  if (validations.find(message => message.severity === 'ERROR')) {
    return cn('border-b-error!');
  }
  if (validations.find(message => message.severity === 'WARNING')) {
    return cn('border-b-warning!');
  }
  return '';
};
