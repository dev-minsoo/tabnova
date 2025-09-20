# 🚀 TabNova

A modern, intuitive vertical tab manager for Chrome that transforms your browsing experience.

![TabNova Screenshot](./screenshot.png)

## ✨ Features

### 🎯 Smart Tab Management
- **Vertical layout** - See all your tabs at a glance in a clean sidebar
- **Drag & drop** - Easily reorder tabs by dragging them
- **One-click switching** - Click any tab to instantly navigate
- **Quick close** - X button on hover for easy tab closure

### 🔍 Powerful Search
- **Real-time filtering** - Find tabs instantly as you type
- **Search highlighting** - Matching text is highlighted in results
- **New tab search** - Press Enter or click send icon to search in a new tab
- **Smart input** - Full support for Korean and other languages

### ⚡ Keyboard Shortcuts
- **Alt+B (Option+B)** - Open/focus TabNova sidebar instantly

### 🎨 Polished Interface
- **Smart tooltips** - Context-aware help that never gets cut off
- **Smooth animations** - Fluid transitions and hover effects
- **Responsive design** - Works perfectly at any sidebar width
- **Clean typography** - Easy to read tab titles and URLs

## 🚀 Installation

### From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "TabNova"
3. Click "Add to Chrome"

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/tabnova.git
   cd tabnova
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder

## 🎮 How to Use

### Opening TabNova
- **Keyboard**: Press `Alt+B` (or `Option+B` on Mac)
- **Icon**: Click the TabNova icon in your toolbar
- **Right-click**: Right-click anywhere and select "Open TabNova"

### Managing Tabs
- **Switch tabs**: Click on any tab in the list
- **Close tabs**: Hover over a tab and click the X button
- **Reorder tabs**: Drag tabs up or down to reorder them
- **Create new tab**: Click the + button at the bottom

### Searching
- **Find tabs**: Type in the search box to filter by title or URL
- **Clear search**: Click the X button in the search box
- **Search web**: Type your query and press Enter or click the send icon

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Project Structure
```
src/
├── components/          # Reusable React components
├── pages/sidepanel/     # Main sidepanel interface
├── public/icons/        # Extension icons
└── background.ts        # Chrome extension service worker
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style
2. Add TypeScript types for new features
3. Test your changes thoroughly
4. Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:
- Your Chrome version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

## 💡 Feature Requests

Have an idea for a new feature? We'd love to hear it! Open an issue with the "enhancement" label.

## 🙏 Acknowledgments

- Built with ❤️ using React and TypeScript
- Drag & drop powered by [@dnd-kit](https://dndkit.com/)
- Icons designed for clarity and consistency
- Inspired by modern productivity tools

---

**TabNova** - Transform your tab management experience today! 🌟

## 🌐 Other Languages

- [English](README.md)
- [한국어](README.ko.md)