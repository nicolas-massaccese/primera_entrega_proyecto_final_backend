const productContainer = require('./productContainer.js');
const productsList = new productContainer('products');

const cartContainer = require('./cartContainer.js');
const cartList = new cartContainer('cart');

const express = require('express');

const { Router } = express;

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const productsRouter = Router();
app.use('/api/products', productsRouter);

const cartRouter = Router();
app.use('/api/cart', cartRouter);

const administrator = true

app.get('/*', async (req, res) =>{
    res.status(403).send({ error : -1, descripcion: 'Ruta erronea !!' });
});
app.put('/*', async (req, res) =>{
    res.status(403).send({ error : -1, descripcion: 'Ruta erronea !!' });
});
app.post('/*', async (req, res) =>{
    res.status(403).send({ error : -1, descripcion: 'Ruta erronea !!' });
});
app.delete('/*', async (req, res) =>{
    res.status(403).send({ error : -1, descripcion: 'Ruta erronea !!' });
});


// --- El router base '/api/products' implementará las siguientes rutas:

productsRouter.get('/', async (req, res) =>{
    const products = await productsList.getAll();
    res.json(products);
});

productsRouter.get('/:id', async (req, res) =>{
    const productId = req.params.id;

    if (isNaN(productId)) {
        res.status(400).send(`${productId} no es un número`);
        return;
    }
    let products = await productsList.getById(Number(productId));
    res.json(products);
});

productsRouter.post('/', async (req, res) => {
    const product = req.body;
    
    if (!administrator) {
        res.status(403).send({ error : -1, descripcion: 'ruta "./api/products" método "POST" no autorizada' });
        return;
    }
    
    const id = await productsList.save(product);
    res.send(id.toString());        
});

productsRouter.put('/:id', async (req, res) => {
    const productId = req.params.id;
    let products = await productsList.getById(Number(productId));

    if (products == null || productId <=0 || isNaN(productId)) {
        res.status(403).send({ error : -1, descripcion: 'ruta "./api/products/:id" método "PUT" no autorizada' });
        return;
    } else {
        let selectProduct = req.body;
        await productsList.updateById(Number(productId), selectProduct);
        res.json(selectProduct);
    };
});

productsRouter.delete('/:id', async (req, res) =>{
    const productId = req.params.id;
    if (!administrator) {
        res.status(403).send({ error : -1, descripcion: 'ruta "./api/products/:id" método "DELETE" no autorizada' });
        return;
    }
    const products = await productsList.deleteById(Number(productId));
    res.json(products);
});



cartRouter.delete('/:id/productos/:id_prod', async (req, res) => {
    const cartId = req.params.id;
    const prodId = req.params.id_prod;
    const cart = await cartList.getCartById(Number(cartId));
    if (cart == null) {
        res.status(400).send(`No se encontro el carrito con ID: ${cartId}`);
        return;
    }
    let prodInCart = cart.products;
    let indexItem = prodInCart.findIndex(element => element.id == prodId);
    if (indexItem == -1) {
        res.status(400).send(`El producto con ID: ${prodId} no se encuentra en el carrito.`);
        return;
    } else {
        prodInCart.splice(indexItem, 1);
        cart.products = prodInCart;
        await cartList.updateCartById(cartId, cart);
        res.json(cart);
        return;
    }
});

// --- El router base '/api/cart' implementará las siguientes rutas:

cartRouter.post('/:id/productos/:id_prod', async (req, res) => {
    const cartId = req.params.id;
    const prodId = req.params.id_prod;

    const cart = await cartList.getCartById(Number(cartId));
    if (cart == null) {
        res.status(400).send(`No se encontro el carrito con ID: ${cartId}`);
        return;
    }

    const product = await productsList.getById(Number(prodId));
    if (product == null){
        res.status(400).send(`No se encontro producto para agrgar con ID: ${prodId}`);
        return;
    }
    
    let prodInCart = cart.products;
    let indexItem = prodInCart.findIndex(element => element.id == prodId);

    if (indexItem == -1) {
        prodInCart.push(product);
        cart.products = prodInCart;
        await cartList.updateCartById(cartId, cart);
        res.json(cart);
        return;
    } else {
        prodInCart[indexItem].stock = prodInCart[indexItem].stock + 1;
        cart.products = prodInCart;
        await cartList.updateCartById(cartId, cart);
        res.json(cart);
        return;
    }
});

cartRouter.get('/:id/products', async (req, res) =>{
    const cartId = req.params.id;
    const cart = await cartList.getCartById(Number(cartId));

    if (cart != null) {
        const arrayProducts = cart.products;
        res.json(arrayProducts);
    } else {
        res.status(400).send(`No se encontro el carrito con ID: ${cartId}`);
    }
});

cartRouter.post('/', async (req, res) => {
    const cart = req.body;
    const id = await cartList.addCart(cart);
    res.send(id.toString());        
});

cartRouter.delete('/:id', async (req, res) => {
    const carttId = req.params.id;
    const cartDeleted = await cartList.deleteById(Number(carttId));
    if(cartDeleted != null){
        res.json(cartDeleted); 
    } else {
        res.status(403).send({ error : -1, descripcion: `ID: ${carttId} de carrito a eliminar inexistente` }); 
    }
});


const PORT = 8080;
app.listen(PORT, () => console.log(`Listening in port ${PORT}`));


