const express = require('express');
const productController = require('./controllers/productController');

const app = express();
const PORT = 4000;


app.use('/api', productController);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
