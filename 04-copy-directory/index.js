const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const { join } = require('path');

async function copyDir(folderName, outside = true, outsideFolder, outsidePath) {
  let copyFolderName;
  let folderPath;
  let folderCopyPath;
  if (outside) {
    copyFolderName = folderName + '-copy';
    folderCopyPath = join(__dirname, copyFolderName);
  } else {
    folderCopyPath = join(outsidePath, folderName);
    folderName = join(outsideFolder, folderName);
    copyFolderName = folderName;
  }
  folderPath = join(__dirname, folderName);
  try {
    mkdir(folderCopyPath, { recursive: true });
    const options = {
      encoding: 'utf-8',
      withFileTypes: true
    };
    const smths = await readdir(folderPath, options);
    for (const smth of smths) {
      if (smth.isFile()) {
        await copyFile(join(folderPath, smth.name), join(folderCopyPath, smth.name));
      } else {
        await copyDir(smth.name, false, folderName, folderCopyPath);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

const folderName = 'files';
const folderCopyPath = join(__dirname, 'files-copy');

async function check() {
  if (!(await rm(folderCopyPath, { recursive: true, force: true }))) {
    copyDir(folderName);
  }
}
check();
