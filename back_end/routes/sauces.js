const express = require('express');

// grâce à la méthode express.Router() cela permet de crée un routeur principal où on y enrgistre les routes (middlewares) individuelles.
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

//import les fonctions des middlewares depuis ../controllers/sauces.js
const saucesCtrl = require('../controllers/sauces')


router.get('/', auth, saucesCtrl.getSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;