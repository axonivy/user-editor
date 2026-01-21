import { Button, deepEqual, TableAddRow } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UseResizableEditableTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, string>[];
  onChange: (change: TData[]) => void;
  emptyDataObject: TData;
  specialUpdateData?: (data: Array<TData>, rowIndex: number, columnId: string) => void;
}

export const useResizableEditableTable = <TData,>({
  data,
  columns,
  onChange,
  emptyDataObject,
  specialUpdateData
}: UseResizableEditableTableProps<TData>) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<TData[]>(data);
  const [previousData, setPreviousData] = useState<TData[]>(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const tableRef = useRef<HTMLTableElement | null>(null);
  if (!deepEqual(previousData, data)) {
    setTableData(data);
    setPreviousData(data);
  }
  const updateTableData = (tableData: Array<TData>) => {
    setTableData(tableData);
    onChange(tableData.filter(obj => !deepEqual(obj, emptyDataObject)));
  };

  const updateData = (rowId: string, columnId: string, value: string) => {
    const rowIndex = parseInt(rowId);
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex && tableData[rowIndex]) {
        return {
          ...tableData[rowIndex],
          [columnId]: value
        };
      }
      return row;
    });
    specialUpdateData?.(updatedData, rowIndex, columnId);
    if (!deepEqual(updatedData.at(-1), emptyDataObject) && rowIndex === tableData.length - 1) {
      updateTableData([...updatedData, emptyDataObject]);
    } else {
      updateTableData(updatedData);
    }
  };

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, rowSelection },
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { updateData }
  });

  const addRow = () => {
    const newData = [...tableData];
    newData.push(emptyDataObject);
    updateTableData(newData);
    setRowSelection({ [`${newData.length - 1}`]: true });
    focusNewCell(tableRef.current, newData.length, 'input');
  };

  const showAddButton = () => {
    if (tableData.filter(obj => deepEqual(obj, emptyDataObject)).length === 0) {
      return <TableAddRow addRow={addRow} />;
    }
    return null;
  };

  const removeRow = (index: number) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    if (newData.length === 0) {
      setRowSelection({});
    } else if (index === tableData.length - 1) {
      setRowSelection({ [`${newData.length - 1}`]: true });
    }
    if (newData.length === 1 && deepEqual(newData[0], emptyDataObject)) {
      updateTableData([]);
    } else {
      updateTableData(newData);
    }
  };

  const selectedRowActions = () => {
    const firstSelectedRow = table.getSelectedRowModel().rows[0];
    if (firstSelectedRow === undefined) {
      return null;
    }
    return <Button size='small' title={t('label.removeRow')} icon={IvyIcons.Trash} onClick={() => removeRow(firstSelectedRow.index)} />;
  };

  return { table, tableRef, rowSelection, selectedRowActions, setRowSelection, showAddButton };
};

const focusNewCell = (domTable: HTMLTableElement | null, rowIndex: number, cellType: 'input' | 'button') => {
  const focus = () => {
    const validRows = Array.from(domTable?.rows ?? []).filter(row => !row.classList.contains('ui-message-row'));
    if (validRows.length === 0) {
      return;
    }
    const clampedIndex = Math.min(Math.max(rowIndex, 0), validRows.length - 1);
    validRows[clampedIndex]?.cells[0]?.querySelector(cellType)?.focus();
  };
  requestAnimationFrame(focus);
};
