import React from 'react'
import Navbar from '../Header&Footer/Navbar'
import Footer from '../Header&Footer/Footer'
import ProductsPage from './ProductsPage'
import { fetchProductsByCategory } from '../../features/dataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function ShowAllProducts() {
    const { categories, loading, error } = useSelector((state) => state.data);
    const {categoryName} = useParams();
    const normalize = (str) =>
  str?.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();

const matchedCategory = categories.find(
  (el) => normalize(el.category) === normalize(categoryName)
);
  return (
    <>
      <Navbar/>
      <ProductsPage product={matchedCategory}/>
      <Footer/>
    </>
  )
}
