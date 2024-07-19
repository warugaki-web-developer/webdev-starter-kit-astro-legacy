import path from 'path';
import chokidar from 'chokidar';
import postcss from 'postcss';
import postcssConfig from '../postcss.config.js';
import fs from 'fs-extra';

const srcDir = path.resolve('src/styles');
const destDir = path.resolve('public/styles');

const buildCSS = async (filePath) => {
  if (path.basename(filePath).startsWith('_')) {
    return;
  }

  const css = await fs.readFile(filePath, 'utf8');
  const result = await postcss(postcssConfig.plugins).process(css, {
    from: filePath,
  });

  const outputFilePath = path.join(destDir, path.relative(srcDir, filePath));
  await fs.ensureDir(path.dirname(outputFilePath));
  await fs.writeFile(outputFilePath, result.css);
};

const buildAll = async () => {
  const files = await getCSSFiles(srcDir);
  await Promise.all(files.map(buildCSS));
};

const getCSSFiles = async (dir, files = []) => {
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      await getCSSFiles(fullPath, files);
    } else if (item.isFile() && path.extname(item.name) === '.css') {
      files.push(fullPath);
    }
  }
  return files;
};

const findImportingFiles = async (importPath) => {
  const files = await getCSSFiles(srcDir);
  const importingFiles = [];
  const importFileName = path.basename(importPath);

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const regex = /@import\s+(?:url\()?['"]([^'")]+)['"]?(?:\))?/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (path.basename(match[1]) === importFileName) {
        importingFiles.push(file);
        break;
      }
    }
  }

  return importingFiles;
};

const watchFiles = () => {
  const watcher = chokidar.watch(srcDir, {
    persistent: true,
  });

  watcher
    .on('add', buildCSS)
    .on('change', buildCSS)
    .on('unlink', async (filePath) => {
      const outputFilePath = path.join(
        destDir,
        path.relative(srcDir, filePath),
      );
      await fs.remove(outputFilePath);
    });

  watcher.on('change', async (filePath) => {
    if (path.basename(filePath).startsWith('_')) {
      const importingFiles = await findImportingFiles(filePath);
      await Promise.all(importingFiles.map(buildCSS));
    }
  });
};

const main = async () => {
  await buildAll();
  watchFiles();
};

main().catch(console.error);
