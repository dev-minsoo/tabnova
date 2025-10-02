import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Icon } from './Icon';
import { TabContextMenu } from './TabContextMenu';
import { Translation } from '../utils/i18n';

interface BodyProps {
  tabs: chrome.tabs.Tab[];
  filteredTabs: chrome.tabs.Tab[];
  activeTabId: number | undefined;
  searchQuery: string;
  onTabClick: (tabId: number | undefined) => void;
  onTabClose: (tabId: number | undefined) => void;
  onDragEnd: (event: any) => void;
  highlightText: (text: string, query: string) => any;
  translation: Translation;
}

export function Body({
  tabs,
  filteredTabs,
  activeTabId,
  searchQuery,
  onTabClick,
  onTabClose,
  onDragEnd,
  highlightText,
  translation
}: BodyProps) {
  const [contextMenu, setContextMenu] = useState<{
    tab: chrome.tabs.Tab;
    x: number;
    y: number;
  } | null>(null);

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

  const handleContextMenu = (tab: chrome.tabs.Tab, x: number, y: number) => {
    setContextMenu({ tab, x, y });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <div className="w-full max-w-full overflow-hidden">
          <SortableContext items={filteredTabs.map(tab => tab.id!)} strategy={verticalListSortingStrategy}>
            {filteredTabs.length > 0 ? (
              filteredTabs.map((tab) => (
                <SortableItem
                  key={tab.id}
                  tab={tab}
                  activeTabId={activeTabId}
                  handleTabClick={onTabClick}
                  handleTabClose={onTabClose}
                  onContextMenu={handleContextMenu}
                  highlightText={highlightText}
                  searchQuery={searchQuery}
                  translation={translation}
                />
              ))
            ) : searchQuery.trim() ? (
              <div
                className="p-4 text-center text-sm h-full flex items-center justify-center"
                style={{ color: 'var(--text-secondary)' }}
              >
                {translation.search.noResults}
              </div>
            ) : null}
          </SortableContext>
        </div>
      </DndContext>

      {/* Add Tab Button */}
      {!searchQuery.trim() && (
        <div
          className="p-3 border-t flex justify-center"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <button
            onClick={() => chrome.tabs.create({})}
            className="flex items-center justify-center w-6 h-6 rounded-full"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Icon
              name="add"
              size={16}
              tooltip={translation.tab.newTab}
              tooltipPosition="top"
              className="opacity-60 hover:opacity-100"
            />
          </button>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <TabContextMenu
          isOpen={true}
          onClose={closeContextMenu}
          tab={contextMenu.tab}
          x={contextMenu.x}
          y={contextMenu.y}
          translation={translation}
        />
      )}
    </div>
  );
}