const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const pathNewFolder = path.join(__dirname, 'files-copy');

function clearDirectory(source, target) {
  fs.rm(target, { recursive: true }, (err) => {
    if (err) {
      console.error('Ошибка очистки папки =>', err);
    } else {
      copyDirectory(source, target);
    }
  });
}

function copyDirectory(source, target) {
  fs.mkdir(target, { recursive: true }, (err) => {
    if (err) {
      console.error('Ошибка копирования папки =>', err);
    } else {
      fs.readdir(source, (err, files) => {
        if (err) {
          console.error('Ошибка чтения папки =>', err);
        } else {
          files.forEach((file) => {
            const currentPath = path.join(source, file);
            const targetPath = path.join(target, file);
            fs.lstat(currentPath, (err, stat) => {
              if (err) {
                console.error('Ошибка получения статуса файла =>', err);
              } else {
                if (stat.isDirectory()) {
                  copyDirectory(currentPath, targetPath);
                } else {
                  fs.copyFile(currentPath, targetPath, (err) => {
                    if (err) {
                      console.error('Ошибка кописрования файлов =>', err);
                    } else {
                      console.log(`Файл "${file}" скопирован успешно в новую папку`);
                    }
                  });
                }
              }
            });
          });
        }
      });
    }
  });
}

clearDirectory(folderPath, pathNewFolder);