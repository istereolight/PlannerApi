# Используем образ линукс Alpine с версией node 14
FROM node:19.5.0-alpine

#  Указываем рабочую директорию
WORKDIR /app

# Скопировать packege.json и package-lock.json внутрь контейнера
COPY package*.json ./

#Устанавливаем зависимости
RUN npm install

# Копируем всё остальное приложение
COPY . .

#Открываем порт в нашем контейнере
EXPOSE 3000

#Запускаем наш сервер
CMD ["npm", "start"]