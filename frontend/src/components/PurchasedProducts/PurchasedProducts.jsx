import React from 'react'
import Navbar from '../Header&Footer/Navbar'
import MyOrders from './MyOrders'
import Footer from '../Header&Footer/Footer'
import ShowOrder from './ShowOrder'

export default function PurchasedProducts() {

  const orderData = {
    title: "Boult Pyro Rotating Bezel, 1.43\" AMOLED, 600 Nits, BT Calling",
    image: "media/headerImg/img1.png",
    price: 2508,
    color: "Gunmetal",
    size: "36.322",
    rating: 4,
    statusTimeline: [
      { label: "Order Confirmed", date: "Apr 03" },
      { label: "Delivered", date: "Apr 05" }
    ],
    returnPolicyEnd: "Apr 12",
    shipping: {
      name: "Nirupam",
      address:
        "Subhasgram , HARINAVI , R.N.T ROAD HARINAVI, NAYAOIKKO CLUB, Rajpur Sonarpur, West Bengal - 700148",
      phone: "7439893394"
    },
    priceBreakdown: [
      { label: "List price", value: "₹7,999", strike: true },
      { label: "Selling price", value: "₹7,999" },
      { label: "Extra Discount", value: "- ₹5,500" },
      { label: "Special Price", value: "₹2,499" },
      { label: "Delivery Charge", value: "₹40 Free" },
      { label: "Protect Promise Fee", value: "₹9" }
    ]
  };
  return (
    <>
     <Navbar/>
     {/* <MyOrders/> */}
     <ShowOrder order={orderData}/>
     <Footer/>
    </>
  )
}
