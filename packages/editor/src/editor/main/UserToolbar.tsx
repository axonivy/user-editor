import {
  Button,
  Flex,
  Separator,
  Toolbar,
  ToolbarContainer,
  ToolbarTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly,
  useRedoHotkey,
  useUndoHotkey
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';

export const UserToolbar = () => {
  const { detail, setDetail, context } = useAppContext();
  const readonly = useReadonly();
  const { t } = useTranslation();

  const firstElement = useRef<HTMLDivElement>(null);
  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });
  useHotkeys(
    hotkeys.focusInscription.hotkey,
    () => {
      setDetail(true);
      document.querySelector<HTMLElement>('.user-editor-detail-header')?.focus();
    },
    {
      scopes: ['global']
    }
  );
  return (
    <Toolbar tabIndex={-1} ref={firstElement} className='user-editor-main-toolbar'>
      <ToolbarTitle className='user-editor-main-toolbar-title'>{t('title.main', { name: context.pmv })}</ToolbarTitle>
      <Flex gap={1}>
        {!readonly && <EditButtons />}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                icon={IvyIcons.LayoutSidebarRightCollapse}
                size='large'
                onClick={() => setDetail(!detail)}
                aria-label={t('common.label.details')}
              />
            </TooltipTrigger>
            <TooltipContent>{t('common.label.details')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Flex>
    </Toolbar>
  );
};

const EditButtons = () => {
  const { history, setUnhistoriedVariables } = useAppContext();
  const hotkeys = useKnownHotkeys();
  const undo = () => history.undo(setUnhistoriedVariables);
  const redo = () => history.redo(setUnhistoriedVariables);
  useUndoHotkey(undo, { scopes: ['global'] });
  useRedoHotkey(redo, { scopes: ['global'] });
  return (
    <ToolbarContainer maxWidth={450}>
      <Flex>
        <Flex gap={1}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label={hotkeys.undo.label} icon={IvyIcons.Undo} size='large' onClick={undo} disabled={!history.canUndo} />
              </TooltipTrigger>
              <TooltipContent>{hotkeys.undo.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label={hotkeys.redo.label} icon={IvyIcons.Redo} size='large' onClick={redo} disabled={!history.canRedo} />
              </TooltipTrigger>
              <TooltipContent>{hotkeys.redo.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Flex>
        <Separator orientation='vertical' style={{ height: '26px', marginInline: 'var(--size-2)' }} />
      </Flex>
    </ToolbarContainer>
  );
};
