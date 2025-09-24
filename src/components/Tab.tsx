import { Icon } from './Icon';
import { useState, useEffect } from 'react';

interface TabProps {
  tab: chrome.tabs.Tab;
  isActive: boolean;
  onClick: (tabId: number | undefined) => void;
  onClose: (tabId: number | undefined) => void;
  onContextMenu?: (tab: chrome.tabs.Tab, x: number, y: number) => void;
  highlightText?: (text: string, query: string) => any;
  searchQuery?: string;
  className?: string;
}

function getExtensionId(url: string): string | null {
  const match = url.match(/chrome-extension:\/\/([a-z]+)/);
  return match ? match[1] : null;
}

export function Tab({
  tab,
  isActive,
  onClick,
  onClose,
  onContextMenu,
  highlightText,
  searchQuery,
  className = ''
}: TabProps) {
  const [extensionIcon, setExtensionIcon] = useState<string | null>(null);

  useEffect(() => {
    if (tab.url?.startsWith('chrome-extension://') && !tab.favIconUrl) {
      const extensionId = getExtensionId(tab.url);
      if (extensionId) {
        const chromeIconUrl = `chrome://extension-icon/${extensionId}/16/0`;
        setExtensionIcon(chromeIconUrl);
      }
    }
  }, [tab.url, tab.favIconUrl]);

  return (
    <div
      className={`group flex items-center px-3 py-2 transition-colors cursor-pointer w-full max-w-full overflow-hidden ${isActive
          ? 'bg-gray-200'
          : 'hover:bg-gray-100'
        } ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(tab.id);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onContextMenu) {
          onContextMenu(tab, e.clientX, e.clientY);
        }
      }}
    >
      <div className="flex items-center flex-grow min-w-0">
        {/* Favicon */}
        <div className="flex-shrink-0 w-4 h-4 mr-2 mt-0.5">
          {extensionIcon ? (
            <img
              src={extensionIcon}
              className="w-full h-full object-contain"
              alt=""
              onError={(e) => {
                e.currentTarget.src = 'icons/globe16.png';
                e.currentTarget.onerror = null;
              }}
            />
          ) : tab.favIconUrl ? (
            <img
              src={tab.favIconUrl}
              className="w-full h-full object-contain"
              alt=""
              onError={(e) => {
                e.currentTarget.src = 'icons/globe16.png';
                e.currentTarget.onerror = null;
              }}
            />
          ) : (
            <img
              src="icons/globe16.png"
              className="w-full h-full object-contain"
              alt=""
            />
          )}
        </div>

        {/* Tab Info */}
        <div className="flex-grow min-w-0">
          {/* Tab Title */}
          <div className="truncate text-sm text-gray-700 font-medium">
            {highlightText && searchQuery ? highlightText(tab.title || '', searchQuery) : tab.title}
          </div>

          {/* URL - Show when searching */}
          {searchQuery && searchQuery.trim() && (
            <div className="truncate text-xs text-gray-500 mt-0.5">
              {highlightText ? highlightText(tab.url || '', searchQuery) : tab.url}
            </div>
          )}
        </div>
      </div>

      {/* Close Button */}
      <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Icon
          name="close"
          size={16}
          tooltip="탭 닫기"
          tooltipPosition="top"
          onClick={(e) => {
            e.stopPropagation();
            onClose(tab.id);
          }}
          className="opacity-70 hover:opacity-100 hover:bg-gray-200 rounded-full p-1 cursor-pointer transition-all"
        />
      </div>
    </div>
  );
}