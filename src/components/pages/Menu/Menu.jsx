import React from 'react'
import { useSelector } from 'react-redux';

const Menu = () => {
  const establishment = useSelector((state)=>state.establishment.data)
  console.log("В меню");
  console.log(establishment);
  return (
    <div>Menu</div>
  )
}

export default Menu