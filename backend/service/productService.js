const axios = require('axios');
const { generateProductId, sortProducts } = require('../model/product');

const TEST_SERVER_URL = "http://20.244.56.144/test";
const AUTH_URL = `${TEST_SERVER_URL}/auth`;
const COMPANY_API_PATHS = {
    AMZ: "/companies/AMZ/categories/",
    FLIP: "/companies/FLIP/categories/",
    SNP: "/companies/SNP/categories/",
    MYN: "/companies/MYN/categories/",
    AZO: "/companies/AZO/categories/"
};
const AUTH_CREDENTIALS = {
    companyName: "SKCET",
    clientID: "3a814a13-82a9-45c8-ba07-c938cab5d3c4",
    clientSecret: "XtORziLHLJtzxjLX",
    ownerName: "Mahendran R",
    ownerEmail: "20epci023@skcet.ac.in",
    rollNo: "20EPCI023"
};

async function getAuthToken() {
    try {
        const response = await axios.post(AUTH_URL, AUTH_CREDENTIALS);
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching auth token:", error.message);
        throw new Error("Failed to fetch auth token");
    }
}
async function fetchProducts(categoryName, options) {
    const { limit = 10, minPrice, maxPrice, page = 1, sort } = options;
    const companies = Object.keys(COMPANY_API_PATHS);
    const token = await getAuthToken();
    try {
        const responses = await Promise.all(companies.map(async company => {
            const url = `${TEST_SERVER_URL}${COMPANY_API_PATHS[company]}${categoryName}/products`;
            const params = { minPrice, maxPrice };
            const headers = { Authorization: `Bearer ${token}` };
            
            console.log(`URL: ${url}`);
            console.log(`Params: ${JSON.stringify(params)}`);
            console.log(`Headers: ${JSON.stringify(headers)}`);
    
            let response; // Define response here
            try {
                response = await axios.get(url, { params, headers });
                console.log(`Response: ${JSON.stringify(response.data)}`);
            } catch (error) {
                console.error(`Error fetching products: ${error}`);
            }
            
            if (response && response.data) { // Check if response is defined
                return response.data.map(product => ({
                    ...product,
                    company,
                    id: generateProductId(product, company)
                }));
            }
        }));
    

        // Flatten the array of arrays into a single array
        const allProducts = [].concat(...responses);
        const totalPages = Math.ceil(allProducts.length / limit);

        // Apply limit and page
        const start = (page - 1) * limit;
        const end = start + limit;
        const products = allProducts.slice(start, end);

        return {
            products,
            page,
            limit,
            totalPages,
        };
    } catch (error) {
        console.error(`Error fetching products: ${error.message}`);
    
    return { products: [], page: 0, limit: 0, totalPages: 0 };

    }
}

async function fetchProductById(categoryName, productId) {
    const companies = Object.keys(COMPANY_API_PATHS);
    const token = await getAuthToken();

    try {
        for (const company of companies) {
            const url = `${TEST_SERVER_URL}${COMPANY_API_PATHS[company]}${categoryName}/products/${productId}`;
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const response = await axios.get(url, { headers });
                if (response.data) {
                    return response.data;
                }
            } catch (error) {
                // Ignore if product not found in this company
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching product by ID:", error.message);
        throw new Error("Failed to fetch product by ID");
    }
}
module.exports = {
    fetchProducts,
    fetchProductById,

};