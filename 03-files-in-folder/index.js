const { stat } = require('fs/promises');
const { readdir } = require('fs/promises');
const { join, extname } = require('path');

const folderPath = join(__dirname, 'secret-folder');

async function returnStatSize(name) {
  const filePath = join(folderPath, name);
  const stats = await stat(filePath, (err, stats) => stats);
  return stats.size;
}

async function doReadDir(folderPath) {
  try {
    const options = {
      encoding: 'utf-8',
      withFileTypes: true
    };
    const smths = await readdir(folderPath, options);
    for (const smth of smths) {
      if (smth.isFile()) {
        const size = await returnStatSize(smth.name);
        console.log(`${smth.name} - ${extname(smth.name).slice(1)} - ${size}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

doReadDir(folderPath);