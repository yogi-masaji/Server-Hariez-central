const router = require('express').Router();

const TeknisiController = require('../controllers/TeknisiController');

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'router teknisi!' });
})
router.post('/', TeknisiController.createTeknisi);
router.get('/', TeknisiController.getAllTeknisi);
router.get('/:id', TeknisiController.getTeknisiById);
router.put('/:id', TeknisiController.updateTeknisi);
router.delete('/:id', TeknisiController.deleteTeknisi);
module.exports = router;