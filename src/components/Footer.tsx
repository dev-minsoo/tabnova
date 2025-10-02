import { TabButton } from './TabButton';
import { Translation } from '../utils/i18n';

type TabType = 'tabs' | 'bookmark' | 'history' | 'settings';

interface FooterProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  translation: Translation;
}

export function Footer({ activeTab, onTabChange, translation }: FooterProps) {
  const tabs = [
    {
      id: 'tabs' as TabType,
      icon: 'tabs',
      label: translation.common.tabs,
      tooltip: translation.common.tabs
    },
    {
      id: 'bookmark' as TabType,
      icon: 'bookmark',
      label: translation.common.bookmarks,
      tooltip: translation.common.bookmarks
    },
    {
      id: 'history' as TabType,
      icon: 'history',
      label: translation.footer.visitHistory,
      tooltip: translation.footer.visitHistory
    },
    {
      id: 'settings' as TabType,
      icon: 'settings',
      label: translation.common.settings,
      tooltip: translation.common.settings
    },
  ];

  const handleTabClick = (tabId: TabType) => {
    if (tabId === 'settings') {
      // Open options page
      chrome.runtime.openOptionsPage();
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <div
      className="border-t"
      style={{
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div className="flex">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            label={tab.label}
            tooltip={tab.tooltip}
            isActive={activeTab === tab.id}
            onClick={handleTabClick}
          />
        ))}
      </div>
    </div>
  );
}