const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: {type: String, require: true},
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    mainPeppeer: {type: String, require: true},
    imageUrl: {type: String, require: true},
    heat: {type: Number, require: true},
    usersLiked: [String],
    usersDisliked: [String] ,
},
{toJSON: {virtuals: true}}
)

//crée l'info de like ou dislike qui est calculer au besoin quand on lit le produit
sauceSchema.virtual("likes").get(function(){
    return this.usersLiked.length
});
sauceSchema.virtual("dislikes").get(function(){
    return this.usersDisliked.length
});


module.exports = mongoose.model('Sauce', sauceSchema)