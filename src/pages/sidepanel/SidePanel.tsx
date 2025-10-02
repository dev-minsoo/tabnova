import { useState, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { Header } from '../../components/Header';
import { Body } from '../../components/Body';
import { Footer } from '../../components/Footer';
import { BookmarkList } from '../../components/BookmarkList';
import { HistoryList } from '../../components/HistoryList';
import { applyTheme, getSettings } from '../../utils/settings';
import { getTranslation, Translation } from '../../utils/i18n';

function SidePanel() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredTabs, setFilteredTabs] = useState<chrome.tabs.Tab[]>([]);
  const [currentTab, setCurrentTab] = useState<'tabs' | 'bookmark' | 'history' | 'settings'>('tabs');
  const [translation, setTranslation] = useState<Translation | null>(null);

  useEffect(() => {
    const loadTranslation = async () => {
      try {
        const settings = await getSettings();
        setTranslation(getTranslation(settings.language));
      } catch (error) {
        console.error('Error loading translation:', error);
      }
    };

    loadTranslation();
  }, []);

  useEffect(() => {
    const loadTabs = async () => {
      try {
        const currentWindow = await chrome.windows.getCurrent();
        const windowTabs = await chrome.tabs.query({ windowId: currentWindow.id });
        setTabs(windowTabs);

        const activeTab = windowTabs.find(tab => tab.active);
        if (activeTab) {
          setActiveTabId(activeTab.id);
        }
      } catch (error) {
        console.error('Error loading tabs:', error);
      }
    };

    loadTabs();

    // Listen for tab updates
    const handleTabUpdated = () => {
      loadTabs();
    };

    const handleTabCreated = () => {
      loadTabs();
    };

    const handleTabRemoved = () => {
      loadTabs();
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdated);
    chrome.tabs.onCreated.addListener(handleTabCreated);
    chrome.tabs.onRemoved.addListener(handleTabRemoved);

    // Listen for settings changes from Options page
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'sync' && changes.settings) {
        const newSettings = changes.settings.newValue;
        if (newSettings) {
          if (newSettings.theme) {
            applyTheme(newSettings.theme);
          }
          if (newSettings.language) {
            setTranslation(getTranslation(newSettings.language));
          }
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
      chrome.tabs.onCreated.removeListener(handleTabCreated);
      chrome.tabs.onRemoved.removeListener(handleTabRemoved);
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // Filter tabs based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTabs(tabs);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tabs.filter(tab => {
        const title = tab.title?.toLowerCase() || '';
        const url = tab.url?.toLowerCase() || '';
        return title.includes(query) || url.includes(query);
      });
      setFilteredTabs(filtered);
    }
  }, [tabs, searchQuery]);


  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tabs.findIndex(tab => tab.id === active.id);
      const newIndex = tabs.findIndex(tab => tab.id === over.id);

      const newTabs = arrayMove(tabs, oldIndex, newIndex);
      setTabs(newTabs);

      // Update tab positions in Chrome
      try {
        await chrome.tabs.move(active.id, { index: newIndex });
      } catch (error) {
        console.error('Error moving tab:', error);
        // Revert on error
        setTabs(tabs);
      }
    }
  };

  const handleTabClick = async (tabId: number | undefined) => {
    if (tabId) {
      try {
        await chrome.tabs.update(tabId, { active: true });
        setActiveTabId(tabId);
      } catch (error) {
        console.error('Error activating tab:', error);
      }
    }
  };

  const handleTabClose = async (tabId: number | undefined) => {
    if (tabId) {
      try {
        await chrome.tabs.remove(tabId);
      } catch (error) {
        console.error('Error closing tab:', error);
      }
    }
  };

  const handleNewTabSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`;
        await chrome.tabs.create({ url: searchUrl });
        setSearchQuery(''); // Clear search after opening new tab
      } catch (error) {
        console.error('Error creating new tab for search:', error);
      }
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleNewTabSearch();
    } else if (e.key === 'Escape') {
      setSearchQuery('');
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{
            backgroundColor: '#fef08a',
            color: '#92400e',
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderContent = () => {
    if (!translation) return null;

    switch (currentTab) {
      case 'tabs':
        return (
          <Body
            tabs={tabs}
            filteredTabs={filteredTabs}
            activeTabId={activeTabId}
            searchQuery={searchQuery}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
            onDragEnd={handleDragEnd}
            highlightText={highlightText}
            translation={translation}
          />
        );
      case 'bookmark':
        return (
          <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-0">
            <BookmarkList
              highlightText={highlightText}
              searchQuery={searchQuery}
            />
          </div>
        );
      case 'history':
        return (
          <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-0">
            <HistoryList
              highlightText={highlightText}
              searchQuery={searchQuery}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!translation) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="h-full overflow-x-hidden w-full max-w-full relative flex flex-col"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewTabSearch={handleNewTabSearch}
        onSearchKeyDown={handleSearchKeyDown}
        translation={translation}
      />

      {renderContent()}

      <Footer
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        translation={translation}
      />
    </div>
  );
}

export default SidePanel;
