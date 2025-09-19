@echo off
echo 🤖 Actualizando repositorio en GitHub...
echo.

echo 📝 Agregando archivos modificados...
git add .

echo 💾 Haciendo commit con timestamp...
git commit -m "🔄 Actualización automática - %date% %time%"

echo 🚀 Subiendo a GitHub...
git push origin main

echo.
echo ✅ ¡Actualización completada!
echo 🌐 Ve a: https://github.com/NezzCOLD/mi-agente-inteligente
echo.
pause
