import { Language, detectLanguage } from './i18n';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface Settings {
  language: Language;
  theme: ThemeMode;
}

export const DEFAULT_SETTINGS: Settings = {
  language: detectLanguage(),
  theme: 'system',
};

export async function getSettings(): Promise<Settings> {
  try {
    const result = await chrome.storage.sync.get('settings');
    return { ...DEFAULT_SETTINGS, ...result.settings };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  try {
    const currentSettings = await getSettings();
    const newSettings = { ...currentSettings, ...settings };
    await chrome.storage.sync.set({ settings: newSettings });

    // Apply theme immediately
    if (settings.theme !== undefined) {
      applyTheme(settings.theme);
    }
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: ThemeMode): void {
  const actualTheme = theme === 'system' ? getSystemTheme() : theme;

  if (actualTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export async function initializeSettings(): Promise<Settings> {
  const settings = await getSettings();
  applyTheme(settings.theme);

  // Listen for system theme changes if system mode is selected
  const setupSystemThemeListener = async () => {
    const currentSettings = await getSettings();
    if (currentSettings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        applyTheme('system');
      });
    }
  };

  setupSystemThemeListener();

  // Listen for storage changes to update system theme listener
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.settings) {
      const newSettings = changes.settings.newValue;
      if (newSettings && newSettings.theme) {
        setupSystemThemeListener();
      }
    }
  });

  return settings;
}