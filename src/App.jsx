import React, { useState, useEffect } from 'react';
import './App.css';
import ToDoForm from "./AddTask";
import ToDo from "./Task";
import axios from 'axios';

const weatherApiKey = 'c7616da4b68205c2f3ae73df2c31d177';

function App() {
  const [rates, setRates] = useState({});
  const [weatherData, setWeatherData] = useState(null);
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

        navigator.geolocation.getCurrentPosition(async position => {
          const { latitude: lat, longitude: lon } = position.coords;
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
          );
          setWeatherData(weatherResponse.data);
        });
      } catch (err) {
        setError('Ошибка загрузки данных.');
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const addTask = (userInput) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      task: userInput,
      complete: false
    };
    setTodos([...todos, newItem]);
  };

  const removeTask = (id) => {
    setTodos([...todos.filter((todo) => todo.id !== id)]);
  };

  const handleToggle = (id) => {
    setTodos([...todos.map((task) =>
      task.id === id ? { ...task, complete: !task.complete } : { ...task }
    )]);
  };

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
          {weatherData && (
            <div className="weather-info">
              <p>Погода сегодня: {weatherData.main.temp.toFixed(1)}°C</p>
              <img src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="weather"/>
            </div>
          )}
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