const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const pathNewFolder = path.join(__dirname, 'files-copy');

async function clearDirectory(source, target) {
  try {
    await fs.promises.access(target, fs.constants.F_OK);
    await fs.promises.rm(target, { recursive: true });
  } 
  catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Ошибка очистки папки =>', err);
    }
  }
  
  try {
    await fs.promises.mkdir(target, { recursive: true });
    await copyDirectory(source, target);
  } 
  catch (err) {
    console.error('Ошибка создания папки =>', err);
  }
}

async function copyDirectory(source, target) {
  try {
    const files = await fs.promises.readdir(source);
    for (const file of files) {
      const currentPath = path.join(source, file);
      const targetPath = path.join(target, file);
      const stat = await fs.promises.lstat(currentPath);
      
      if (stat.isDirectory()) {
        await copyDirectory(currentPath, targetPath);
      } 
      else {
        await fs.promises.copyFile(currentPath, targetPath);
      }
    }
  } 
  catch (err) {
    console.error('Ошибка при копировании файлов=>', err);
  }
}

clearDirectory(folderPath, pathNewFolder);