const path = require('path');
const fs = require('fs');

const generateCrudRouter = async (name) => {
    const routeCode = `
        const express = require('express');
        const router = express.Router();
        const { ${name}Creation, ${name}Updation, ${name}getAll, get${name}ById, ${name}deletion } = require('../controller/${name}Controller');

         router.post('/create/${name}', ${name}Creation);
        router.get('/get/${name}', ${name}getAll);
        router.get('/get/${name}:id', get${name}ById);
        router.patch('${name}/:id', ${name}Updation);
        router.delete('${name}/:id', ${name}deletion);

        module.exports = router;
    `;

    const folderPath = path.join(__dirname, '../crudFolders/router');
    if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true });

    const filePath = path.join(folderPath, `${name}Route.js`);
    fs.writeFileSync(filePath, routeCode);

    return (`Routes ${name} created at ${filePath}`);
}

module.exports = generateCrudRouter;