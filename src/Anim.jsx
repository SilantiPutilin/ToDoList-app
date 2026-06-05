import React, { useRef, useEffect } from 'react';

const Anim = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let shapes = [];

    // Настройки области анимации
    const AREA_HEIGHT = 180; // фиксированная высота в пикселях (можно поменять)

    // Вспомогательные функции
    const random = (min, max) => Math.random() * (max - min) + min;

    // Класс геометрической фигуры
    class Shape {
      constructor(type, x, y, size, color, vx, vy, rotation = 0, rotationSpeed = 0) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
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
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'rect':
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            break;
          case 'triangle':
            ctx.beginPath();
            const height = this.size * Math.sqrt(3) / 2;
            ctx.moveTo(0, -height / 2);
            ctx.lineTo(-this.size / 2, height / 2);
            ctx.lineTo(this.size / 2, height / 2);
            ctx.closePath();
            ctx.fill();
            break;
          default:
            break;
        }
        ctx.restore();
      }

      update(canvasWidth, canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Отскок от левой и правой границ
        if (this.x < 0 || this.x > canvasWidth) {
          this.vx *= -1;
          this.x = Math.min(Math.max(this.x, 0), canvasWidth);
        }
        // Отскок от верхней и нижней границ (только в пределах выделенной зоны)
        if (this.y < 0 || this.y > canvasHeight) {
          this.vy *= -1;
          this.y = Math.min(Math.max(this.y, 0), canvasHeight);
        }
      }
    }

    // Создаёт случайную фигуру в пределах заданной области
    const createRandomShape = (canvasWidth, canvasHeight) => {
      const types = ['circle', 'rect', 'triangle'];
      const type = types[Math.floor(Math.random() * types.length)];
      const size = random(25, 55);
      const x = random(size, canvasWidth - size);
      const y = random(size, canvasHeight - size);
      const color = `hsl(${Math.random() * 360}, 70%, 65%)`;
      const vx = random(-1.5, 1.5);
      const vy = random(-1, 1);
      const rotationSpeed = random(-0.02, 0.02);
      return new Shape(type, x, y, size, color, vx, vy, 0, rotationSpeed);
    };

    // Инициализация фигур (20 штук)
    const initShapes = (count, width, height) => {
      const newShapes = [];
      for (let i = 0; i < count; i++) {
        newShapes.push(createRandomShape(width, height));
      }
      return newShapes;
    };

    // Настройка размеров canvas при изменении окна
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = AREA_HEIGHT;
      shapes = initShapes(25, canvas.width, canvas.height);
    };

    // Анимационный цикл
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
      height: '180px',      // соответствует AREA_HEIGHT
      pointerEvents: 'none', // чтобы клики проходили сквозь canvas
      zIndex: 1
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
