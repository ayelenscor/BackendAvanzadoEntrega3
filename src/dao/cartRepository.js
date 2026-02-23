import { cartModel } from "./models/cartModel.js";
import { productToDTO } from './dtos/productDTO.js';

class CartRepository {

    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async getAllCarts() {
        return cartModel.find();
    }

    async getProductsFromCartByID(cid) {
        const cart = await cartModel.findOne({_id: cid}).populate('products.product');

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
        
        return cart;
    }

    async createCart() {
        return await cartModel.create({products: []});
    }

    async addProductByID(cid, pid) {
        await this.productRepository.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid});

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
    
        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if (item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.length > 0) {
            cart.products[i].quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }
        await cartModel.updateOne({ _id: cid }, { products: cart.products});

        return await this.getProductsFromCartByID(cid);
    }

    async deleteProductByID(cid, pid) {
        await this.productRepository.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid});

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
    
        let i = null;
        const newProducts = cart.products.filter(item => item.product.toString() !== pid);

        await cartModel.updateOne({ _id: cid }, { products: newProducts});
        
        return await this.getProductsFromCartByID(cid);
    }

    async updateAllProducts(cid, products) {

        for (let key in products) {
            await this.productRepository.getProductByID(products[key].product);
        }

        await cartModel.updateOne({ _id: cid }, { products: products });
        
        return await this.getProductsFromCartByID(cid)
    }

    async updateProductByID(cid, pid, quantity) {

        if (!quantity || isNaN(parseInt(quantity))) throw new Error(`La cantidad ingresada no es válida!`);

        await this.productRepository.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid});

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
    
        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if (item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.length === 0) throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);

        cart.products[i].quantity = parseInt(quantity);

        await cartModel.updateOne({ _id: cid }, { products: cart.products});

        return await this.getProductsFromCartByID(cid);
    }

    async deleteAllProducts(cid) {

        await cartModel.updateOne({ _id: cid }, { products: [] });
        
        return await this.getProductsFromCartByID(cid)
    }

    async purchaseCart(cid, purchaserEmail, ProductRepository, TicketRepository) {
        const cart = await cartModel.findOne({ _id: cid }).populate('products.product');
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        const purchasable = [];
        const remaining = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const prod = item.product;
            const qty = item.quantity;

            if (!prod) {
                remaining.push(item);
                continue;
            }

            if (prod.stock >= qty) {
                // can purchase
                purchasable.push({ product: prod, quantity: qty, price: prod.price });
                totalAmount += prod.price * qty;
                // decrement stock
                await ProductRepository.updateProduct(prod._id, { stock: prod.stock - qty });
            } else {
                // not enough stock -> leave in cart
                remaining.push(item);
            }
        }

        // update cart with remaining products
        await cartModel.updateOne({ _id: cid }, { products: remaining });

        if (purchasable.length === 0) {
            return { status: 'error', message: 'No hay productos con stock suficiente' };
        }

        // prepare ticket products
        const ticketProducts = purchasable.map(p => ({ product: p.product._id, quantity: p.quantity, price: p.price }));

        const ticketRepo = new TicketRepository();
        const ticket = await ticketRepo.createTicket({ amount: totalAmount, purchaser: purchaserEmail, products: ticketProducts });

        // prepare notPurchased DTO list
        const notPurchased = remaining.map(item => ({
            product: item.product && item.product._id ? productToDTO(item.product) : { id: item.product?.toString() },
            quantity: item.quantity
        }));

        return { status: 'success', ticket, notPurchased };
    }
}

export { CartRepository };