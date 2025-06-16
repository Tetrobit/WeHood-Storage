import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Настройка CORS
app.use(cors());

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${fileId}${ext}`);
  }
});

// Фильтр файлов
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', 'audio/wave'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

// Эндпоинт для загрузки файла
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не был загружен' });
  }
  
  const fileId = path.parse(req.file.filename).name;
  res.json({ 
    fileId,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// Эндпоинт для получения файла по UUID
app.get('/files/:fileId', (req, res) => {
  const { fileId } = req.params;
  const uploadDir = 'uploads';
  
  // Поиск файла по UUID (без расширения)
  const files = fs.readdirSync(uploadDir);
  const file = files.find(f => f.startsWith(fileId));
  
  if (!file) {
    return res.status(404).json({ error: 'Файл не найден' });
  }
  
  const filePath = path.join(uploadDir, file);
  res.sendFile(path.resolve(filePath));
});

// Эндпоинт для проверки существования файла
app.get('/files/:fileId/exists', (req, res) => {
  const { fileId } = req.params;
  const uploadDir = 'uploads';
  
  const files = fs.readdirSync(uploadDir);
  const exists = files.some(f => f.startsWith(fileId));
  
  res.json({ exists });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
}); 