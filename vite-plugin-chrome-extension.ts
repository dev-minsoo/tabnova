import type { Plugin } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export function chromeExtensionPlugin(): Plugin {
  return {
    name: 'chrome-extension',
    writeBundle() {
      // Move HTML files from nested directories to root
      const htmlFiles = [
        { from: 'dist/src/pages/sidepanel/index.html', to: 'dist/sidepanel.html' },
        { from: 'dist/src/pages/popup/index.html', to: 'dist/popup.html' },
        { from: 'dist/src/pages/options/index.html', to: 'dist/options.html' }
      ];

      for (const { from, to } of htmlFiles) {
        if (fs.existsSync(from)) {
          fs.renameSync(from, to);
          console.log(`Moved ${from} to ${to}`);
        }
      }

      // Copy icons directory
      if (fs.existsSync('src/public/icons') && !fs.existsSync('dist/icons')) {
        fs.cpSync('src/public/icons', 'dist/icons', { recursive: true });
        console.log('Copied icons directory');
      }

      // Copy image directory
      if (fs.existsSync('src/public/image') && !fs.existsSync('dist/image')) {
        fs.cpSync('src/public/image', 'dist/image', { recursive: true });
        console.log('Copied image directory');
      }

      // Clean up empty directories
      if (fs.existsSync('dist/src')) {
        fs.rmSync('dist/src', { recursive: true, force: true });
        console.log('Cleaned up dist/src directory');
      }

      // Fix absolute paths in HTML files
      const htmlFilesToFix = ['dist/sidepanel.html', 'dist/popup.html', 'dist/options.html'];

      for (const filePath of htmlFilesToFix) {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf8');

          // Replace absolute paths with relative paths
          content = content.replace(/src="\/([^"]+)"/g, 'src="./$1"');
          content = content.replace(/href="\/([^"]+)"/g, 'href="./$1"');

          fs.writeFileSync(filePath, content);
          console.log(`Fixed paths in ${filePath}`);
        }
      }
    },
  };
}