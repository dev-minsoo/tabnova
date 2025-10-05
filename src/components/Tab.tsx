import { Icon } from './Icon';
import { useState, useEffect } from 'react';
import { Translation } from '../utils/i18n';

function FaviconWithFallback({
  favIconUrl,
  url,
  extensionIcon
}: {
  favIconUrl?: string;
  url?: string;
  extensionIcon?: string | null;
}) {
  const [error, setError] = useState(false);

  if (error || (!favIconUrl && !extensionIcon)) {
    return (
      <div className="flex-shrink-0 w-4 h-4 mr-2 mt-0.5">
        <Icon name="globe" size={16} className="opacity-60" />
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-4 h-4 mr-2 mt-0.5">
      <img
        src={extensionIcon || favIconUrl}
        className="w-full h-full object-contain"
        alt=""
        onError={() => setError(true)}
      />
    </div>
  );
}

interface TabProps {
  tab: chrome.tabs.Tab;
  isActive: boolean;
  onClick: (tabId: number | undefined) => void;
  onClose: (tabId: number | undefined) => void;
  onContextMenu?: (tab: chrome.tabs.Tab, x: number, y: number) => void;
  highlightText?: (text: string, query: string) => any;
  searchQuery?: string;
  className?: string;
  translation: Translation;
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
  className = '',
  translation
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

  const handleMuteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tab.id) {
      await chrome.tabs.update(tab.id, { muted: !tab.mutedInfo?.muted });
    }
  };

  return (
    <div
      className={`group flex items-center px-3 py-2 cursor-pointer w-full max-w-full overflow-hidden ${className}`}
      style={{
        backgroundColor: isActive ? 'rgba(var(--accent-color-rgb), 0.15)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
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
        <FaviconWithFallback
          favIconUrl={tab.favIconUrl}
          url={tab.url}
          extensionIcon={extensionIcon}
        />

        {/* Tab Info */}
        <div className="flex-grow min-w-0">
          {/* Tab Title */}
          <div
            className="truncate text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {highlightText && searchQuery ? highlightText(tab.title || '', searchQuery) : tab.title}
          </div>

          {/* URL - Show when searching */}
          {searchQuery && searchQuery.trim() && (
            <div
              className="truncate text-xs mt-0.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              {highlightText ? highlightText(tab.url || '', searchQuery) : tab.url}
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 ml-2 flex items-center gap-1">
        {/* Audio indicator */}
        {tab.audible && (
          <Icon
            name={tab.mutedInfo?.muted ? 'volumeOff' : 'volumeUp'}
            size={16}
            tooltip={tab.mutedInfo?.muted ? translation.tab.unmuteTab : translation.tab.muteTab}
            tooltipPosition="top"
            onClick={handleMuteToggle}
            className="opacity-70 hover:opacity-100 rounded-full p-1 cursor-pointer"
          />
        )}

        {/* Close Button */}
        <Icon
          name="close"
          size={16}
          tooltip={translation.tab.closeTab}
          tooltipPosition="top"
          onClick={(e) => {
            e.stopPropagation();
            onClose(tab.id);
          }}
          className="opacity-70 hover:opacity-100 rounded-full p-1 cursor-pointer"
        />
      </div>
    </div>
  );
}