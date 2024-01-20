const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');

fs.readFile(templatePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка чтения файла template.html =>', err);
    return;
  }
  const tagNames = data.match(/{{(.*?)}}/g);

  let changeTemplate = data;
  let count = 0;

  tagNames.forEach((tag) => {
    const componentName = tag.slice(2, -2);
    const componentPath = path.join(__dirname, 'components', componentName + '.html');
    fs.readFile(componentPath, 'utf8', (err, componentContent) => {
      if (err) {
        console.error(`Ошибка чтения файла ${componentName} =>`, err);
        return;
      }
      changeTemplate = changeTemplate.replace(tag, componentContent);
      count++;
      if (count === tagNames.length) {
        writeIndexFile(changeTemplate);
      }
    });
  });
});

const projectDistPath = path.join(__dirname, 'project-dist');
fs.stat(projectDistPath, (err) => {
  if (err && err.code === 'ENOENT') {
    fs.mkdir(projectDistPath, (err) => {
      if (err) {
        console.error('Ошибка при создании папки "project-dist" => ', err);
        return;
      }
      console.log('Папка project-dist создана')
    });
  } else if (err) {
    console.error('Ошибка при проверке папки "project-dist" => ', err);
    return;
  } else {
    console.log('Папка project-dist существует')
  }
});

function writeIndexFile(content) {
  const indexPath = path.join(projectDistPath, 'index.html');
  fs.writeFile(indexPath, content, 'utf8', (err) => {
    if (err) {
      console.error('Ошибка при записи в файл "index.html" => ', err);
      return;
    }
    console.log('Шаблон собран и перенесен в файл index.html');
  });
}

const currFolderPath = path.join(__dirname, 'styles');
const styleFilePath = path.join(__dirname, 'project-dist', 'style.css');

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
        console.error(`Ошибка при чтении файла ${filePath} => `, err);
      });
      cssFiles.push(readStream);
    }
  });

  const writeStream = fs.createWriteStream(styleFilePath);

  writeStream.on('open', () => {
    for (let i = 0; i < cssFiles.length; i += 1) {
      cssFiles[i].pipe(writeStream, { end: false });
    }
    cssFiles[cssFiles.length - 1].on('end', () => {
      writeStream.end();
      console.log(`Файлы ${files} добавлены в единый файл стилей style.css`);
    });
  });

  writeStream.on('error', err => {
    console.error(`Ошибка при добавлении ${files} в единый файл стилей style.css => `, err);
    return;
  });
});

const copyFolderRecursive = (from, to) => {
  const folderName = path.basename(from);
  fs.mkdir(to, { recursive: true }, (err) => {
    if (err) {
      console.error(`Ошибка при создании папки "${to}" => `, err);
      return;
    }

    fs.readdir(from, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(`Ошибка при чтении папки "${folderName}" =>`, err);
        return;
      }

      files.forEach((file) => {
        const sourcePath = path.join(from, file.name);
        const destPath = path.join(to, file.name);
        if (file.isDirectory()) {
          copyFolderRecursive(sourcePath, destPath);
        } else {
          fs.copyFile(sourcePath, destPath, (err) => {
            if (err) {
              console.error(`Ошибка при копировании файла ${file.name} =>`, err);
            }
          });
        }
      });
    });
  });
};

console.log('Папка assets скопирована в папку project-dist');

const assetsFolderPath = path.join(__dirname, 'assets');
const destinationAssetsFolderPath = path.join(__dirname, 'project-dist', 'assets');

copyFolderRecursive(assetsFolderPath, destinationAssetsFolderPath);