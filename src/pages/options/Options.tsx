import React, { useState, useEffect } from 'react';
import { Settings, getSettings, saveSettings, initializeSettings, ThemeMode } from '../../utils/settings';
import { Language, getTranslation, Translation } from '../../utils/i18n';
import { useToast, ToastContainer } from '../../components/Toast';

function Options() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [translation, setTranslation] = useState<Translation | null>(null);
  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    initializeSettings().then((loadedSettings) => {
      setSettings(loadedSettings);
      setTranslation(getTranslation(loadedSettings.language));
    });
  }, []);

  const handleLanguageChange = async (language: Language) => {
    if (!settings) return;

    const newSettings = { ...settings, language };
    setSettings(newSettings);
    setTranslation(getTranslation(language));
    await handleSave({ language });
  };

  const handleThemeChange = async (theme: ThemeMode) => {
    if (!settings) return;

    const newSettings = { ...settings, theme };
    setSettings(newSettings);
    await handleSave({ theme });
  };

  const handleAccentColorChange = async (color: string) => {
    if (!settings) return;

    const newSettings = { ...settings, accentColor: color };
    setSettings(newSettings);
    await handleSave({ accentColor: color });
  };


  const handleSave = async (partialSettings: Partial<Settings>) => {
    try {
      await saveSettings(partialSettings);
      if (translation) {
        success(translation.options.saved);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      if (translation) {
        error(translation.options.saveFailed);
      }
    }
  };


  if (!settings || !translation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="px-6 py-4">
            <h1 className="text-2xl font-medium">{translation.options.title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Language Setting */}
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-1">{translation.options.language}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {translation.options.interfaceLanguage}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="px-3 py-2 border rounded min-w-32"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Color Mode Setting */}
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-1">{translation.options.colorMode}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {translation.options.colorModeDesc}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center space-x-4">
                {/* System Option */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={settings.theme === 'system'}
                      onChange={() => handleThemeChange('system')}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        settings.theme === 'system' ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      style={{
                        borderColor: settings.theme === 'system' ? 'var(--accent-color)' : 'var(--border-color)',
                      }}
                    >
                      {settings.theme === 'system' && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--accent-color)' }}
                        />
                      )}
                    </div>
                  </div>
                  <span className="flex items-center gap-2">
                    <span>🖥️</span>
                    <span>{translation.options.system}</span>
                  </span>
                </label>

                {/* Light Option */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={() => handleThemeChange('light')}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        settings.theme === 'light' ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      style={{
                        borderColor: settings.theme === 'light' ? 'var(--accent-color)' : 'var(--border-color)',
                      }}
                    >
                      {settings.theme === 'light' && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--accent-color)' }}
                        />
                      )}
                    </div>
                  </div>
                  <span className="flex items-center gap-2">
                    <span>☀️</span>
                    <span>{translation.options.light}</span>
                  </span>
                </label>

                {/* Dark Option */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={() => handleThemeChange('dark')}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        settings.theme === 'dark' ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      style={{
                        borderColor: settings.theme === 'dark' ? 'var(--accent-color)' : 'var(--border-color)',
                      }}
                    >
                      {settings.theme === 'dark' && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--accent-color)' }}
                        />
                      )}
                    </div>
                  </div>
                  <span className="flex items-center gap-2">
                    <span>🌙</span>
                    <span>{translation.options.dark}</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Accent Color Setting */}
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-1">{translation.options.accentColor}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {translation.options.accentColorDesc}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-3">
                {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleAccentColorChange(color)}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: settings.accentColor === color ? 'var(--text-primary)' : 'transparent',
                      boxShadow: settings.accentColor === color ? '0 0 0 2px var(--bg-primary)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel Position Setting */}
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-1">{translation.options.sidePanelPosition}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {translation.options.sidePanelPositionDesc}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => chrome.tabs.create({ url: 'chrome://settings/appearance' })}
                className="px-4 py-2 border rounded transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                }}
              >
                {translation.options.openChromeSettings}
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Setting */}
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-1">{translation.options.shortcuts}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {translation.options.shortcutsDesc}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })}
                className="px-4 py-2 border rounded transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                }}
              >
                {translation.options.openShortcutSettings}
              </button>
            </div>
          </div>

        </div>

        {/* Donate Section */}
        <div className="border-t mt-8 pt-8" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-1">💝 {translation.options.donate}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {translation.options.donateDesc}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('image/qr-code.png') })}
                className="px-4 py-2 border rounded transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                }}
              >
                📱 {translation.options.showQR}
              </button>
              <button
                onClick={() => window.open('https://buymeacoffee.com/dev.minsoo', '_blank')}
                className="px-4 py-2 border rounded transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                }}
              >
                ☕ {translation.options.buyMeCoffee}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default Options;
