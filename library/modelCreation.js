const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const generateModelIndividually = (modelName, fields) => {
    try {
        const schemaDefinition = {};

        fields.forEach(field => {
            const fieldName = Object.keys(field)[0];
            const fieldProperties = field[fieldName];
            let fieldType;

            switch (fieldProperties.type.toLowerCase()) {
                case 'string':
                    fieldType = String;
                    break;
                case 'number':
                    fieldType = Number;
                    break;
                case 'boolean':
                    fieldType = Boolean;
                    break;
                case 'date':
                    fieldType = Date;
                    break;
                case 'array':
                    fieldType = [fieldProperties.itemType || String];
                    break;
                default:
                    fieldType = String;
            }

            schemaDefinition[fieldName] = {
                type: fieldType,
                required: fieldProperties.required || false,
                unique: fieldProperties.unique || false
            };
        });

        const schema = new mongoose.Schema(schemaDefinition);
        const modelCode = `
            const mongoose = require('mongoose');
            const ${modelName}Schema = new mongoose.Schema(${JSON.stringify(schemaDefinition, null, 2)});
            module.exports = mongoose.model('${modelName}', ${modelName}Schema);
        `;
        const folderPath = path.join(__dirname, '../crudFolders/model');

        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath, { recursive: true });

        const filePath = path.join(folderPath, `${modelName}.js`);
        fs.writeFileSync(filePath, modelCode);

        return (`Model ${modelName} created at ${filePath}`);
    } catch (err) {
        console.log(err);
        return err;
    }
}

const generateCrudRouter = async (name) => {
    const routeCode = `
        const express = require('express');
        const router = express.Router();
        const { ${name}Creation, ${name}Updation, ${name}getAll, get${name}ById, ${name}deletion } = require('../controller/${name}Controller');

        router.post('/create', ${name}Creation);
        router.get('/', ${name}getAll);
        router.get('/:id', get${name}ById);
        router.patch('/:id', ${name}Updation);
        router.delete('/:id', ${name}deletion);

        module.exports = router;
    `;

    const folderPath = path.join(__dirname, '../crudFolders/router');
    if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true });

    const filePath = path.join(folderPath, `${name}Route.js`);
    fs.writeFileSync(filePath, routeCode);

    return (`Routes ${name} created at ${filePath}`);
}

const getDestructuredFieldsString = (fieldNames) => {
    return `const { ${fieldNames.join(', ')} } = req.body;`;
};

const crudControllerCreation = (modelName, fields) => {
    try {
        const fieldNames = fields.map(field => Object.keys(field)[0]);
        const destructuredFieldsString = getDestructuredFieldsString(fieldNames);
        const objectOfModel = fieldNames.map(fieldName => `${fieldName}: ${fieldName}`).join(',\n');

        const controllerCode = `
            const ${modelName} = require('../model/${modelName}.js');
            const ${modelName}Creation = async(req, res) => {
                try{
                    const { ${fieldNames.join(', ')} } = req.body;

                    const ${modelName}Object = {${objectOfModel}};
                    const new${modelName} = new ${modelName}(${modelName}Object);
                    await new${modelName}.save();

                    return res.status(201).json({success : 'Data Inserted'});
                }catch(err){
                    console.log('ERROR ::::: ', err);
                    return res.status(500).json({err : 'Something went wrong'})
                }
            }

            const ${modelName}Updation = async (req, res) => {
                try {
                    ${destructuredFieldsString}
                    const ${modelName}Object = {${objectOfModel}};
                    
                    const updated${modelName} = await ${modelName}.findByIdAndUpdate(req.params.id, ${modelName}Object, { new: true });
                    if (!updated${modelName}) {
                        return res.status(404).json({ err: '${modelName} not found' });
                    }

                    return res.status(200).json(updated${modelName});
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    return res.status(500).json({ err: 'Something went wrong' });
                }
            };

            const ${modelName}getAll = async (req, res) => {
                try {
                    const ${modelName}s = await ${modelName}.find();
                    res.status(200).json(${modelName}s);
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    res.status(500).json({ err: 'Something went wrong' });
                }
            };

            const get${modelName}ById = async (req, res) => {
                try {
                    const ${modelName}s = await ${modelName}.findById(req.params.id);
                    if (!${modelName}s) {
                        return res.status(404).json({ err: '${modelName} not found' });
                    }
                    res.status(200).json(${modelName}s);
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    res.status(500).json({ err: 'Something went wrong' });
                }
            };

            const ${modelName}deletion = async (req, res) => {
                try {
                    const ${modelName}s = await ${modelName}.findByIdAndDelete(req.params.id);
                    if (!${modelName}s) {
                        return res.status(404).json({ err: '${modelName} not found' });
                    }
                    res.status(200).json({ msg: '${modelName} deleted successfully' });
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    res.status(500).json({ err: 'Something went wrong' });
                }
            };

            module.exports = {
                ${modelName}Creation,
                ${modelName}Updation,
                ${modelName}getAll,
                get${modelName}ById,
                ${modelName}deletion
            }
        `;

        const folderPath = path.join(__dirname, '../crudFolders/controller');
        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath, { recursive: true });

        const filePath = path.join(folderPath, `${modelName}Controller.js`);
        fs.writeFileSync(filePath, controllerCode);

    } catch (err) {
        console.log('Err :::: ', err);
        return err;
    }
}

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

const crudBuilderInitialized = async (models) => {
    try {
        for (let model of models) {
            const name = model.name;
            const fields = model.fields;

            console.log('Model Creation Initialized......');
            await generateModelIndividually(name, fields);
            console.log('Router Creation Initialized......');
            await generateCrudRouter(name);
            await crudControllerCreation(name, fields);
        }

        const crudFolderPath = path.join(__dirname, '../crudFolders');
        const zipFilePath = path.join(__dirname, '../crudFolders.zip');

        await zipFolder(crudFolderPath, zipFilePath);

        // Return the URL or path to the zip file
        return `http://localhost:3001/path-to-zip/${path.basename(zipFilePath)}`;
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports = crudBuilderInitialized;
