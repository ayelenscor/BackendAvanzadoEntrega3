import { Router } from 'express';
import { ProductRepository } from '../dao/productRepository.js';
import { CartRepository } from '../dao/cartRepository.js';
import { cartToDTO } from '../dao/dtos/cartDTO.js';
import { TicketRepository } from '../dao/ticketRepository.js';
import passport from '../utils/passportUtil.js';


const router = Router();
const ProductService = new ProductRepository();
const CartService = new CartRepository(ProductService);

const TicketService = new TicketRepository();

router.get('/:cid', async (req, res) => {

    try {
        const result = await CartService.getProductsFromCartByID(req.params.cid);
        res.send({
            status: 'success',
            payload: cartToDTO(result)
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {

    try {
        const result = await CartService.createCart();
        res.send({
            status: 'success',
            payload: cartToDTO(result)
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {

    try {
        const result = await CartService.addProductByID(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: cartToDTO(result)
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {

    try {
        const result = await CartService.deleteProductByID(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: cartToDTO(result)
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid', async (req, res) => {

    try {
        const result = await CartService.updateAllProducts(req.params.cid, req.body.products)
        res.send({
            status: 'success',
            payload: cartToDTO(result)
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {

    try {
        const result = await CartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity)
        res.send({
            status: 'success',
            payload: cartToDTO(result)
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid', async (req, res) => {

    try {
        const result = await CartService.deleteAllProducts(req.params.cid)
        res.send({
            status: 'success',
            payload: cartToDTO(result)
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/purchase', passport.authenticate('current', { session: false }), async (req, res) => {
    try {
        const purchaserEmail = req.user?.email || req.user?.username || 'unknown@unknown';
        const result = await CartService.purchaseCart(req.params.cid, purchaserEmail, ProductService, TicketRepository);
        if (result.status === 'error') {
            return res.status(400).send({ status: 'error', message: result.message });
        }

        res.send({ status: 'success', payload: { ticket: result.ticket, notPurchased: result.notPurchased } });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

export default router;