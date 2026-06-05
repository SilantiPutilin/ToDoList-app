import React, { useRef, useEffect } from 'react';

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let shapes = [];

    // Вспомогательная функция для случайного числа
    const random = (min, max) => Math.random() * (max - min) + min;

    // Класс геометрической фигуры
    class Shape {
      constructor(type, x, y, size, color, vx, vy, rotation = 0, rotationSpeed = 0) {
        this.type = type; // 'circle', 'rect', 'triangle'
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
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';

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

        // Отскок от границ
        if (this.x < 0 || this.x > canvasWidth) {
          this.vx *= -1;
          this.x = Math.min(Math.max(this.x, 0), canvasWidth);
        }
        if (this.y < 0 || this.y > canvasHeight) {
          this.vy *= -1;
          this.y = Math.min(Math.max(this.y, 0), canvasHeight);
        }
      }
    }

    // Создаёт случайную фигуру
    const createRandomShape = (canvasWidth, canvasHeight) => {
      const types = ['circle', 'rect', 'triangle'];
      const type = types[Math.floor(Math.random() * types.length)];
      const size = random(30, 70);
      const x = random(size, canvasWidth - size);
      const y = random(size, canvasHeight - size);
      const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
      const vx = random(-2, 2);
      const vy = random(-2, 2);
      const rotationSpeed = random(-0.03, 0.03);
      return new Shape(type, x, y, size, color, vx, vy, 0, rotationSpeed);
    };

    // Инициализация массива фигур
    const initShapes = (count, width, height) => {
      const newShapes = [];
      for (let i = 0; i < count; i++) {
        newShapes.push(createRandomShape(width, height));
      }
      return newShapes;
    };

    // Адаптация canvas под размер окна
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      shapes = initShapes(35, canvas.width, canvas.height);
    };

    // Анимационный цикл
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Необязательный эффект "следа" (раскомментируйте, если нужен)
      // ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      shapes.forEach(shape => {
        shape.update(canvas.width, canvas.height);
        shape.draw(ctx);
      });
      
      animationId = requestAnimationFrame(animate);
    };

    // Запуск
    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: 8, fontFamily: 'sans-serif', zIndex: 10 }}>
        🎨 Случайные геометрические анимации
      </div>
    </div> 
  );
};

export default App;
