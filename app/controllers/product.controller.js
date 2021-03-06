const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

// Create and Save a new Product
exports.create = (req, res) => {
    // Validate request
    if (!req.body.productName) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Product
    const product = {
        productId: req.body.productId,
        productName: req.body.productName,
        typeId: req.body.typeId,
        manufacturerId: req.body.manufacturerId,
        purchaseCost: req.body.purchaseCost,
        saleCost: req.body.saleCost,
        quantityOnStock: req.body.quantityOnStock,
    };

    // Save Product in the database
    Product.create(product)
        .then(data => {
            res.redirect('/api/products');
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Product."
            });
        });
};

// Retrieve all Products
exports.retrieveAll = (req, res) => {
    Product.findAll()
        .then(products => res.render('products', {
            products
        }))
        .catch(err => console.log(err));
};

//Search by the productName in the request
exports.searchProduct = (req, res) => {
    let productName = req.query.productName;
    Client.findAll({ where: { productName: { [Op.like]: '%' + productName + '%' } } })
        .then(products => res.render('products', { products }))
        .catch(err => console.log(err));
};

// Update a Product by the id in the request
exports.update = (req, res) => {
    const productId = req.params.productId;
    console.log(productId);
    console.log(req.body);
    Product.update(req.body, {
        where: { productId: productId }
    })
        .then(products => {
            if (products === 1) {
                res.render('products', {products})
            } else {
                res.send({
                    message: `Cannot update Product with id=${productId}. Maybe Product was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Product with id=" + productId
            });
        });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
    const productId = req.params.productId;

    Product.destroy({
        where: { productId: productId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message:   "Product was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Product with id=${productId}. Maybe Product was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Product with productId=" + productId
            });
        });
};

// Delete all Products from the database.
exports.deleteAll = (req, res) => {
    Product.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Products were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all products."
            });
        });
};
