function productToDTO(product) {
    if (!product) return null;
    return {
        id: product._id?.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails || [],
    };
}

export { productToDTO };