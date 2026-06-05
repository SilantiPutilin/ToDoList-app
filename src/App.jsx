// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import ToDoForm from "./AddTask";
import ToDo from "./Task";
import axios from 'axios';
import Weather from './Weather'; 

const weatherApiKey = 'c7616da4b68205c2f3ae73df2c31d177'; // Этот ключ больше не нужен, его можно удалить

function App() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const currencyResponse = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
        const USDrate = currencyResponse.data.Valute.USD.Value.toFixed(4).replace('.', ',');
        const EURrate = currencyResponse.data.Valute.EUR.Value.toFixed(4).replace('.', ',');
        setRates({ USDrate, EURrate });
        // Логика получения погоды отсюда удалена
      } catch (err) {
        setError('Ошибка загрузки данных.');
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  // ... все функции addTask, removeTask, handleToggle остаются без изменений ...

  return (
    <div className="App">
      {loading && <p>Загрузка...</p>}
      {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <div className='info'>
          <div className='money'>
            <div>Доллар США $ — {rates.USDrate} руб.</div>
            <div>Евро € — {rates.EURrate} руб.</div>
          </div>
          {/* 2. Вместо старой логики погоды используем новый компонент */}
          <Weather />
        </div>
      )}
      <header>
        <h1 className='list-header'>Список задач: {todos.length}</h1>
      </header>
      <ToDoForm addTask={addTask} />
      {todos.map((todo) => (
        <ToDo key={todo.id} todo={todo} toggleTask={handleToggle} removeTask={removeTask} />
      ))}
    </div>
  );
}

export default App;
