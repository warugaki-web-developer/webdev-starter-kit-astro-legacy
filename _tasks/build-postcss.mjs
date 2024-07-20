import path from 'path';
import chokidar from 'chokidar';
import postcss from 'postcss';
import postcssConfig from '../postcss.config.js';
import fs from 'fs-extra';
import stylelint from 'stylelint';
import prettier from 'prettier';

const srcDir = path.resolve('src/styles');
const destDir = path.resolve('public/styles');

const formatCSS = async (filePath) => {
  try {
    const css = await fs.readFile(filePath, 'utf8');

    const options = await prettier.resolveConfig(filePath);

    const formattedCSS = await prettier.format(css, { ...options, parser: 'css' });
    await fs.writeFile(filePath, formattedCSS);
  } catch (error) {
    console.error(`Error formatting ${filePath}:`, error);
  }
};

const lintFixCSS = async (filePath) => {
  try {
    const result = await stylelint.lint({
      files: filePath,
      fix: true,
    });

    for (const res of result.results) {
      if (res.output) {
        await fs.writeFile(res.source, res.output);
      }
    }
  } catch (error) {
    console.error(`Error linting and fixing ${filePath}:`, error);
  }
};

const buildCSS = async (filePath) => {
  if (path.basename(filePath).startsWith('_')) {
    return;
  }

  const css = await fs.readFile(filePath, 'utf8');
  const result = await postcss(postcssConfig.plugins).process(css, { from: filePath });

  const outputFilePath = path.join(destDir, path.relative(srcDir, filePath));
  await fs.ensureDir(path.dirname(outputFilePath));
  await fs.writeFile(outputFilePath, result.css);

  await lintFixCSS(outputFilePath);
  await formatCSS(outputFilePath);
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
      const outputFilePath = path.join(destDir, path.relative(srcDir, filePath));
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

  if (process.env.NODE_ENV !== 'production') {
    watchFiles();
  }
};

main().catch(console.error);
