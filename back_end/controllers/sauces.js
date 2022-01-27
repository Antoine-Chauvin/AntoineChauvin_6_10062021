const Sauce = require('../models/sauces');
const fs = require('fs');

//récupère tous les objets sauce de Base de Donnée. 

exports.getSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))  // POSSIBLE ENDROIT D'ERROR À TESTER. 
    .catch(error => res.status(400).json({ error }));
};

// Récupère un obj sauce 

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//Permet à l'UI de crée un nouvelle obj 'sauce'
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

//Permet de modifier un obj 'sauce'
exports.modifySauce = (req, res, next) => {

  let sauceObject = {};
  req.file ? (
      Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)}),
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    }
  ) : ( sauceObject = {...req.body}  )
  Sauce.updateOne({_id: req.params.id},{...sauceObject,_id: req.params.id})
    .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
    .catch((error) => res.status(400).json({error}))
}


//suppr un obj sauce 

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  if (like === 1) { // option j'aime
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $pull: { usersDisliked: req.body.userId },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      }
    )
      .then(() => res.status(200).json({ message: 'You like this sauce' }))

      // like partie 

      .catch(error => res.status(400).json({ error }))
  } else if (like === -1) { // option j'aime pas
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $pull: { usersLiked: req.body.userId },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      }
    )
      .then(() => res.status(200).json({ message: 'You don\'t like this sauce' }))
      .catch(error => res.status(400).json({ error }))

  } else {    //option annulation du j'aime ou / j'aime pas
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id
            }
          )
            .then(() => res.status(200).json({ message: 'You don\'t like this sauce anymore ' }))
            .catch(error => res.status(400).json({ error }))
        }
        else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            }
          )
            .then(() => res.status(200).json({ message: 'You might like this sauce now ' }))
            .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }))
  }
};