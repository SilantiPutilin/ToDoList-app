// RandomAnimal.jsx
import React, { useState, useEffect } from 'react';

const RandomAnimal = ({ type = 'dog' }) => { // type может быть 'dog' или 'cat'
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Счётчик перезагрузок: его изменение перезапускает эффект
  const [reloadKey, setReloadKey] = useState(0);

  // Загружаем картинку при монтировании, смене типа и по кнопке
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        let url = '';
        if (type === 'dog') {
          url = 'https://dog.ceo/api/breeds/image/random';
        } else if (type === 'cat') {
          url = 'https://api.thecatapi.com/v1/images/search';
        } else {
          throw new Error('Неверный тип животного');
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();

        if (cancelled) return;
        setImageUrl(type === 'dog' ? data.message : data[0].url);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError('Не удалось загрузить картинку :(');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [type, reloadKey]);

  // Обработчик кнопки: сбрасываем состояние и перезапускаем эффект
  const fetchAnimal = () => {
    setLoading(true);
    setError('');
    setReloadKey((key) => key + 1);
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0', padding: '15px', background: '#f9f9f9', borderRadius: '16px' }}>
      <h3>Случайный {type === 'dog' ? 'пёсик' : 'котик'} 🐾</h3>
      <div style={{ minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loading && <p>Загружаем...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && imageUrl && (
          <img
            src={imageUrl}
            alt={type === 'dog' ? 'Собака' : 'Кошка'}
            style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        )}
      </div>
      <button
        onClick={fetchAnimal}
        disabled={loading}
        style={{
          marginTop: '12px',
          padding: '8px 20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Загрузка...' : `Показать другую ${type === 'dog' ? 'собаку' : 'кошку'}`}
      </button>
    </div>
  );
};

export default RandomAnimal;
