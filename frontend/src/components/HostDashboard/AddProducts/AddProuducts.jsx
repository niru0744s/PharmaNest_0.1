import React from 'react'
import ProductForm from './ProductForm'
import HostNavbar from '../LandingPage/HostNavbar'
import HostFooter from "../LandingPage/HostFooter"

export default function AddProuducts() {
  return (
    <>
      <HostNavbar/>
      <ProductForm/>
      <HostFooter/>
    </>
  )
}