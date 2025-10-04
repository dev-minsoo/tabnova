import React from 'react';
import { Icon } from './Icon';
import { Translation } from '../utils/i18n';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewTabSearch: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  translation: Translation;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onNewTabSearch,
  onSearchKeyDown,
  translation
}: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
        <Icon name="search" size={16} className="opacity-60" />
      </div>
      <input
        type="text"
        placeholder={translation.search.placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={onSearchKeyDown}
        className="w-full pl-10 pr-12 py-1.5 text-sm focus:outline-none transition-colors [&::placeholder]:transition-colors"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
        }}
      />
      {searchQuery && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <Icon
            name="close"
            size={16}
            onClick={() => onSearchChange('')}
            className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            tooltip={translation.search.clearSearch}
            tooltipPosition="bottom"
          />
          <Icon
            name="send"
            size={16}
            onClick={onNewTabSearch}
            className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            tooltip={translation.search.searchInNewTab}
            tooltipPosition="bottom"
          />
        </div>
      )}
    </div>
  );
}