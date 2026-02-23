import { Router } from 'express';
import { ProductRepository } from '../dao/productRepository.js';
import { CartRepository } from '../dao/cartRepository.js';
import { productToDTO } from '../dao/dtos/productDTO.js';
import { cartToDTO } from '../dao/dtos/cartDTO.js';

const router = Router();
const ProductService = new ProductRepository();
const CartService = new CartRepository(ProductService);

router.get('/products', async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);
    const docs = (products.docs || []).map(productToDTO);

    res.render(
        'index',
        {
            title: 'Productos',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(docs)),
            prevLink: {
                exist: products.prevLink ? true : false,
                link: products.prevLink
            },
            nextLink: {
                exist: products.nextLink ? true : false,
                link: products.nextLink
            }
        }
    )
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);
    const docs = (products.docs || []).map(productToDTO);
    res.render(
        'realTimeProducts',
        {
            title: 'Productos',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(docs))
        }
    )
});

router.get('/cart/:cid', async (req, res) => {
    const response = await CartService.getProductsFromCartByID(req.params.cid);

    if (!response) {
        return res.render(
            'notFound',
            {
                title: 'Not Found',
                style: 'index.css'
            }
        );
    }

    const dto = cartToDTO(response);

    res.render(
        'cart',
        {
            title: 'Carrito',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(dto.products))
        }
    )
});

export default router;