const express = require('express');
const path = require('path');
require('dotenv').config();

const crudRouter = require('./route/crudBuilderRouter');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ success: true, service: 'crud-builder' }));
app.use(crudRouter);
app.use('/public', express.static(path.join(__dirname, 'public')));

if (require.main === module) {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => console.log(`CRUD Builder server running on port ${port}`));
}

module.exports = app;
