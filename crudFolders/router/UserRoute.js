
        const express = require('express');
        const router = express.Router();
        const { UserCreation, UserUpdation, UsergetAll, getUserById, Userdeletion } = require('../controller/UserController');

        router.post('/create', UserCreation);
        router.get('/', UsergetAll);
        router.get('/:id', getUserById);
        router.patch('/:id', UserUpdation);
        router.delete('/:id', Userdeletion);

        module.exports = router;
    