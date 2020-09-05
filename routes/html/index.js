const path = require('path');
const router = require('express').Router();



router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/...'));
});

router.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/...'));
});

module.exports = router;