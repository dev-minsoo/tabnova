import { TabButton } from './TabButton';

type TabType = 'tabs' | 'bookmark' | 'history' | 'settings';

interface FooterProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Footer({ activeTab, onTabChange }: FooterProps) {
  const tabs = [
    {
      id: 'tabs' as TabType,
      icon: 'tabs',
      label: '탭',
      tooltip: '탭'
    },
    {
      id: 'bookmark' as TabType,
      icon: 'bookmark',
      label: '북마크',
      tooltip: '북마크'
    },
    {
      id: 'history' as TabType,
      icon: 'history',
      label: '방문 기록',
      tooltip: '방문 기록'
    },
    {
      id: 'settings' as TabType,
      icon: 'settings',
      label: '설정',
      tooltip: '설정'
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
    <div className="border-t border-gray-200 bg-white">
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