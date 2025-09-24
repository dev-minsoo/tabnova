import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Icon } from './Icon';
import { TabContextMenu } from './TabContextMenu';

interface BodyProps {
  tabs: chrome.tabs.Tab[];
  filteredTabs: chrome.tabs.Tab[];
  activeTabId: number | undefined;
  searchQuery: string;
  onTabClick: (tabId: number | undefined) => void;
  onTabClose: (tabId: number | undefined) => void;
  onDragEnd: (event: any) => void;
  highlightText: (text: string, query: string) => any;
}

export function Body({
  tabs,
  filteredTabs,
  activeTabId,
  searchQuery,
  onTabClick,
  onTabClose,
  onDragEnd,
  highlightText
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

      {/* Context Menu */}
      {contextMenu && (
        <TabContextMenu
          isOpen={true}
          onClose={closeContextMenu}
          tab={contextMenu.tab}
          x={contextMenu.x}
          y={contextMenu.y}
        />
      )}
    </div>
  );
}