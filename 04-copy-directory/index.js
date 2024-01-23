const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const pathNewFolder = path.join(__dirname, 'files-copy');

function clearDirectory(source, target) {
  fs.promises.access(target, fs.constants.F_OK)
    .then(() => fs.promises.rm(target, { recursive: true }))
    .then(() => {
      copyDirectory(source, target);
    })
    .catch((err) => {
      if (err.code === 'ENOENT') {
        return fs.promises.mkdir(target, { recursive: true });
      } else {
        console.error('Ошибка очистки папки =>', err);
      }
    })
    .catch((err) => {
      console.error('Ошибка создания папки =>', err);
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
                      console.error('Ошибка копирования файлов =>', err);
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