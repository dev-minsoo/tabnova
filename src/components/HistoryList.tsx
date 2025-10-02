import { useState, useEffect } from 'react';

interface HistoryListProps {
  highlightText?: (text: string, query: string) => any;
  searchQuery?: string;
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  lastVisitTime: number;
  visitCount: number;
}

export function HistoryList({ highlightText, searchQuery }: HistoryListProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayHistory();
  }, []);

  const loadTodayHistory = async () => {
    try {
      // Get today's start time (00:00:00)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startTime = today.getTime();

      // Get tomorrow's start time (00:00:00)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endTime = tomorrow.getTime();

      const historyItems = await chrome.history.search({
        text: '',
        startTime: startTime,
        endTime: endTime,
        maxResults: 100
      });

      // Filter and sort by last visit time (most recent first)
      const todayHistory: HistoryItem[] = historyItems
        .filter(item => item.url && item.title)
        .map(item => ({
          id: item.id,
          title: item.title!,
          url: item.url!,
          lastVisitTime: item.lastVisitTime!,
          visitCount: item.visitCount!
        }))
        .sort((a, b) => b.lastVisitTime - a.lastVisitTime);

      setHistory(todayHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    if (!searchQuery || !searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = item.title.toLowerCase().includes(query);
    const urlMatch = item.url.toLowerCase().includes(query);
    return titleMatch || urlMatch;
  });

  const handleHistoryClick = (url: string) => {
    chrome.tabs.create({ url });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          오늘의 방문 기록 로딩 중...
        </div>
      </div>
    );
  }

  if (filteredHistory.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          {searchQuery ? '검색 결과가 없습니다' : '오늘 방문한 페이지가 없습니다'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {filteredHistory.map((item) => (
        <div
          key={item.id}
          className="group flex items-center px-3 py-2 cursor-pointer w-full max-w-full overflow-hidden"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={() => handleHistoryClick(item.url)}
        >
          <div className="flex items-center flex-grow min-w-0">
            {/* Favicon */}
            <div className="flex-shrink-0 w-4 h-4 mr-2 mt-0.5">
              <img
                src={`https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=16`}
                className="w-full h-full object-contain"
                alt=""
                onError={(e) => {
                  e.currentTarget.src = 'icons/history16.png';
                  e.currentTarget.onerror = null;
                }}
              />
            </div>

            {/* History Info */}
            <div className="flex-grow min-w-0">
              {/* Page Title */}
              <div
                className="truncate text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {highlightText && searchQuery ? highlightText(item.title, searchQuery) : item.title}
              </div>

              {/* URL and Time */}
              <div
                className="flex items-center text-xs mt-0.5 space-x-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div className="truncate flex-grow">
                  {highlightText && searchQuery ? highlightText(item.url, searchQuery) : item.url}
                </div>
                <div className="flex-shrink-0 ml-2">
                  {formatTime(item.lastVisitTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}