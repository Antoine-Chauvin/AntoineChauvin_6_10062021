const express = require('express');
const router = express.Router();
const tauxLimite = require('express-rate-limit'); // package pour prévenir des attaques par force brute
const userCtrl = require('../controllers/user');

const connectLimatation = tauxLimite({
    windowMs: 2 * 60 * 1000, // Temps défini pour tester l'application
    max: 3 // Nbr de test max par adresse ip
  });

router.post('/signup', userCtrl.signup);//à revoir !
router.post('/login',connectLimatation, userCtrl.login);//à Revoir !


module.exports = router;        

