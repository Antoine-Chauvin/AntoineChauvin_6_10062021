const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: {type: String, require: true},
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    mainPeppeer: {type: String, require: true},
    imageUrl: {type: String, require: true},
    heat: {type: Number, require: true},
    likes: {type: Number, default: 0},
    dislikes:{type: Number, default:0},
    usersLiked: [String],
    usersDisliked: [String] ,
})

/* usersLiked : [ "String <userId>" ] — tableau des identifiants des utilisateurs
qui ont aimé (= liked) la sauce
usersDisliked : [ "String <userId>" ] — tableau des identifiants des
utilisateurs qui n'ont pas aimé (= disliked) la sauce */

module.exports = mongoose.model('Sauce', sauceSchema)