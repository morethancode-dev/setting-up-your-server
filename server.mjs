
// Подключаем встроенный модуль http - он есть в Node.js по умолчанию
import http from 'node:http';
// Подключаем встроенный модуль fs для чтения файлов
import fs from 'node:fs';
// Подключаем встроенный модуль path для работы с путями
import path from 'node:path';
// Подключаем модуль url для получения __dirname в ES-модулях
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// В ES-модулях нет __dirname, поэтому создаем его вручную
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Задаем порт
const PORT = 3_000;

// Создаем сервер
const server = http.createServer((req, res) => {
    // Если запрос на главную страницу
    if (req.url === '/') {
        // Читаем HTML-файл
        const filePath = path.join(__dirname, 'index.html');

        fs.readFile(filePath, (err, data) => {
            if (err) {
                // Если файл не найден - отправляем ошибку 404
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Файл не найден');
                return;
            }

            // Отправляем HTML-файл пользователю
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    } else {
        // Для всех остальных путей - 404
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Страница не найдена');
    }
});

// Запускаем сервер
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
