# WeHood Storage Service

Сервис для хранения и управления файлами (изображения и видео).

## Требования

- Node.js 18+
- Docker и Docker Compose

## Установка и запуск

### Локальная разработка

1. Установите зависимости:
```bash
npm install
```

2. Запустите сервер в режиме разработки:
```bash
npm run dev
```

### Запуск через Docker

1. Соберите и запустите контейнер:
```bash
docker-compose up -d
```

## API Endpoints

### Загрузка файла
```
POST /upload
Content-Type: multipart/form-data
Body: file=<файл>
```

### Получение файла
```
GET /files/:fileId
```

### Проверка существования файла
```
GET /files/:fileId/exists
```

## Поддерживаемые типы файлов

- Изображения: JPEG, PNG, GIF
- Видео: MP4, QuickTime

Максимальный размер файла: 100MB 