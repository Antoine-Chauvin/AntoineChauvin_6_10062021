const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // token generator package
const User = require('../models/user');

//La méthode  hash()  de bcrypt crée un hash crypté des mots de passe de vos utilisateurs 
//pour les enregistrer de manière sécurisée dans la base de données.
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'user added' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


//La méthode compare de bcrypt compare un string avec un hash pour, par exemple, vérifier si un mot de passe entré par l'utilisateur correspond 
//à un hash sécurisé enregistré en base de données – cela montre que même bcrypt ne peut pas décrypter ses propres hashs.
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ erro: 'utilisateur non trouvé' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(        //Les JSON web tokens sont des tokens encodés qui peuvent être utilisés pour l'autorisation.
                        { userId: user._id },   //La méthode  sign()  du package  jsonwebtoken  utilise une clé secrète pour encoder un token 
                        'RANDOM_TOKEN_SECRET',  //qui peut contenir un payload personnalisé et avoir une validité limitée.
                        { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};