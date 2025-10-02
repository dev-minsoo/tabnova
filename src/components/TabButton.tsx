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
      className={`flex-1 flex flex-col items-center justify-center py-2 px-2 border-t-2 ${isActive
        ? 'border-blue-600'
        : 'border-transparent'
        }`}
      style={{
        backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
        color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
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