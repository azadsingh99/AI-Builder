const path = require('path');
const fs = require('fs');

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

module.exports = crudControllerCreation;