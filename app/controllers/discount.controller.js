const db = require("../models");
const Discount = db.discounts;
const Op = db.Sequelize.Op;

// Create and Save new Discount
exports.create = (req, res) => {
    // Validate request
    if (!req.body.discountId) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create new Discount
    const discount = {
        discountId: req.body.discountId,
        discountName: req.body.discountName,
        discountDescription: req.body.discountDescription,
        discountPercent: req.body.discountPercent
    };
    // Save Discount in the database
    Discount.create(discount)
        .then(data => {
            res.redirect('/api/discounts');
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Discount."
            })
        })
};

// Retrieve all Discounts
exports.retrieveAll = (req, res) => {
    Discount.findAll()
        .then(discounts => res.render('discounts', {
            discounts
        }))
        .catch(err => console.log(err));
};

//Search by the deliveryName in the request
exports.searchDiscount = (req, res) => {
    let discountName = req.query.discountName;
    Discount.findAll({ where: { discountName: { [Op.like]: '%' + discountName + '%' } } })
        .then(discounts => res.render('discounts', { discounts }))
        .catch(err => console.log(err));
};


// Update a Discount by the id in the request
exports.update = (req, res) => {
    const discountId = req.params.discountId;

    Discount.update(req.body, {
        where: { discountId: discountId }
    })
        .then(discounts => {
            if (discounts === 1) {
                res.render('discounts', {discounts})
            } else {
                res.send({
                    message: `Cannot update Discount with id=${discountId}. Maybe Discount was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Discount with id=" + discountId
            });
        });
};

// Delete a Discount with the specified id in the request
exports.delete = (req, res) => {
    const discountId = req.params.discountId;

    Discount.destroy({
        where: { discountId: discountId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message:   "Discount was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Discount with id=${discountId}. Maybe Discount was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Discount with id=" + discountId
            });
        });
};

// Delete all Discounts from the database.
exports.deleteAll = (req, res) => {
    Discount.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Discounts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all discounts."
            });
        });
};
