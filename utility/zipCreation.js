const fs = require('fs');
const archiver = require('archiver');

const zipFolder = (folderPath, zipFilePath) => new Promise((resolve, reject) => {
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', resolve);
  output.on('error', reject);
  archive.on('error', reject);
  archive.pipe(output);
  archive.directory(folderPath, false);
  archive.finalize();
});

module.exports = zipFolder;
