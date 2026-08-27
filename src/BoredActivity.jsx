import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Адрес API случайных занятий.
// Запрос идёт не напрямую, а через собственный прокси: bored-api.appbrewery.com
// не отдаёт заголовок Access-Control-Allow-Origin, поэтому браузер блокирует
// прямой кросс-доменный запрос (CORS). Путь /api/bored обслуживают:
// - Vite в режиме разработки (секция server.proxy в vite.config.js);
// - Nginx внутри контейнера (секция location /api/bored/ в nginx.conf).
const BORED_API_URL = '/api/bored/random';

// Перевод категорий занятия на русский
const TYPE_LABELS = {
  education: 'образование',
  recreational: 'отдых',
  social: 'общение',
  charity: 'благотворительность',
  cooking: 'готовка',
  relaxation: 'релаксация',
  busywork: 'рутина'
};

// Перевод продолжительности занятия
const DURATION_LABELS = {
  minutes: 'минуты',
  hours: 'часы',
  days: 'дни'
};

// Компонент предлагает случайное занятие и позволяет добавить его в список задач
const BoredActivity = ({ addTask }) => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Счётчик перезагрузок: его изменение перезапускает эффект
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await axios.get(BORED_API_URL);

        if (!response.data || !response.data.activity) {
          throw new Error('Нет данных о занятии.');
        }

        if (!cancelled) setActivity(response.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError('Не удалось загрузить занятие.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Запрашиваем следующее занятие
  const loadAnother = () => {
    setLoading(true);
    setError('');
    setReloadKey((key) => key + 1);
  };

  // Добавляем предложенное занятие в список задач
  const addToTasks = () => {
    if (activity) {
      addTask(activity.activity);
    }
  };

  return (
    <div className="bored">
      <h2 className="bored-title">Чем заняться? 🎲</h2>

      {loading && <p>Загрузка занятия...</p>}
      {!loading && error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && activity && (
        <>
          <p className="bored-activity">{activity.activity}</p>

          <p className="bored-meta">
            Категория: {TYPE_LABELS[activity.type] || activity.type}
            {' · '}
            Участников: {activity.participants}
            {' · '}
            Займёт: {DURATION_LABELS[activity.duration] || activity.duration}
            {' · '}
            {activity.price === 0 ? 'бесплатно' : 'потребует расходов'}
          </p>

          {activity.link && (
            <p className="bored-meta">
              <a className="bored-link" href={activity.link} target="_blank" rel="noreferrer">
                Подробнее
              </a>
            </p>
          )}
        </>
      )}

      <div className="bored-buttons">
        <button type="button" className="bored-button" onClick={loadAnother} disabled={loading}>
          {loading ? 'Загрузка...' : 'Другое занятие'}
        </button>
        <button
          type="button"
          className="bored-button"
          onClick={addToTasks}
          disabled={loading || !!error || !activity}
        >
          Добавить в список
        </button>
      </div>
    </div>
  );
};

export default BoredActivity;
