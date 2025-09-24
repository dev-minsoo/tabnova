import { useState, useEffect } from 'react';

interface BookmarkListProps {
  highlightText?: (text: string, query: string) => any;
  searchQuery?: string;
}

interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkNode[];
  dateAdded?: number;
}

export function BookmarkList({ highlightText, searchQuery }: BookmarkListProps) {
  const [bookmarkTree, setBookmarkTree] = useState<BookmarkNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2'])); // Default expand Bookmarks bar and Other bookmarks

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const bookmarkTreeNodes = await chrome.bookmarks.getTree();

      const convertNode = (node: chrome.bookmarks.BookmarkTreeNode): BookmarkNode => ({
        id: node.id,
        title: node.title || 'Untitled',
        url: node.url,
        dateAdded: node.dateAdded,
        children: node.children?.map(convertNode)
      });

      // Start from root children (usually "Bookmarks bar", "Other bookmarks", "Mobile bookmarks")
      const rootNodes = bookmarkTreeNodes[0]?.children?.map(convertNode) || [];
      setBookmarkTree(rootNodes);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkClick = (url: string) => {
    chrome.tabs.create({ url });
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const matchesSearch = (node: BookmarkNode, query: string): boolean => {
    if (!query.trim()) return true;
    const lowerQuery = query.toLowerCase();
    const titleMatch = node.title.toLowerCase().includes(lowerQuery);
    const urlMatch = node.url?.toLowerCase().includes(lowerQuery);
    const childrenMatch = node.children?.some(child => matchesSearch(child, query));
    return titleMatch || urlMatch || Boolean(childrenMatch);
  };

  const getTotalItemCount = (node: BookmarkNode): number => {
    if (!node.children) return 0;

    let count = 0;
    for (const child of node.children) {
      if (child.url) {
        // It's a bookmark
        count += 1;
      } else {
        // It's a folder, count its contents recursively
        count += getTotalItemCount(child);
      }
    }
    return count;
  };

  const renderBookmarkNode = (node: BookmarkNode, depth: number = 0, isLast: boolean = false, parentIsLast: boolean[] = []): React.JSX.Element | null => {
    if (searchQuery && !matchesSearch(node, searchQuery)) return null;

    const isExpanded = expandedFolders.has(node.id);

    if (node.url) {
      // Bookmark item
      return (
        <div
          key={node.id}
          className={`group flex items-center py-1.5 pr-3 transition-colors cursor-pointer w-full max-w-full overflow-hidden hover:bg-gray-100 ${depth === 0 ? 'pl-3' : ''}`}
          onClick={() => handleBookmarkClick(node.url!)}
        >
          <div className="flex items-center flex-grow min-w-0">
            {/* Tree lines - Retro ASCII style */}
            <div className="flex items-center flex-shrink-0">
              {depth > 0 && (
                <>
                  {/* Parent level indicators */}
                  {parentIsLast.map((parentLast, index) => (
                    <div
                      key={index}
                      className="w-4 flex justify-center items-center text-gray-400 text-xs font-mono"
                    >
                      {!parentLast ? '│' : ' '}
                    </div>
                  ))}

                  {/* Current level connection */}
                  <div className="w-4 flex justify-center items-center text-gray-400 text-xs font-mono">
                    {isLast ? '└' : '├'}
                  </div>

                  {/* Horizontal dash */}
                  <div className="w-2 flex items-center text-gray-400 text-xs font-mono">
                    ─
                  </div>
                </>
              )}
            </div>

            {/* Favicon */}
            <div className="flex-shrink-0 w-4 h-4 mr-2 ml-1">
              <img
                src={`https://www.google.com/s2/favicons?domain=${new URL(node.url!).hostname}&sz=16`}
                className="w-full h-full object-contain"
                alt=""
                onError={(e) => {
                  e.currentTarget.src = 'icons/bookmark16.png';
                  e.currentTarget.onerror = null;
                }}
              />
            </div>

            {/* Bookmark Title */}
            <div className="flex-grow min-w-0">
              <div className="truncate text-sm text-gray-700">
                {highlightText && searchQuery ? highlightText(node.title, searchQuery) : node.title}
              </div>
              {searchQuery && searchQuery.trim() && (
                <div className="truncate text-xs text-gray-500 mt-0.5">
                  {highlightText ? highlightText(node.url!, searchQuery) : node.url}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      // Folder
      return (
        <div key={node.id}>
          <div
            className={`group flex items-center py-1.5 pr-3 transition-colors cursor-pointer w-full max-w-full overflow-hidden hover:bg-gray-100 ${depth === 0 ? 'pl-3' : ''}`}
            onClick={() => toggleFolder(node.id)}
          >
            <div className="flex items-center flex-grow min-w-0">
              {/* Tree lines - Retro ASCII style */}
              <div className="flex items-center flex-shrink-0">
                {depth > 0 && (
                  <>
                    {/* Parent level indicators */}
                    {parentIsLast.map((parentLast, index) => (
                      <div
                        key={index}
                        className="w-4 flex justify-center items-center text-gray-400 text-xs font-mono"
                      >
                        {!parentLast ? '│' : ' '}
                      </div>
                    ))}

                    {/* Current level connection */}
                    <div className="w-4 flex justify-center items-center text-gray-400 text-xs font-mono">
                      {isLast ? '└' : '├'}
                    </div>

                    {/* Horizontal dash */}
                    <div className="w-2 flex items-center text-gray-400 text-xs font-mono">
                      ─
                    </div>
                  </>
                )}
              </div>

              {/* Folder icon */}
              <div className="flex-shrink-0 w-4 h-4 mr-2 ml-1">
                <img
                  src="icons/folder16.png"
                  className="w-full h-full object-contain"
                  alt="folder"
                />
              </div>

              {/* Folder name with count */}
              <div className="flex-grow min-w-0">
                <div className="truncate text-sm text-gray-700 font-medium">
                  {highlightText && searchQuery ? highlightText(node.title, searchQuery) : node.title}
                  {node.children && node.children.length > 0 && (
                    <span className="text-gray-500 ml-1">({getTotalItemCount(node)})</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Folder contents */}
          {isExpanded && node.children && (
            <>
              {node.children.map((child, index) =>
                renderBookmarkNode(
                  child,
                  depth + 1,
                  index === node.children!.length - 1,
                  [...parentIsLast, isLast]
                )
              )}
            </>
          )}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-gray-500">북마크 로딩 중...</div>
      </div>
    );
  }

  if (bookmarkTree.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-gray-500">북마크가 없습니다</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {bookmarkTree.map((node, index) =>
        renderBookmarkNode(node, 0, index === bookmarkTree.length - 1, [])
      )}
    </div>
  );
}