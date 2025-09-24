import { Icon } from './Icon';

type TabType = 'tabs' | 'bookmark' | 'history' | 'settings';

interface TabButtonProps {
  id: TabType;
  icon: string;
  label: string;
  tooltip: string;
  isActive: boolean;
  onClick: (tabId: TabType) => void;
}

export function TabButton({ id, icon, label, tooltip, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex-1 flex flex-col items-center justify-center py-2 px-2 transition-colors ${isActive
        ? 'bg-blue-50 text-blue-600 border-t-2 border-blue-600'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
    >
      <Icon
        name={icon}
        size={16}
        className={`${isActive ? 'opacity-100' : 'opacity-60'}`}
        tooltip={tooltip}
        tooltipPosition="top"
      />
    </button>
  );
}