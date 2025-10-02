import React from 'react';
import { SearchBar } from './SearchBar';
import { Translation } from '../utils/i18n';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewTabSearch: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  translation: Translation;
}

export function Header({ searchQuery, onSearchChange, onNewTabSearch, onSearchKeyDown, translation }: HeaderProps) {
  return (
    <div
      className="py-2 border-b flex items-center relative z-10"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onNewTabSearch={onNewTabSearch}
        onSearchKeyDown={onSearchKeyDown}
        translation={translation}
      />
    </div>
  );
}