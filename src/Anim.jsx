import React, { useRef, useEffect } from 'react';

const Anim = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let shapes = [];

    const AREA_HEIGHT = 180; // высота области анимации

    const random = (min, max) => Math.random() * (max - min) + min;

    class Shape {
      constructor(type, x, y, size, color, vx, vy, rotation = 0, rotationSpeed = 0) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.radius = size / 2; // половина размера (для круга, квадрата, треугольника примерно)
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.rotation = rotation;
        this.rotationSpeed = rotationSpeed;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(0,0,0,0.2)';

        switch (this.type) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'rect':
            ctx.fillRect(-this.radius, -this.radius, this.size, this.size);
            break;
          case 'triangle': {
            ctx.beginPath();
            const height = this.size * Math.sqrt(3) / 2;
            ctx.moveTo(0, -height / 2);
            ctx.lineTo(-this.radius, height / 2);
            ctx.lineTo(this.radius, height / 2);
            ctx.closePath();
            ctx.fill();
            break;
          }
          default:
            break;
        }
        ctx.restore();
      }

      update(canvasWidth, canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Отскок от левой и правой границ с учётом радиуса
        if (this.x - this.radius < 0) {
          this.x = this.radius;
          this.vx *= -1;
        } else if (this.x + this.radius > canvasWidth) {
          this.x = canvasWidth - this.radius;
          this.vx *= -1;
        }

        // Отскок от верхней и нижней границ с учётом радиуса
        if (this.y - this.radius < 0) {
          this.y = this.radius;
          this.vy *= -1;
        } else if (this.y + this.radius > canvasHeight) {
          this.y = canvasHeight - this.radius;
          this.vy *= -1;
        }
      }
    }

    const createRandomShape = (canvasWidth, canvasHeight) => {
      const types = ['circle', 'rect', 'triangle'];
      const type = types[Math.floor(Math.random() * types.length)];
      const size = random(25, 55);
      const radius = size / 2;
      // гарантируем, что центр фигуры находится на расстоянии не меньше радиуса от краёв
      const x = random(radius, canvasWidth - radius);
      const y = random(radius, canvasHeight - radius);
      const color = `hsl(${Math.random() * 360}, 70%, 65%)`;
      const vx = random(-1.5, 1.5);
      const vy = random(-1, 1);
      const rotationSpeed = random(-0.02, 0.02);
      return new Shape(type, x, y, size, color, vx, vy, 0, rotationSpeed);
    };

    const initShapes = (count, width, height) => {
      const newShapes = [];
      for (let i = 0; i < count; i++) {
        newShapes.push(createRandomShape(width, height));
      }
      return newShapes;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = AREA_HEIGHT;
      shapes = initShapes(25, canvas.width, canvas.height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(shape => {
        shape.update(canvas.width, canvas.height);
        shape.draw(ctx);
      });
      animationId = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '180px',
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden' // чтобы ничего не вылезало за пределы блока
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};

export default Anim;
