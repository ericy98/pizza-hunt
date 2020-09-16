const { Pizza, Comment } = require('../models');

const commentController = {
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                // adds comment to pizza
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } }, // add comment ID to specific pizza
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id. Sorry!' });
                    return
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.json(err));
    },

    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.id })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No pizza found with this id. Sorry!' });
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id. Sorry!' });
                    return
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.json(err));
    }
};

module.exports = commentController;

