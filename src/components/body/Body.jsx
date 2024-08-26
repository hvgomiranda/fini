import "./Body.css";
import Circles from "../circles/Circles.jsx";
import React, { useEffect, useState, useRef } from 'react';

const Body = () => {
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
      const updateContainerSize = () => {
        if (containerRef.current) {
          setContainerSize({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
          });
        }
      };
  
      // Obtener el tamaño del contenedor al montar el componente
      updateContainerSize();
  
      // Actualizar el tamaño del contenedor cuando la ventana cambia de tamaño
      window.addEventListener('resize', updateContainerSize);
      return () => {
        window.removeEventListener('resize', updateContainerSize);
      };
    }, []);
  
    return (
      <div
        ref={containerRef}
        className="Body"
      >
        <Circles />
      </div>
    );
  };
  
  export default Body;