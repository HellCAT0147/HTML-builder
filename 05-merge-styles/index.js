const { readdir, appendFile, readFile } = require('fs/promises');
const { writeFile } = require('fs');
const { join, extname } = require('path');

const stylesFolderPath = join(__dirname, 'styles');
const bundleFolderPath = join(__dirname, 'project-dist');
const bundleFilePath = join(bundleFolderPath, 'bundle.css');

async function init(bundleFilePath) {
  return new Promise((resolve, reject) => {
    writeFile(bundleFilePath, '', (error) => {
      if (error) reject(error);
      resolve();
    });
  });
}

async function makeBundle(stylesFolderPath, bundleFolderPath, bundleFilePath) {
  await init(bundleFolderPath);
  const options = {
    encoding: 'utf-8',
    withFileTypes: true
  };
  const smths = await readdir(stylesFolderPath, options);
  for (const smth of smths) {
    if (smth.isFile() && extname(smth.name).slice(1) === 'css') {
      const cssPath = join(stylesFolderPath, smth.name);
      const cssPart = await readFile(cssPath, 'utf-8');
      appendFile(bundleFilePath, cssPart);
    }
  }
}

makeBundle(stylesFolderPath, bundleFilePath, bundleFilePath);