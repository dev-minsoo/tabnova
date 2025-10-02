import { useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { Translation } from '../utils/i18n';

interface TabContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  tab: chrome.tabs.Tab;
  x: number;
  y: number;
  translation: Translation;
}

export function TabContextMenu({ isOpen, onClose, tab, x, y, translation }: TabContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCloseTab = async () => {
    if (tab.id) {
      try {
        await chrome.tabs.remove(tab.id);
      } catch (error) {
        console.error('Error closing tab:', error);
      }
    }
    onClose();
  };

  const handleCloseOtherTabs = async () => {
    if (tab.id && tab.windowId) {
      try {
        const allTabs = await chrome.tabs.query({ windowId: tab.windowId });
        const otherTabIds = allTabs.filter(t => t.id !== tab.id).map(t => t.id!);
        await chrome.tabs.remove(otherTabIds);
      } catch (error) {
        console.error('Error closing other tabs:', error);
      }
    }
    onClose();
  };

  const handleDuplicateTab = async () => {
    if (tab.id) {
      try {
        await chrome.tabs.duplicate(tab.id);
      } catch (error) {
        console.error('Error duplicating tab:', error);
      }
    }
    onClose();
  };

  const menuItems = [
    { id: 'close', label: translation.tab.closeTab, icon: 'close', onClick: handleCloseTab },
    { id: 'closeOthers', label: translation.tab.closeOtherTabs, icon: 'close', onClick: handleCloseOtherTabs },
    { id: 'duplicate', label: translation.tab.duplicateTab, icon: 'tabs', onClick: handleDuplicateTab },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-40"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {menuItems.map((item) => (
        <button
          key={item.id}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
          onClick={item.onClick}
        >
          <Icon
            name={item.icon}
            size={16}
            className="mr-3 opacity-60"
          />
          {item.label}
        </button>
      ))}
    </div>
  );
}