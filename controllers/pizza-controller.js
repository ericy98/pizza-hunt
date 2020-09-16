const { Pizza } = require('../models');
const { db } = require('../models/Pizza');

const pizzaController = {
    // get all pizzas
    getAllPizza(req, res) {
        Pizza.find({})
            // show comment text when getting pizza data
            .populate({
                path: 'comments',
                select: '-__v' // minus sign, we don't care aout __v field, wont return
            })
            .select('-__v')
            .sort({ _id: -1 })  // sort in DESC order by _id value
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one pizza by id
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments', 
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => {
                // if no pizza is found, send 404
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id. Sorry!' });
                    return;
                }
                res.json(dbPizzaData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });

    },

    // add a pizza to db
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },

    // updating a pizza
    updatePizza({ params, body }, res) {
        // set new:true so that it returns new version of the document
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id. Sorry! ' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete a pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id. Sorry! ' });
                    return;
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.status(400).json(err));
    }
}


module.exports = pizzaController;