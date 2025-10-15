import React, { useState, useEffect } from 'react';
import { Language } from '@mui/icons-material';
import { getTranslation, Translation } from '../utils/i18n';
import { getSettings } from '../utils/settings';
import { Icon } from './Icon';
import { useToast, ToastContainer } from './Toast';

function FaviconWithFallback({ faviconUrl, name, url }: { faviconUrl?: string; name: string; url: string }) {
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(faviconUrl);

  useEffect(() => {
    setError(false);
    setCurrentSrc(faviconUrl);
  }, [faviconUrl]);

  const handleError = () => {
    if (!error && currentSrc === faviconUrl) {
      // Try Google Favicon API as fallback
      try {
        const urlObj = new URL(url);
        setCurrentSrc(`https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`);
        setError(false);
      } catch (e) {
        setError(true);
      }
    } else {
      setError(true);
    }
  };

  if (error || !currentSrc) {
    return <Language fontSize="small" />;
  }

  return (
    <img
      src={currentSrc}
      alt={name}
      className="w-4 h-4"
      onError={handleError}
    />
  );
}

interface QuickLink {
  id: string;
  name: string;
  url: string;
  faviconUrl?: string;
}

const DEFAULT_LINKS: QuickLink[] = [];

const QuickMenu: React.FC = () => {
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [links, setLinks] = useState<QuickLink[]>(DEFAULT_LINKS);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    link: QuickLink | null;
  }>({ isOpen: false, x: 0, y: 0, link: null });
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const contextMenuRef = React.useRef<HTMLDivElement>(null);
  const { toasts, removeToast, success } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      setTranslation(getTranslation(settings.language));
    };

    loadSettings();

    // Listen for language changes
    const handleSettingsChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.settings) {
        const newSettings = changes.settings.newValue;
        if (newSettings?.language) {
          setTranslation(getTranslation(newSettings.language));
        }
      }
    };

    chrome.storage.sync.onChanged.addListener(handleSettingsChange);

    const loadLinks = () => {
      chrome.storage.sync.get(['quickLinks'], (result) => {
        if (result.quickLinks) {
          setLinks(result.quickLinks);
        }
      });
    };

    loadLinks();

    // Listen for storage changes to update QuickMenu in real-time
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.quickLinks) {
        setLinks(changes.quickLinks.newValue || []);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleSettingsChange);
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // Handle click outside context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ isOpen: false, x: 0, y: 0, link: null });
      }
    };

    if (contextMenu.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.isOpen]);

  if (!translation) return null;

  const saveLinks = (updatedLinks: QuickLink[]) => {
    setLinks(updatedLinks);
    chrome.storage.sync.set({ quickLinks: updatedLinks });
  };

  const handleOpenLink = (url: string) => {
    chrome.tabs.create({ url });
  };

  const handleDeleteLink = (id: string) => {
    saveLinks(links.filter(link => link.id !== id));
  };

  const handleRightClick = (e: React.MouseEvent, link: QuickLink) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      link,
    });
  };

  const handleCopyLink = () => {
    if (contextMenu.link && translation) {
      navigator.clipboard.writeText(contextMenu.link.url);
      success(translation.quickMenu.copied);
      setContextMenu({ isOpen: false, x: 0, y: 0, link: null });
    }
  };

  const handleEditLink = () => {
    if (contextMenu.link) {
      setEditingLink(contextMenu.link);
      setContextMenu({ isOpen: false, x: 0, y: 0, link: null });
    }
  };

  const handleSaveEdit = (name: string, url: string) => {
    if (editingLink && translation) {
      const updatedLinks = links.map(link =>
        link.id === editingLink.id
          ? { ...link, name, url: url.startsWith('http') ? url : `https://${url}` }
          : link
      );
      saveLinks(updatedLinks);
      success(translation.quickMenu.edited);
      setEditingLink(null);
    }
  };

  const handleRemoveFromMenu = () => {
    if (contextMenu.link && translation) {
      handleDeleteLink(contextMenu.link.id);
      success(translation.quickMenu.deleted);
      setContextMenu({ isOpen: false, x: 0, y: 0, link: null });
    }
  };

  if (links.length === 0) {
    return null;
  }

  return (
    <>
      <div className="quick-menu">
        <div className="quick-menu-links px-3">
          {links.map((link) => (
            <button
              key={link.id}
              className="quick-link-favicon cursor-pointer"
              onClick={() => handleOpenLink(link.url)}
              onContextMenu={(e) => handleRightClick(e, link)}
              title={link.name}
            >
              <FaviconWithFallback faviconUrl={link.faviconUrl} name={link.name} url={link.url} />
            </button>
          ))}
        </div>
      </div>

      {contextMenu.isOpen && contextMenu.link && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1 min-w-40"
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
        >
          <button
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            onClick={handleRemoveFromMenu}
          >
            <Icon
              name="delete"
              size={16}
              className="mr-3 opacity-60"
            />
            {translation.quickMenu.delete}
          </button>
          <button
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            onClick={handleEditLink}
          >
            <Icon
              name="edit"
              size={16}
              className="mr-3 opacity-60"
            />
            {translation.quickMenu.edit}
          </button>
          <button
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            onClick={handleCopyLink}
          >
            <Icon
              name="copy"
              size={16}
              className="mr-3 opacity-60"
            />
            {translation.quickMenu.copyLink}
          </button>
        </div>
      )}

      {editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-80">
            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">{translation.quickMenu.edit}</h3>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder={translation.quickMenu.linkName}
              defaultValue={editingLink.name}
              id="edit-name"
            />
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder={translation.quickMenu.linkUrl}
              defaultValue={editingLink.url}
              id="edit-url"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                onClick={() => setEditingLink(null)}
              >
                {translation.quickMenu.cancel}
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  const name = (document.getElementById('edit-name') as HTMLInputElement).value;
                  const url = (document.getElementById('edit-url') as HTMLInputElement).value;
                  handleSaveEdit(name, url);
                }}
              >
                {translation.quickMenu.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} position="bottom-center" />
    </>
  );
};

export default QuickMenu;
