const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

stdout.write('Программа для записи в файл. Для завершения нажмите Ctrl + C или введите "exit".');
stdout.write('\n');

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
  stdout.write('\n');
  stdout.write('Файл создан');
  stdout.write('\n');
});

stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input.toLowerCase() === 'exit') {
    stdout.write('Программа завершена');
    process.exit();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), input + '\n', (err) => {
      if (err) throw err;
    });
  }
});

process.on('SIGINT', () => {
  stdout.write('\n');
  stdout.write('Программа завершена пользователем');
  stdout.write('\n');
  process.exit();
 });