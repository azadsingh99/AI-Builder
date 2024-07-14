
const archiver = require('archiver');

const zipFolder = (folderPath, zipFilePath) => {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.directory(folderPath, false);
        archive.finalize();
    });
};

module.exports = zipFolder;