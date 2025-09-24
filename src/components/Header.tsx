import React from 'react';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewTabSearch: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function Header({ searchQuery, onSearchChange, onNewTabSearch, onSearchKeyDown }: HeaderProps) {
  return (
    <div className="py-2 border-b border-gray-100 flex items-center relative z-10">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onNewTabSearch={onNewTabSearch}
        onSearchKeyDown={onSearchKeyDown}
      />
    </div>
  );
}