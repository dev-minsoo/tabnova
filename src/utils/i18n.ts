export type Language = 'en' | 'ko';

export interface Translation {
  options: {
    title: string;
    language: string;
    interfaceLanguage: string;
    colorMode: string;
    colorModeDesc: string;
    system: string;
    light: string;
    dark: string;
    saved: string;
    saveFailed: string;
    sidePanelPosition: string;
    sidePanelPositionDesc: string;
    openChromeSettings: string;
    shortcuts: string;
    shortcutsDesc: string;
    openShortcutSettings: string;
    donate: string;
    donateDesc: string;
    buyMeCoffee: string;
    showQR: string;
  };
  common: {
    search: string;
    close: string;
    newTab: string;
    tabs: string;
    bookmarks: string;
    history: string;
    settings: string;
  };
  search: {
    placeholder: string;
    clearSearch: string;
    searchInNewTab: string;
    noResults: string;
  };
  tab: {
    closeTab: string;
    closeOtherTabs: string;
    duplicateTab: string;
    newTab: string;
  };
  footer: {
    visitHistory: string;
  };
}

const translations: Record<Language, Translation> = {
  en: {
    options: {
      title: 'TabNova Settings',
      language: 'Interface Language',
      interfaceLanguage: 'Choose your preferred interface language',
      colorMode: 'Color Mode',
      colorModeDesc: 'Switch between light and dark themes',
      system: 'System',
      light: 'Light',
      dark: 'Dark',
      saved: 'Saved!',
      saveFailed: 'Failed to save settings',
      sidePanelPosition: 'Side Panel Position',
      sidePanelPositionDesc: 'Configure where the side panel appears',
      openChromeSettings: 'Open Chrome Settings',
      shortcuts: 'Keyboard Shortcuts',
      shortcutsDesc: 'Configure keyboard shortcuts for TabNova',
      openShortcutSettings: 'Open Shortcut Settings',
      donate: 'Donate',
      donateDesc: 'If this extension has been helpful, please consider supporting its development and maintenance.',
      buyMeCoffee: 'Buy me a coffee',
      showQR: 'Show QR',
    },
    common: {
      search: 'Search',
      close: 'Close',
      newTab: 'New Tab',
      tabs: 'Tabs',
      bookmarks: 'Bookmarks',
      history: 'History',
      settings: 'Settings',
    },
    search: {
      placeholder: 'Search',
      clearSearch: 'Clear search',
      searchInNewTab: 'Search in new tab',
      noResults: 'No results found',
    },
    tab: {
      closeTab: 'Close tab',
      closeOtherTabs: 'Close other tabs',
      duplicateTab: 'Duplicate tab',
      newTab: 'New tab',
    },
    footer: {
      visitHistory: 'Visit History',
    },
  },
  ko: {
    options: {
      title: 'TabNova 설정',
      language: '인터페이스 언어',
      interfaceLanguage: '인터페이스 표시 언어 설정',
      colorMode: '색상 모드',
      colorModeDesc: '밝은 모드 어둡게 색상 모드 선택',
      system: '시스템',
      light: '밝게',
      dark: '어둡게',
      saved: '저장됨!',
      saveFailed: '설정 저장 실패',
      sidePanelPosition: '사이드 패널 위치',
      sidePanelPositionDesc: '사이드 패널이 표시될 위치를 설정합니다',
      openChromeSettings: '크롬 설정 열기',
      shortcuts: '키보드 단축키',
      shortcutsDesc: 'TabNova 키보드 단축키를 설정합니다',
      openShortcutSettings: '단축키 설정 열기',
      donate: '후원하기',
      donateDesc: '이 확장프로그램이 도움이 되셨다면 후원을 고려해주세요. 개발과 유지보수에 큰 도움이 됩니다.',
      buyMeCoffee: 'Buy me a coffee',
      showQR: 'QR 보기',
    },
    common: {
      search: '검색',
      close: '닫기',
      newTab: '새 탭',
      tabs: '탭',
      bookmarks: '북마크',
      history: '기록',
      settings: '설정',
    },
    search: {
      placeholder: '검색',
      clearSearch: '검색 지우기',
      searchInNewTab: '새 탭에서 검색',
      noResults: '검색 결과가 없습니다',
    },
    tab: {
      closeTab: '탭 닫기',
      closeOtherTabs: '다른 탭 닫기',
      duplicateTab: '탭 복제',
      newTab: '새 탭 만들기',
    },
    footer: {
      visitHistory: '방문 기록',
    },
  },
};

export function getTranslation(language: Language): Translation {
  return translations[language];
}

export function detectLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ko')) {
    return 'ko';
  }
  return 'en';
}