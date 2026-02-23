import { ProductRepository } from './dao/productRepository.js';
import { productToDTO } from './dao/dtos/productDTO.js';
const ProductService = new ProductRepository();

export default (io) => {
    io.on("connection", (socket) => {

        socket.on("createProduct", async (data) => {

            try {
                await ProductService.createProduct(data);
                const products = await ProductService.getAllProducts({});
                const docs = (products.docs || []).map(productToDTO);
                socket.emit("publishProducts", docs);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("deleteProduct", async (data) => {
            try {
                const result = await ProductService.deleteProduct(data.pid);
                const products = await ProductService.getAllProducts({});
                const docs = (products.docs || []).map(productToDTO);
                socket.emit("publishProducts", docs);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });
    });
}