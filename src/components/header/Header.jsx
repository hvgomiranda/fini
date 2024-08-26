import React, { useState } from 'react'
import styled from 'styled-components'
import BurguerButton from "../menu-btn/Menu-btn.jsx";

function Navbar() {

  const [clicked, setClicked] = useState(false)
  const handleClick = () => {
    setClicked(!clicked)
  }
  return (
    <NavContainer>
    <h2>Victoria Fini</h2>
    <div className={`links ${clicked ? 'active' : ''}`}>
        <a onClick={handleClick} href="#h">Color</a>
        <a onClick={handleClick} href="#h">Edición online</a>
        <a onClick={handleClick} href="#h">Restauración</a>
        <a onClick={handleClick} href="#h">Coordinación de postproducción</a>
        <a onClick={handleClick} href="#h">Delivery</a>
        <a onClick={handleClick} href="#h">Contacto</a>
    </div>
    <div className='burguer'>
        <BurguerButton clicked={clicked} handleClick={handleClick} />
    </div>
    <BgDiv className={`initial ${clicked ? ' active' : ''}`}></BgDiv>
    </NavContainer>
  )
}

export default Navbar

const NavContainer = styled.nav`
  h2{
    color: white;
    font-weight: 400;
    z-index: 10;
    span{
      font-weight: bold;
    }
  }
  padding: .4rem;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  a{
    color: white;
    text-decoration: none;
    margin-right: 1rem;
    z-index: 20;
  }
  .links{
    position: absolute;
    top: -700px;
    left: -2000px;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    transition: all .5s ease;
    z-index: 15;
    a{
      color: white;
      font-size: 2rem;
      display: block;
    }
    @media(min-width: 768px){
        display: none;
    }
  }
  .links.active{
    width: 100%;
    display: block;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    top: 30%;
    left: 0;
    right: 0;
    text-align: center;
    a{
      font-size: 2rem;
      margin-top: 1rem;
      color: white;
    }
  }
  .burguer{
    z-index: 20;
  }
`

const BgDiv = styled.div`
  background-color: #222;
  position: absolute;
  top: -1000px;
  left: -1px;
  width: 100%;
  height: 100%;

  transition: all .6s ease ;
  z-index: 5;

  &.active{
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`