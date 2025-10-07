import React, { useState, useEffect } from 'react';
import { Add, Delete, Language } from '@mui/icons-material';
import { IconButton } from './IconButton';
import { getTranslation, Translation } from '../utils/i18n';
import { getSettings } from '../utils/settings';

interface QuickLink {
  id: string;
  name: string;
  url: string;
}

const DEFAULT_LINKS: QuickLink[] = [
  { id: '1', name: 'Google', url: 'https://www.google.com' },
  { id: '2', name: 'Gmail', url: 'https://mail.google.com' },
  { id: '3', name: 'YouTube', url: 'https://www.youtube.com' },
];

const QuickMenu: React.FC = () => {
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [links, setLinks] = useState<QuickLink[]>(DEFAULT_LINKS);
  const [isAdding, setIsAdding] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      setTranslation(getTranslation(settings.language));
    };
    loadSettings();

    chrome.storage.sync.get(['quickLinks'], (result) => {
      if (result.quickLinks) {
        setLinks(result.quickLinks);
      }
    });
  }, []);

  if (!translation) return null;

  const saveLinks = (updatedLinks: QuickLink[]) => {
    setLinks(updatedLinks);
    chrome.storage.sync.set({ quickLinks: updatedLinks });
  };

  const handleOpenLink = (url: string) => {
    chrome.tabs.create({ url });
  };

  const handleAddLink = () => {
    if (newLinkName && newLinkUrl) {
      const newLink: QuickLink = {
        id: Date.now().toString(),
        name: newLinkName,
        url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`,
      };
      saveLinks([...links, newLink]);
      setNewLinkName('');
      setNewLinkUrl('');
      setIsAdding(false);
    }
  };

  const handleDeleteLink = (id: string) => {
    saveLinks(links.filter(link => link.id !== id));
  };

  return (
    <div className="quick-menu">
      <div className="quick-menu-links">
        {links.map((link) => (
          <div key={link.id} className="quick-link-item">
            <button
              className="quick-link-button"
              onClick={() => handleOpenLink(link.url)}
              title={link.url}
            >
              <Language fontSize="small" />
              <span>{link.name}</span>
            </button>
            <IconButton
              icon={<Delete />}
              tooltip={translation.quickMenu.delete}
              onClick={() => handleDeleteLink(link.id)}
              size="small"
            />
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="quick-link-add-form">
          <input
            type="text"
            placeholder={translation.quickMenu.linkName}
            value={newLinkName}
            onChange={(e) => setNewLinkName(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            placeholder={translation.quickMenu.linkUrl}
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
          />
          <div className="add-form-buttons">
            <button onClick={handleAddLink}>{translation.quickMenu.add}</button>
            <button onClick={() => {
              setIsAdding(false);
              setNewLinkName('');
              setNewLinkUrl('');
            }}>{translation.quickMenu.cancel}</button>
          </div>
        </div>
      ) : (
        <IconButton
          icon={<Add />}
          tooltip={translation.quickMenu.addQuickLink}
          onClick={() => setIsAdding(true)}
        />
      )}
    </div>
  );
};

export default QuickMenu;
