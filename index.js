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