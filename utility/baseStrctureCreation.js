const path = require('path');
const fs = require('fs');

const createBaseFile = async () => {
    try {
        const indexCode = `
            require('dotenv').config();
            const express = require('express');
            const app = express();
            const path = require('path');

            const bodyParser = require('body-parser');
            const crudRouter = require('./route/crudBuilderRouter');

            app.use(bodyParser.json());
            app.use(crudRouter);
            app.use('/public', express.static(path.join(__dirname, './public')));

            app.listen(process.env.PORT, () => {
                console.log('Server is running on port 3001')
            })
        `;

        const databaseConnectionCode = `
            const mongoose = require('mongoose');
            require('dotenv').config();

            const connectDB = async () => {
                try {
                    await mongoose.connect(process.env.MONGODB_URI, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useCreateIndex: true,
                        useFindAndModify: false
                    });
                    console.log('MongoDB connected successfully');
                } catch (error) {
                    console.error('Error connecting to MongoDB:', error.message);
                    process.exit(1); // Exit process with failure
                }
            };

            module.exports = connectDB;
        `

        const folderPath = path.join(__dirname, '../crudFolders/');
        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath, { recursive: true });

        const indexFilePath = path.join(folderPath, `index.js`);
        const dbfilePath = path.join(folderPath, 'db.js');
        fs.writeFileSync(indexFilePath, indexCode);
        fs.writeFileSync(dbfilePath, databaseConnectionCode);

        return (`Files Created`);
    } catch (err) {

    }
}

module.exports = createBaseFile;
