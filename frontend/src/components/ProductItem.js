import React from 'react';

const ProductItem = ({ product }) => {
  const { name, company, category, price, rating, discount, availability } = product;

  return (
    <div className="product-item">
      <h3>{name}</h3>
      <p><strong>Company:</strong> {company}</p>
      <p><strong>Category:</strong> {category}</p>
      <p><strong>Price:</strong> {price}</p>
      <p><strong>Rating:</strong> {rating}</p>
      <p><strong>Discount:</strong> {discount}</p>
      <p><strong>Availability:</strong> {availability ? 'Available' : 'Out of Stock'}</p>
    </div>
  );
};

export default ProductItem;
