import {
  BasicField,
  Button,
  deleteFirstSelectedRow,
  Flex,
  IvyIcon,
  PanelMessage,
  selectRow,
  Separator,
  SortableHeader,
  Table,
  TableBody,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly,
  useTableGlobalFilter,
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { UserData } from '@axonivy/user-editor-protocol';
import { getCoreRowModel, useReactTable, type ColumnDef, type Table as ReactTable } from '@tanstack/react-table';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { AddUserDialog } from '../dialog/AddUserDialog';
import './Main.css';
import { ValidationRow } from './ValidationRow';

export const Main = () => {
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex, detail, setDetail } = useAppContext();

  const selection = useTableSelect<UserData>({
    onSelect: selectedRows => {
      const selectedRowIndex = Object.keys(selectedRows).find(key => selectedRows[key]);
      if (selectedRowIndex === undefined) {
        setSelectedIndex(-1);
        return;
      }
      setSelectedIndex(Number(selectedRowIndex));
    }
  });
  const globalFilter = useTableGlobalFilter();
  const sort = useTableSort();
  const columns: Array<ColumnDef<UserData, string>> = [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
      cell: cell => (
        <Flex alignItems='center' gap={1}>
          {<IvyIcon icon={IvyIcons.Users} />}
          <span>{cell.getValue()}</span>
        </Flex>
      )
    }
  ];

  const table = useReactTable({
    ...selection.options,
    ...globalFilter.options,
    ...sort.options,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...sort.tableState,
      ...globalFilter.tableState
    }
  });

  const { handleKeyDown } = useTableKeyHandler({
    table,
    data
  });

  const deleteUser = () =>
    setData(old => {
      const selectedRow = table.getSelectedRowModel().flatRows[0];
      if (!selectedRow) {
        return old;
      }
      return deleteFirstSelectedRow(table, old).newData;
    });

  const resetSelection = () => {
    selectRow(table);
  };

  const hotkeys = useKnownHotkeys();
  const readonly = useReadonly();
  const ref = useHotkeys<HTMLDivElement>(hotkeys.deleteUser.hotkey, () => deleteUser(), { scopes: ['global'], enabled: !readonly });
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  if (data === undefined || data.length === 0) {
    return (
      <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
        <PanelMessage icon={IvyIcons.Tool} message={t('message.addFirstUser')} mode='column'>
          <AddUserDialog table={table}>
            <Button size='large' variant='primary' icon={IvyIcons.Plus}>
              {t('dialog.addUser.title')}
            </Button>
          </AddUserDialog>
        </PanelMessage>
      </Flex>
    );
  }

  return (
    <Flex direction='column' ref={ref} onClick={resetSelection} className='user-editor-main-content'>
      <BasicField
        tabIndex={-1}
        ref={firstElement}
        className='user-editor-table-field'
        label={t('label.users')}
        control={<Controls table={table} deleteUser={table.getSelectedRowModel().flatRows.length > 0 ? deleteUser : undefined} />}
        onClick={event => event.stopPropagation()}
      >
        {globalFilter.filter}
        <div className='user-editor-table-container'>
          <Table onKeyDown={e => handleKeyDown(e, () => setDetail(!detail))}>
            <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <ValidationRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </div>
      </BasicField>
    </Flex>
  );
};

const Controls = ({ table, deleteUser }: { table: ReactTable<UserData>; deleteUser?: () => void }) => {
  const readonly = useReadonly();
  const hotkeys = useKnownHotkeys();
  if (readonly) {
    return null;
  }
  return (
    <Flex gap={2}>
      <AddUserDialog table={table}>
        <Button icon={IvyIcons.Plus} aria-label={hotkeys.addUser.label} />
      </AddUserDialog>
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button icon={IvyIcons.Trash} onClick={deleteUser} disabled={deleteUser === undefined} aria-label={hotkeys.deleteUser.label} />
          </TooltipTrigger>
          <TooltipContent>{hotkeys.deleteUser.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Flex>
  );
};
