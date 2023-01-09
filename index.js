/* 
2. El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:
a. POST: '/' - Crea un carrito y devuelve su id.
b. DELETE: '/:id' - Vacía un carrito y lo elimina.
c. GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
d. POST: '/:id/productos/:id_prod' - Para incorporar productos al carrito por su id de producto
e. DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de
producto
3. Crear una variable booleana administrador, cuyo valor configuraremos más adelante con el sistema
de login. Según su valor (true ó false) me permitirá alcanzar o no las rutas indicadas. En el caso de recibir un request a una ruta no permitida por el perfil, devolver un objeto de error. El status http de la respuesta debe ser 403. Ejemplo: { error : -1, descripcion: ruta 'x' método 'y' no autorizada }

5. Un producto dispondrá de los siguientes campos: id, timestamp, nombre, descripcion, código, foto (url), precio, stock.
6. El carrito de compras tendrá la siguiente estructura:
id, timestamp(carrito), productos: [id] /* { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
7. El timestamp puede implementarse con Date.now()
8. Realizar la persistencia de productos y del carrito de compras en el filesystem.

>>A tener en cuenta:
1. Para realizar la prueba de funcionalidad hay dos opciones:
a. Probar con postman cada uno de los endpoints (productos y carrito) y su operación en conjunto.
b. Realizar una aplicación frontend sencilla, utilizando HTML/CSS/JS ó algún framework de preferencia, que represente el listado de productos en forma de cards. En cada card figuran los datos del producto, que, en el caso de ser administradores, podremos editar su información. Para este último caso incorporar los botones actualizar y eliminar. También tendremos un formulario de ingreso de productos nuevos con los campos correspondientes y un botón enviar. Asimismo, construir la vista del carrito donde se podrán ver los productos agregados e incorporar productos a comprar por su id de producto. Esta aplicación de frontend debe enviar los requests get, post, put y delete al servidor utilizando fetch y debe estar ofrecida en su espacio público.


2. En todos los casos, el diálogo entre el frontend y el backend debe ser en formato JSON. El servidor no debe generar ninguna vista.
3. En el caso de requerir una ruta no implementada en el servidor, este debe contestar un objeto de error: ej { error : -2, descripcion: ruta 'x' método 'y' no implementada}
4. La estructura de programación será ECMAScript, separada tres en módulos básicos (router, lógica de negocio/api y persistencia ). Más adelante implementaremos el desarrollo en capas. Utilizar preferentemente clases, constructores de variables let y const y arrow function.
5. Realizar la prueba de funcionalidad completa en el ámbito local (puerto 8080) y en glitch.com
*/

const Container = require('./fileContainer.js');

const productsList = new Container('products');

const express = require('express');

const { Router } = express;

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


const productsRouter = Router();
const cartRouter = Router();



const administrator = true



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


// const cartList = new Container('cart');


// cartRouter.post('/', async (req, res) => {
//     const cart = req.body;
    
//     const id = await cartList.save(cart);

//     res.send(id.toString());        
// });

// cartRouter.post('/:id/productos/:id_prod', async (req, res) => {
//     const carttId = req.params.id_prod;
//     if (isNaN(carttId)) {
//         res.status(400).send(`${carttId} no es un número`);
//         return;
//     }
//     let cart = await cartList.getById(Number(carttId));
//     res.json(cart);      
// });

// cartRouter.delete('/:id', async (req, res) => {
//     const carttId = req.params.id;
//     if (isNaN(carttId)) {
//         res.status(400).send(`${carttId} no es un número`);
//         return;
//     }
//     const cart = await cartList.deleteById(Number(carttId));
//     res.json(cart);        
// });

// cartRouter.get('/:id/productos', async (req, res) =>{
//     const carttId = req.params.id;
//     if (isNaN(carttId)) {
//         res.status(400).send(`${carttId} no es un número`);
//         return;
//     }
//     let cart = await cartList.getById(Number(carttId));
//     res.json(cart);
// });


app.use('/api/products', productsRouter);

app.use('/api/cart', cartRouter);

const PORT = 8080;

app.listen(PORT, () => console.log(`Listening in port ${PORT}`));

