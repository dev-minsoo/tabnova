import React from 'react';
import { Icon } from './Icon';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewTabSearch: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onNewTabSearch,
  onSearchKeyDown,
  placeholder = "검색"
}: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Icon name="search" size={16} className="opacity-60" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={onSearchKeyDown}
        className="w-full pl-10 pr-12 py-1.5 text-sm bg-gray-50 focus:outline-none transition-colors"
      />
      {searchQuery && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <Icon
            name="close"
            size={16}
            onClick={() => onSearchChange('')}
            className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            tooltip="검색 지우기"
            tooltipPosition="bottom"
          />
          <Icon
            name="send"
            size={16}
            onClick={onNewTabSearch}
            className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            tooltip="새 탭에서 검색"
            tooltipPosition="bottom"
          />
        </div>
      )}
    </div>
  );
}