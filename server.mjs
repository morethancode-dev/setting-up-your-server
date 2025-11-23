
// Подключаем встроенный модуль http - он есть в Node.js по умолчанию
import http from 'node:http';
// Подключаем встроенный модуль fs для чтения файлов
import fs from 'node:fs';
// Подключаем встроенный модуль path для работы с путями
import path from 'node:path';
// Подключаем модуль url для получения __dirname в ES-модулях
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
// Подключаем модуль os для получения информации о сетевых интерфейсах
import os from 'node:os';

// В ES-модулях нет __dirname, поэтому создаем его вручную
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Задаем порт
const PORT = 3_000;

// Внешний IP вашего сервера
const EXTERNAL_IP = '62.60.177.71';

// Функция для получения локальных IP-адресов
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Пропускаем внутренние (loopback) и не-IPv4 адреса
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }

    return addresses;
}

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
    const localIPs = getLocalIPs();

    console.log('\n🚀 Сервер успешно запущен!\n');
    console.log('📍 Доступен по следующим адресам:\n');

    // Локальный доступ
    console.log('   Локально:');
    console.log(`   ➜ http://localhost:${PORT}`);
    console.log(`   ➜ http://127.0.0.1:${PORT}\n`);

    // Локальная сеть
    if (localIPs.length > 0) {
        console.log('   Локальная сеть:');
        localIPs.forEach(ip => {
            console.log(`   ➜ http://${ip}:${PORT}`);
        });
        console.log('');
    }

    // Внешний доступ
    console.log('   Интернет (внешний IP):');
    console.log(`   ➜ http://${EXTERNAL_IP}:${PORT}\n`);

    console.log('💡 Как проверить доступность из интернета:\n');
    console.log(`   1. Откройте в браузере: http://${EXTERNAL_IP}:${PORT}`);
    console.log(`   2. Или выполните команду: curl http://${EXTERNAL_IP}:${PORT}\n`);
    console.log('⚠️  Убедитесь, что порт', PORT, 'открыт в файрволе!\n');
});
