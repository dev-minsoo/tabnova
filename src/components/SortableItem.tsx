import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tab } from './Tab';

interface SortableItemProps {
  tab: chrome.tabs.Tab;
  activeTabId: number | undefined;
  handleTabClick: (tabId: number | undefined) => void;
  handleTabClose: (tabId: number | undefined) => void;
  onContextMenu?: (tab: chrome.tabs.Tab, x: number, y: number) => void;
  highlightText?: (text: string, query: string) => any;
  searchQuery?: string;
}

export function SortableItem({
  tab,
  activeTabId,
  handleTabClick,
  handleTabClose,
  onContextMenu,
  highlightText,
  searchQuery
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="w-full max-w-full overflow-hidden"
    >
      <div
        {...listeners}
        className="w-full"
      >
        <Tab
          tab={tab}
          isActive={tab.id === activeTabId}
          onClick={handleTabClick}
          onClose={handleTabClose}
          onContextMenu={onContextMenu}
          highlightText={highlightText}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
