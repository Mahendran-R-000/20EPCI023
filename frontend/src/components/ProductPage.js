import React from 'react';
import ProductList from '../components/ProductList';
import Filter from '../components/Filter';

const ProductsPage = () => {
  return (
    <div>
      <h1>All Products</h1>
      <Filter />
      <ProductList />
    </div>
  );
};

export default ProductsPage;
