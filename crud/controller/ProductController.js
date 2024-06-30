
            const Product = require('../model/Product.js');
            const ProductCreation = async(req, res) => {
                try{
                    const { title, price, description, inStock } = req.body;

                    const ProductObject = {title: title,
price: price,
description: description,
inStock: inStock}
                    const newProduct = new Product(ProductObject);
                    await newProduct.save();

                    return res.status(201).json({success : 'Data Inserted'});
                }catch(err){
                    console.log('ERROR ::::: ', err);
                    return res.status(500).json({err : 'Something went wrong'})
                }
            }

            const ProductUpdation = async (req, res) => {
                try {
                    const { title, price, description, inStock } = req.body;
                    const ProductObject = {title: title,
price: price,
description: description,
inStock: inStock};
                    
                    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, ProductObject, { new: true });
                    if (!updatedProduct) {
                        return res.status(404).json({ err: 'Product not found' });
                    }

                    return res.status(200).json(updatedProduct);
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    return res.status(500).json({ err: 'Something went wrong' });
                }
            };

            const ProductgetAll = async (req, res) => {
                try {
                    const Products = await Product.find();
                    res.status(200).json(Products);
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    res.status(500).json({ err: 'Something went wrong' });
                }
            };

            
            const getProductById = async (req, res) => {
                try {
                    const Products = await Product.findById(req.params.id);
                    if (!Products) {
                        return res.status(404).json({ err: 'Product not found' });
                    }
                    res.status(200).json(Products);
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    res.status(500).json({ err: 'Something went wrong' });
                }
            };

             
            const Productdeletion = async (req, res) => {
                try {
                    const Products = await Product.findByIdAndDelete(req.params.id);
                    if (!Products) {
                        return res.status(404).json({ err: 'Product not found' });
                    }
                    res.status(200).json({ msg: 'Product deleted successfully' });
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    res.status(500).json({ err: 'Something went wrong' });
                }
            };

            module.exports = {
                ProductCreation,
                ProductUpdation,
                ProductgetAll,
                getProductById,
                Productdeletion
            }
        