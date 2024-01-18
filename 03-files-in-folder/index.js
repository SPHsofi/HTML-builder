const fs = require('fs');
const path = require('path');
const { stdout, stderr } = process;

const folder = path.join(__dirname, 'secret-folder')

fs.readdir(folder, (err, files) => {
  if (err) {
    stdout.write('\n');
    console.error('Ошибка при чтении папки =>', err);
    return;
  }
  files.forEach(file => {
    const filePath = path.join(folder, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        stdout.write('\n');
        console.error('Ошибка при получении информации о файле:', err);
        return;
      }

      if (stats.isFile()) {
        const fileInfo = path.parse(filePath);
        const fileSize = stats.size / 1024;
        console.log(`${fileInfo.name} - ${fileInfo.ext.substr(1)} - ${fileSize.toFixed(2)} kb`);
      }
    })
  })
})