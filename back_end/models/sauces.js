const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: {type: String, require: true},
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    mainPeppeer: {type: String, require: true},
    imageUrl: {type: String, require: true},
    heat: {type: Number, require: true},
   /*  likes: {type: Number, default: 0},
    dislikes:{type: Number, default:0}, */
    usersLiked: [String],
    usersDisliked: [String] ,
},
{toJSON: {virtuals: true}}
)

sauceSchema.virtual("likes").get(function(){
    return this.usersLiked.length
});
sauceSchema.virtual("dislikes").get(function(){
    return this.usersDisliked.length
});


module.exports = mongoose.model('Sauce', sauceSchema)