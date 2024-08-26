import React, { useEffect, useRef } from 'react';
import Matter from "matter-js";

const Circles = () => {
  // alias
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Composite = Matter.Composite,
    Query = Matter.Query,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    World = Matter.World,
    MouseConstraint = Matter.MouseConstraint;

  // set engine
  var engine = Engine.create();

  // set component size
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var wallSize = 0.001;
  var circleSize = windowWidth / 20;

  const circles = [];
  const maxSpeed = 5;

  // set circles
  for (let i = 0; i < 10; i++) {
    const circle = Bodies.circle(windowWidth / 2, windowHeight / 2, circleSize, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      inertia: Infinity,
      label: "circle"
    });
    Matter.Body.setVelocity(circle, { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 });
    circles.push(circle);
  }

  // set walls
  const walls = [
    Bodies.rectangle(windowWidth / 2, 0, windowWidth, wallSize, { isStatic: true, label: "wall" }), //up
    Bodies.rectangle(windowWidth / 2, windowHeight- 100, windowWidth, wallSize, { isStatic: true, label: "wall" }), //down
    Bodies.rectangle(windowWidth, windowHeight / 2, wallSize, windowHeight, { isStatic: true, label: "wall" }), //right
    Bodies.rectangle(0, windowHeight / 2, wallSize, windowHeight, { isStatic: true, label: "wall" }) //left
  ];

  const sceneRef = useRef(null);

  useEffect(() => {
    //set renderer
    const render = Render.create({
      element: sceneRef.current, // attach to the ref container
      engine: engine,
      options: {
        width: windowWidth - wallSize,
        height: windowHeight - wallSize,
        wireframes: false,
        background: 'transparent' // Makes sure the background is transparent
      }
    });

    // add all of the bodies to the world
    Composite.add(engine.world, [
      ...circles,
      ...walls
    ]);

    engine.gravity.y = 0.1;

    // Function to apply impulse
    function applyImpulse(circle, collision) {
      const normal = collision.normal;
      const impulseMagnitude = 5; // Adjust this value to change the impulse strength
      Matter.Body.applyForce(circle, circle.position, {
        x: normal.x * impulseMagnitude,
        y: normal.y * impulseMagnitude
      });
    }

    // Collision event listener
    Events.on(engine, 'collisionStart', function (event) {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB, collision } = pairs[i];
        if ((bodyA.label === 'circle' && bodyB.label === 'wall') || (bodyA.label === 'wall' && bodyB.label === 'circle')) {
          const circle = bodyA.label === 'circle' ? bodyA : bodyB;
          applyImpulse(circle, collision);
        }
      }
    });

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: {
          visible: false
        }
      }
    });

    // Add limit speed
    function limitSpeed(circle) {
      const velocity = circle.velocity;
      const speed = Vector.magnitude(velocity);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed; // maxSpeed is set in line 29
        Body.setVelocity(circle, {
          x: velocity.x * scale,
          y: velocity.y * scale
        });
      }
    }

    Events.on(engine, 'beforeUpdate', function () {
      for (const circle of circles) {
        limitSpeed(circle);
      }
    });

    // Add pointer cursor if mouse is above a circle
    Events.on(mouseConstraint, 'mousemove', function (event) {
      const mousePosition = event.mouse.position;
      const bodies = Query.point(circles, mousePosition);

      if (bodies.length > 0) {
        render.canvas.style.cursor = 'pointer';
      } else {
        render.canvas.style.cursor = 'default';
      }
    });

    // Add the mouse interaction to the engine
    Composite.add(engine.world, mouseConstraint);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    // Clean up on component unmount
    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div ref={sceneRef} style={{ width: '100%', height: '100vh' }}>
      {}
    </div>
  );
};

export default Circles;