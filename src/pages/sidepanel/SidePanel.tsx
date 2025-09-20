import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../../components/SortableItem';
import { Icon } from '../../components/Icon';

function SidePanel() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredTabs, setFilteredTabs] = useState<chrome.tabs.Tab[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
      chrome.tabs.onCreated.removeListener(handleTabCreated);
      chrome.tabs.onRemoved.removeListener(handleTabRemoved);
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
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-800">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="h-full bg-gray-50 overflow-x-hidden w-full max-w-full relative">
      {/* Search Bar */}
      <div className="py-2 border-b border-gray-100 flex items-center relative z-10">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon name="search" size={16} className="opacity-60" />
          </div>
          <input
            type="text"
            placeholder="검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-10 pr-12 py-1.5 text-sm bg-gray-50 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Icon
                name="close"
                size={16}
                onClick={() => setSearchQuery('')}
                className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                tooltip="검색 지우기"
                tooltipPosition="bottom"
              />
              <Icon
                name="send"
                size={16}
                onClick={handleNewTabSearch}
                className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                tooltip="새 탭에서 검색"
                tooltipPosition="bottom"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tabs List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="w-full max-w-full overflow-hidden">
            <SortableContext items={filteredTabs.map(tab => tab.id!)} strategy={verticalListSortingStrategy}>
            {filteredTabs.length > 0 ? (
              filteredTabs.map((tab) => (
                <SortableItem
                  key={tab.id}
                  tab={tab}
                  activeTabId={activeTabId}
                  handleTabClick={handleTabClick}
                  handleTabClose={handleTabClose}
                  highlightText={highlightText}
                  searchQuery={searchQuery}
                />
              ))
            ) : searchQuery.trim() ? (
              <div className="p-4 text-center text-gray-500 text-sm h-full flex items-center justify-center">
                검색 결과가 없습니다
              </div>
            ) : null}
            </SortableContext>
          </div>
        </DndContext>
      </div>

      {/* Add Tab Button */}
      {!searchQuery.trim() && (
        <div className="p-3 border-t border-gray-100 flex justify-center">
          <button
            onClick={() => chrome.tabs.create({})}
            className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon
              name="add"
              size={16}
              tooltip="새 탭 만들기"
              tooltipPosition="top"
              className="opacity-60 hover:opacity-100 transition-opacity"
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default SidePanel;
