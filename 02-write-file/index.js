const path = require('path');
const fs = require('fs');

// инициализация
const { stdin, stdout } = process;
const filePath = path.join(__dirname, 'notes.txt');
const output = fs.createWriteStream(filePath);

stdout.write('Здорово! Какой мне текст записать?\n');

fs.writeFile(
  filePath,
  '',
  err => {
    if (err) console.log(err.message);
  }
);

// ввод текста
process.on('exit', () => stdout.write('Удачи в проверке!)'));
process.on('SIGINT', process.exit);

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  output.write(data);
  console.log(`Хорошо, записал "${data.toString().trim()}"`);
  console.log('Какой ещё записать?');
});