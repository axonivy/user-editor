import {
  BasicField,
  dataTableHelper,
  InputCell,
  SelectRow,
  SortableHeader,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader
} from '@axonivy/ui-components';
import { flexRender } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useResizableEditableTable } from '../../../hooks/useResizableEditableTable';

type Property = {
  key: string;
  value: string;
};

type PropertiesTableProps = {
  data: Array<Property>;
  onChange: (props: Array<Property>) => void;
};

const { columnHelper } = dataTableHelper<Property>();

export const PropertiesTable = ({ data, onChange }: PropertiesTableProps) => {
  const { t } = useTranslation();
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('key', {
          header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
          cell: cell => <InputCell cell={cell} />
        }),
        columnHelper.accessor('value', {
          header: ({ column }) => <SortableHeader column={column} name={t('common.label.value')} />,
          cell: cell => <InputCell cell={cell} />
        })
      ]),
    [t]
  );

  const { table, tableRef, selectedRowActions, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: { key: '', value: '' }
  });

  return (
    <BasicField label={t('common.label.properties')} control={selectedRowActions()}>
      <div>
        <Table ref={tableRef}>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <SelectRow key={row.id} row={row}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }} onClick={cell.getSelectionStartHandler()}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </SelectRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton()}
      </div>
    </BasicField>
  );
};
