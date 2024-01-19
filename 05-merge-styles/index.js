const fs = require('fs');
const path = require('path');

const currFolderPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

const cssFiles = [];

fs.readdir(currFolderPath, (err, files) => {
  if (err) {
    console.error('Ошибка при чтении папки styles =>', err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.css') {
      const filePath = path.join(currFolderPath, file);
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.on('error', err => {
        console.error('Ошибка при чтении файла ' + filePath + ' => ', err);
      });
      cssFiles.push(readStream);
    }
  });

  const writeStream = fs.createWriteStream(bundleFilePath);

  writeStream.on('open', () => {
    for (let i = 0; i < cssFiles.length; i += 1) {
      cssFiles[i].pipe(writeStream, { end: false });
    }
    cssFiles[cssFiles.length - 1].on('end', () => {
      writeStream.end();
      console.log('Файл bundle.css создан');
    });
  });

  writeStream.on('error', err => {
    console.error('Ошибка при записи в файл bundle.css => ', err);
    return;
  });
});
