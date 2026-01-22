import { Button, SidebarHeader, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useAction } from '../../hooks/useAction';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { DetailContent } from './DetailContent';

export const Sidebar = () => {
  const { data, helpUrl, selectedIndex } = useAppContext();
  const user = data[selectedIndex];
  const { t } = useTranslation();
  const openUrl = useAction('openUrl');
  const { openHelp: helpText } = useKnownHotkeys();
  useHotkeys(helpText.hotkey, () => openUrl(helpUrl), { scopes: ['global'] });

  return (
    <>
      <SidebarHeader title={user?.name ?? t('title.detail')} icon={IvyIcons.PenEdit} className='user-editor-detail-header' tabIndex={-1}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={helpText.label} />
            </TooltipTrigger>
            <TooltipContent>{helpText.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarHeader>
      <DetailContent />
    </>
  );
};
