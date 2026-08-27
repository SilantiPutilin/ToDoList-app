### Дополнительное API: Bored API

Для получения случайных идей для досуга используется Bored API (зеркало от App Brewery).  
Эндпоинт: `https://bored-api.appbrewery.com/api/activity`  
Метод: GET  
Ответ в формате JSON. API не требует аутентификации и имеет ограничение 100 запросов в 15 минут[reference:3].

Поля ответа:
- `activity` – описание занятия (строка, на английском)
- `type` – категория (education, social, relaxation, diy, charity, cooking, relaxation, music, busywork)[reference:4]
- `participants` – количество участников (число)
- `price` – стоимость (0 – бесплатно, 1 – дорого)
- `accessibility` – доступность (0 – очень доступно, 1 – очень недоступно)

Пример ответа:
```json
{
  "activity": "Learn a new programming language",
  "type": "education",
  "participants": 1,
  "price": 0.0,
  "accessibility": 0.1
}