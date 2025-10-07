import React, { useState, useEffect } from 'react';
import {
  Add,
  ArrowBack,
  ArrowForward,
  Refresh,
  VolumeOff,
  VolumeUp,
} from '@mui/icons-material';
import { IconButton } from './IconButton';
import { getTranslation, Translation } from '../utils/i18n';
import { getSettings } from '../utils/settings';

const ToolBar: React.FC = () => {
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [hasAudibleTabs, setHasAudibleTabs] = useState(false);
  const [allAudibleTabsMuted, setAllAudibleTabsMuted] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      setTranslation(getTranslation(settings.language));
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const updateAudioState = async () => {
      const tabs = await chrome.tabs.query({});
      const audibleTabs = tabs.filter(tab => tab.audible);
      const mutedAudibleTabs = audibleTabs.filter(tab => tab.mutedInfo?.muted);

      setHasAudibleTabs(audibleTabs.length > 0);
      setAllAudibleTabsMuted(audibleTabs.length > 0 && audibleTabs.length === mutedAudibleTabs.length);
    };

    updateAudioState();

    const handleTabUpdated = () => {
      updateAudioState();
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdated);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    };
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

  const handleToggleMuteAll = async () => {
    const tabs = await chrome.tabs.query({});
    const audibleTabs = tabs.filter(tab => tab.audible);

    for (const tab of audibleTabs) {
      if (tab.id) {
        chrome.tabs.update(tab.id, { muted: !allAudibleTabsMuted });
      }
    }
  };

  return (
    <div className="toolbar">
      <IconButton
        icon={<Add />}
        tooltip={translation.toolbar.newTab}
        onClick={handleNewTab}
      />
      <IconButton
        icon={<Refresh />}
        tooltip={translation.toolbar.refresh}
        onClick={handleRefresh}
      />
      {hasAudibleTabs && (
        <IconButton
          icon={allAudibleTabsMuted ? <VolumeUp /> : <VolumeOff />}
          tooltip={allAudibleTabsMuted ? translation.toolbar.unmuteAll : translation.toolbar.muteAll}
          onClick={handleToggleMuteAll}
        />
      )}
    </div>
  );
};

export default ToolBar;
