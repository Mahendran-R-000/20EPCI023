const crypto = require('crypto');

function generateProductId(product, company) {
    return crypto.createHash('md5').update(product.productName + company).digest('hex');
}

// Sort products based on the provided criteria
function sortProducts(products, sort) {
    if (!sort) return products;

    const [key, order] = sort.split(',');
    return products.sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

module.exports = {
    generateProductId,
    sortProducts
};