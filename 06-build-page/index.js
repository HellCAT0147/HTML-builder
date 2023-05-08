const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');

fs.mkdir(projectDistPath, { recursive: true }, (err) => {
  if (err) throw err;
  const templatePath = path.join(__dirname, 'template.html');
  const stylesPath = path.join(__dirname, 'styles');
  createIndexHTML(templatePath).catch((err) => {
    console.error('Невозможно заменить шаблонные фразы:', err);
  });
  createStyles(stylesPath).catch((err) => {
    console.error('Невозможно собрать стили:', err);
  });
});

async function createIndexHTML(templatePath) {
  let templateData = await fs.promises.readFile(templatePath, 'utf-8'); // прочитали файл тимплейт
  const matches = templateData.match(/\{\{(.+?)\}\}/g); // создали массив из шаблонных строк, которые потом в index.html заменим
  const componentsPath = path.join(__dirname, 'components');
  
  const replacedData = matches.map(async (match) => {
    const component = match.slice(2, -2) + '.html';  
    const componentPath = path.join(componentsPath, component);

    try {
      const componentData = await fs.promises.readFile(componentPath, 'utf-8'); // читаем каждый (.map, мы в цикле :)) файл-компонент
      templateData = templateData.replace(match, componentData); // заменяем в переменной данные по шаблонной строке и переписываем её
    } catch (err) {
      console.error(`Не могу прочитать следующий файл - "${component}":`, err);
    }

  });
  await Promise.all(replacedData);

  const indexFilePath = path.join(__dirname, 'project-dist', 'index.html');
  await fs.promises.writeFile(indexFilePath, templateData);
}

async function createStyles(stylesPath) {
  const smths = await fs.promises.readdir(stylesPath); // получаем список файлов из папки styles
  
  const cssFiles = smths.filter((smth) => path.extname(smth) === '.css'); // выбираем только css-файлы и отбрасываем фейки

  let cssData = '';
  for (const file of cssFiles) {
    const filePath = path.join(stylesPath, file);
    const fileData = await fs.promises.readFile(filePath, 'utf-8');
    cssData += fileData + '\n';
  }
  
  const outputCSSPath = path.join(projectDistPath, 'style.css');
  await fs.promises.writeFile(outputCSSPath, cssData); // записываем в файл все стили
}