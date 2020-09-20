const moment = require('moment');
const { Schema, model } = require('mongoose');

// use schema constructor imported from mongoose; defined fields for clarity
const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String, 
            required: 'You need to provide a pizza name!',
            trim: true
        },
        createdBy: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format('DD MMM YYYY [at] hh:mm a')
        },
        size: {
            type: String,
            required: true,
            enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
    // accumulator = total ... currentValue = comment
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;
