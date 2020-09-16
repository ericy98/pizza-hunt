const moment = require('moment');
const { Schema, model } = require('mongoose');

// use schema constructor imported from mongoose; defined fields for clarity
const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String
        },
        createdBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format('DD MMM YYYY [at] hh:mm a')
        },
        size: {
            type: String,
            default: 'Large'
        },
        toppings: [],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment' // tells Pizza model which doc to search for 
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
    
);

// get total  count of commments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;
