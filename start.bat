@echo off
echo 🚀 Iniciando ACAPRA Platform...
echo.

echo 📡 Iniciando servidor backend...
start "Backend" cmd /k "node server.js"

echo ⏳ Aguardando backend inicializar...
timeout /t 3 /nobreak >nul

echo 🌐 Iniciando frontend React...
cd client
start "Frontend" cmd /k "npm start"
cd ..

echo.
echo ✅ Servidores iniciados!
echo 📧 Admin: admin@acapra.org
echo 🔑 Senha: admin123
echo 🌐 Site: http://localhost:3000
echo.
pause
