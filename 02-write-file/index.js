const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

console.log('Программа для записи в файл. Для завершения нажмите Ctrl + C или введите "exit".');

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
  stdout.write('\n');
  stdout.write('Файл создан');
  stdout.write('\n');
});

stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input.toLowerCase() === 'exit') {
    console.log('Программа завершена');
    process.exit();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), input + '\n', (err) => {
      if (err) throw err;
    });
  }
});

process.on('SIGINT', () => {
  stdout.write('\n');
  console.log('Программа завершена пользователем');
  stdout.write('\n');
  process.exit();
 });