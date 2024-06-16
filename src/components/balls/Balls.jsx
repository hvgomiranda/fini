import React, { useEffect, useState } from 'react';
import a1 from './A1.jpg';
import a2 from './A2.jpg';
import a3 from './A3.jpg';
import a4 from './A4.jpg';
import a5 from './A5.jpg';

const Balls = ({ containerSize }) => {
  const [balls, setBalls] = useState([
    { id: 1, x: 100, y: 100, vx: 0.5, vy: 0.5, img: a1, isStopped: false, originalVx: 0.5, originalVy: 0.5 },
    { id: 2, x: 200, y: 200, vx: -0.5, vy: 0.5, img: a2, isStopped: false, originalVx: -0.5, originalVy: 0.5 },
    { id: 3, x: 250, y: 130, vx: 0.5, vy: -0.5, img: a3, isStopped: false, originalVx: 0.5, originalVy: -0.5 },
    { id: 4, x: 300, y: 230, vx: 0.5, vy: 0.5, img: a4, isStopped: false, originalVx: 0.5, originalVy: 0.5 },
    { id: 5, x: 350, y: 100, vx: -0.5, vy: -0.5, img: a5, isStopped: false, originalVx: -0.5, originalVy: -0.5 },
    { id: 6, x: 500, y: 300, vx: 0.5, vy: 0.5, img: a1, isStopped: false, originalVx: 0.5, originalVy: 0.5 },
    { id: 7, x: 400, y: 400, vx: -0.5, vy: 0.5, img: a2, isStopped: false, originalVx: -0.5, originalVy: 0.5 },
    { id: 8, x: 450, y: 360, vx: 0.5, vy: -0.5, img: a3, isStopped: false, originalVx: 0.5, originalVy: -0.5 },
    { id: 9, x: 600, y: 560, vx: 0.5, vy: 0.5, img: a4, isStopped: false, originalVx: 0.5, originalVy: 0.5 },
    { id: 10, x: 750, y: 200, vx: -0.5, vy: -0.5, img: a5, isStopped: false, originalVx: -0.5, originalVy: -0.5 }
  ]);

  const handleMouseEnter = (id) => {
    setBalls((prevBalls) =>
      prevBalls.map((ball) =>
        ball.id === id ? { ...ball, vx: 0, vy: 0, isStopped: true } : ball
      )
    );
  };

  const handleMouseLeave = (id) => {
    setBalls((prevBalls) =>
      prevBalls.map((ball) =>
        ball.id === id ? { ...ball, vx: ball.originalVx, vy: ball.originalVy, isStopped: false } : ball
      )
    );
  };

  useEffect(() => {
    const updatePositions = () => {
      setBalls((prevBalls) => {
        const updatedBalls = prevBalls.map((ball) => {
          if (ball.isStopped) return ball; // No actualizar posiciones si la pelota está detenida por el cursor

          let newX = ball.x + ball.vx;
          let newY = ball.y + ball.vy;
          const circleRadius = 30;
          const { width, height } = containerSize;
          let newVx = ball.vx;
          let newVy = ball.vy;

          // Detectar colisión con el borde izquierdo o derecho
          if (newX - circleRadius < 0 || newX + circleRadius > width) {
            newVx = -ball.vx;
            newX = ball.x + newVx;
          }

          // Detectar colisión con el borde superior o inferior
          if (newY - circleRadius < 0 || newY + circleRadius > height) {
            newVy = -ball.vy;
            newY = ball.y + newVy;
          }

          return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
        });

        // Detectar colisiones entre pelotas
        for (let i = 0; i < updatedBalls.length; i++) {
          for (let j = i + 1; j < updatedBalls.length; j++) {
            const ball1 = updatedBalls[i];
            const ball2 = updatedBalls[j];
            const dx = ball1.x - ball2.x;
            const dy = ball1.y - ball2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = 60; // 2 * circleRadius

            if (distance < minDistance) {
              // Colisión detectada, intercambiar velocidades sólo si ambas pelotas no están detenidas
              if (!ball1.isStopped && !ball2.isStopped) {
                const angle = Math.atan2(dy, dx);
                const speed1 = Math.sqrt(ball1.vx * ball1.vx + ball1.vy * ball1.vy);
                const speed2 = Math.sqrt(ball2.vx * ball2.vx + ball2.vy * ball2.vy);

                const direction1 = Math.atan2(ball1.vy, ball1.vx);
                const direction2 = Math.atan2(ball2.vy, ball2.vx);

                const newVx1 = speed2 * Math.cos(direction2 - angle);
                const newVy1 = speed2 * Math.sin(direction2 - angle);
                const newVx2 = speed1 * Math.cos(direction1 - angle);
                const newVy2 = speed1 * Math.sin(direction1 - angle);

                updatedBalls[i] = {
                  ...ball1,
                  vx: newVx1 * Math.cos(angle) - newVy1 * Math.sin(angle),
                  vy: newVx1 * Math.sin(angle) + newVy1 * Math.cos(angle),
                };
                updatedBalls[j] = {
                  ...ball2,
                  vx: newVx2 * Math.cos(angle) - newVy2 * Math.sin(angle),
                  vy: newVx2 * Math.sin(angle) + newVy2 * Math.cos(angle),
                };
              } else if (ball1.isStopped) {
                // La pelota 1 está detenida, sólo cambiar la velocidad de la pelota 2
                updatedBalls[j] = {
                  ...ball2,
                  vx: -ball2.vx,
                  vy: -ball2.vy,
                };
              } else if (ball2.isStopped) {
                // La pelota 2 está detenida, solo cambiar la velocidad de la pelota 1
                updatedBalls[i] = {
                  ...ball1,
                  vx: -ball1.vx,
                  vy: -ball1.vy,
                };
              }
            }
          }
        }

        return updatedBalls;
      });
    };

    const interval = setInterval(updatePositions, 10);

    return () => {
      clearInterval(interval);
    };
  }, [containerSize]);

  return (
    <div>
      {balls.map((ball) => (
        <div
          key={ball.id}
          style={{
            width: 60,
            height: 60,
            backgroundImage: `url(${ball.img})`,
            backgroundSize: 'cover',
            borderRadius: '50%',
            position: 'absolute',
            left: ball.x - 30,
            top: ball.y - 30,
          }}
          onMouseEnter={() => handleMouseEnter(ball.id)}
          onMouseLeave={() => handleMouseLeave(ball.id)}
        />
      ))}
    </div>
  );
};

export default Balls;
