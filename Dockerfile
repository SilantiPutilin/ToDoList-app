# Стадия сборки
# Для создания приложения используется Node.js 22
FROM node:22-alpine AS build

# Задаётся рабочая директория в контейнере
WORKDIR /app

# Копируются package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей строго по package-lock.json
RUN npm ci

# Копирование всех файлов из локального каталога в контейнер
COPY . .

# Команда для создания рабочей версии приложения.
# base переопределяем на "/", так как в контейнере nginx отдаёт приложение
# из корня, а не из подкаталога /ToDoList-app/ как на GitHub Pages.
RUN npm run build -- --base=/

# Стадия развёртывания
# Использует Nginx для обслуживания статических файлов
FROM nginx:stable-alpine AS production

# Копирует результат сборки с предыдущего этапа.
# Vite собирает проект в каталог dist (а не build, как в create-react-app)
COPY --from=build /app/dist /usr/share/nginx/html

# Конфигурация Nginx для одностраничного приложения
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открывает порт 80
EXPOSE 80

# Запуск Nginx на переднем плане
CMD ["nginx", "-g", "daemon off;"]
