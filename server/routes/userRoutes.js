const express = require("express");
const router = express.Router();
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("../db/models/userAuthentication");
const Product = require('../db/models/product');
const ProductType = require('../db/models/productType');
const Cart = require('../db/models/cart');
const Image = require('../db/models/image');
const CartItem = require('../db/models/cartItem');
const Dimension = require('../db/models/dimension');
const Order = require('../db/models/order');
const Option = require('../db/models/option');
const Payment = require('../db/models/payment');
const PhysicalAddress = require('../db/models/physicalAddress');
const Price = require('../db/models/price');

router.use(session({
    secret: 'mswd',
    resave: false,
    saveUninitialized: false
}));

router.post("/register", async (request, response) => {
    try {
        // Check if the username already exists
        const existingUserByUsername = await User.findOne({ username: request.body.username });
        if (existingUserByUsername) {
            return response.status(400).send("Username already exists. Please enter a unique username.");
        }

        // Check if the email already exists
        const existingUserByEmail = await User.findOne({ email: request.body.email });
        if (existingUserByEmail) {
            return response.status(400).send("Email already exists. Please use a different email.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        // Create a new user with the hashed password and email
        const newUser = new User({
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        response.status(200).send("User registered successfully!");
    } catch(error) {
        console.error(`Error creating user: ${error}`);
        response.status(500).send("Error creating user!");
    }
});


router.post("/login", async (request, response) => {
    try {
        const user = await User.findOne({ username: request.body.username });
        if (!user) {
            return response.status(404).send("User not found!");
        }
        
        const passwordMatch = await bcrypt.compare(request.body.password, user.password);
        if (passwordMatch) {
            request.session.user = user;
            response.status(200).send("Success login!");
        } else {
            response.status(401).send("Invalid username or password!");
        }
    } catch(error) {
        console.error(`Error logging in: ${error}`);
        response.status(500).send("Error logging in!");
    }
});

const requiredLogin = (request, response, next) => {
    if(request.session.user) {
        next();
    } else {
        response.status(401).send("Unauthorized!");
    }
};

router.post('/logout', (request, response) => {
	request.session.destroy(error => {
		if(error) {
			console.error(error);
			response.status(500).send("Error logging out");
		} else {
			response.status(200).send("Logged out!");
		}
	});
});
router.post('/logout', (request, response) => {
	request.session.destroy(error => {
		if(error) {
			console.error(error);
			response.status(500).send("Error logging out");
		} else {
			response.status(200).send("Logged out!");
		}
	});
});

router.get('/verify', requiredLogin, (request, response) => {
    response.json(`Welcome, ${request.session.user.nickname}!`);
});

router.get('/products', requiredLogin, async (request, response) => {
    try {
        const products = await Product.find();
        response.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).json({ error: 'Error fetching products' });
    }
});

router.get('/product-types', requiredLogin, async (request, response) => {
    try {
        const productTypes = await ProductType.find();
        response.json(productTypes);
    } catch (error) {
        console.error('Error fetching product types:', error);
        response.status(500).json({ error: 'Error fetching product types' });
    }
});

router.get('/carts', requiredLogin, async (request, response) => {
    try {
        const carts = await Cart.find();
        response.json(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
        response.status(500).json({ error: 'Error fetching carts' });
    }
});

router.get('/images', requiredLogin, async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Error fetching images' });
    }
});

router.get('/images/label/:label', requiredLogin, async (req, res) => {
    try {
        const images = await Image.find({ label: req.params.label });
        if (images.length === 0) {
            return res.status(404).json({ error: 'Images with this label not found' });
        }
        res.json(images);
    } catch (error) {
        console.error('Error fetching images by label:', error);
        res.status(500).json({ error: 'Error fetching images by label' });
    }
});

router.get('/cart-items', requiredLogin, async (req, res) => {
    try {
        const cartItems = await CartItem.find();
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Error fetching cart items' });
    }
});

router.get('/cart-items/:id', requiredLogin, async (req, res) => {
    try {
        const cartItem = await CartItem.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json(cartItem);
    } catch (error) {
        console.error('Error fetching cart item:', error);
        res.status(500).json({ error: 'Error fetching cart item' });
    }
});

router.get('/dimensions', requiredLogin, async (req, res) => {
    try {
        const dimensions = await Dimension.find({});
        res.send(dimensions);
    } catch (error) {
        res.status(500).send();
    }
});

// Add a new Option
router.post('/options', requiredLogin, async (req, res) => {
    try {
        const option = new Option(req.body);
        await option.save();
        res.status(201).send(option);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all Options
router.get('/options', requiredLogin, async (req, res) => {
    try {
        const options = await Option.find({});
        res.send(options);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update an Option
router.patch('/options/:id', requiredLogin, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['type', 'label', 'price', 'default'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const option = await Option.findById(req.params.id);
        if (!option) {
            return res.status(404).send();
        }

        updates.forEach((update) => option[update] = req.body[update]);
        await option.save();
        res.send(option);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete an Option
router.delete('/options/:id', requiredLogin, async (req, res) => {
    try {
        const option = await Option.findByIdAndDelete(req.params.id);
        if (!option) {
            return res.status(404).send();
        }
        res.send(option);
    } catch (error) {
        res.status(500).send(error);
    }
});

// POST: Create a new order
router.post('/orders', requiredLogin, async (req, res) => {
    const order = new Order(req.body);
    try {
        const savedOrder = await order.save();
        res.status(201).send(savedOrder);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET: Retrieve all orders
router.get('/orders', requiredLogin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.send(orders);
    } catch (error) {
        res.status(500).send();
    }
});

// PATCH: Update an order by ID
router.patch('/orders/:id', requiredLogin, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!order) {
            return res.status(404).send();
        }
        res.send(order);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE: Delete an order by ID
router.delete('/orders/:id', requiredLogin, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).send();
        }
        res.send(order);
    } catch (error) {
        res.status(500).send();
    }
});

// POST: Create a new payment
router.post('/payments', requiredLogin, async (req, res) => {
    const paymentData = req.body;
    try {
        const payment = new Payment(paymentData);
        const savedPayment = await payment.save();
        res.status(201).send(savedPayment);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET: Retrieve all payments
router.get('/payments', requiredLogin, async (req, res) => {
    try {
        const payments = await Payment.find();
        res.send(payments);
    } catch (error) {
        res.status(500).send();
    }
});

// PATCH: Update a payment by ID
router.patch('/payments/:id', requiredLogin, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['user_id', 'verification_token', 'payment_type', 'created_at', 'amount', 'currency', 'order_id', 'billing_address_id'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!payment) {
            return res.status(404).send();
        }
        res.send(payment);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE: Delete a payment by ID
router.delete('/payments/:id', requiredLogin, async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).send();
        }
        res.send(payment);
    } catch (error) {
        res.status(500).send();
    }
});

// POST: Create a new physical address
router.post('/physical-addresses', requiredLogin, async (req, res) => {
    const addressData = req.body;
    try {
        const address = new PhysicalAddress(addressData);
        const savedAddress = await address.save();
        res.status(201).send(savedAddress);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET: Retrieve all physical addresses
router.get('/physical-addresses', requiredLogin, async (req, res) => {
    try {
        const addresses = await PhysicalAddress.find();
        res.send(addresses);
    } catch (error) {
        res.status(500).send();
    }
});

// PATCH: Update a physical address by ID
router.patch('/physical-addresses/:id', requiredLogin, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['user_id', 'source_id', 'street_number', 'directional', 'street', 'suffix', 'unit_type', 'unit_number', 'zip_code', 'country_code', 'primary', 'active', 'is_billing', 'is_shipping', 'is_warehouse'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const address = await PhysicalAddress.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!address) {
            return res.status(404).send();
        }
        res.send(address);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE: Delete a physical address by ID
router.delete('/physical-addresses/:id', requiredLogin, async (req, res) => {
    try {
        const address = await PhysicalAddress.findByIdAndDelete(req.params.id);
        if (!address) {
            return res.status(404).send();
        }
        res.send(address);
    } catch (error) {
        res.status(500).send();
    }
});

// POST: Create a new price
router.post('/prices', requiredLogin, async (req, res) => {
    const priceData = req.body;
    try {
        const price = new Price(priceData);
        const savedPrice = await price.save();
        res.status(201).send(savedPrice);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET: Retrieve all prices
router.get('/prices', requiredLogin, async (req, res) => {
    try {
        const prices = await Price.find();
        res.send(prices);
    } catch (error) {
        res.status(500).send();
    }
});

// PATCH: Update a price by ID
router.patch('/prices/:id', requiredLogin, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['original', 'discount', 'bulk_discount', 'discount_quantity', 'currency'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const price = await Price.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!price) {
            return res.status(404).send();
        }
        res.send(price);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE: Delete a price by ID
router.delete('/prices/:id', requiredLogin, async (req, res) => {
    try {
        const price = await Price.findByIdAndDelete(req.params.id);
        if (!price) {
            return res.status(404).send();
        }
        res.send(price);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
