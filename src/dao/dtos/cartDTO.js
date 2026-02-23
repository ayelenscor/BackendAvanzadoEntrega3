import { productToDTO } from './productDTO.js';

function cartToDTO(cart) {
    if (!cart) return null;
    return {
        id: cart._id?.toString(),
        products: (cart.products || []).map(p => ({
            product: p.product && p.product._id ? productToDTO(p.product) : { id: p.product?.toString() },
            quantity: p.quantity
        }))
    }
}

export { cartToDTO };