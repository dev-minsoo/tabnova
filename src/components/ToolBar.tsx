import React, { useState, useEffect } from 'react';
import { Add, Refresh } from '@mui/icons-material';
import { IconButton } from './IconButton';
import { getTranslation, Translation } from '../utils/i18n';
import { getSettings } from '../utils/settings';

const ToolBar: React.FC = () => {
  const [translation, setTranslation] = useState<Translation | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      setTranslation(getTranslation(settings.language));
    };
    loadSettings();
  }, []);

  if (!translation) return null;

  const handleNewTab = () => {
    chrome.tabs.create({});
  };

  const handleRefresh = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.reload(tab.id);
    }
  };

  return (
    <div className="toolbar">
      <IconButton
        icon={<Add />}
        size="small"
        tooltip={translation.toolbar.newTab}
        onClick={handleNewTab}
      />
      <IconButton
        icon={<Refresh />}
        size="small"
        tooltip={translation.toolbar.refresh}
        onClick={handleRefresh}
      />
    </div>
  );
};

export default ToolBar;
