@echo off
title Seven B Hotel - Ecran TV & Regie Digital Signage
echo ===================================================
echo     SEVEN B HOTEL - DIGITAL SIGNAGE (ECRAN TV)
echo ===================================================
echo.
echo [1/2] Demarrage du serveur Next.js sur le port 3001...
echo.
echo - Ecran TV (Affichage plein ecran) : http://localhost:3001
echo - Regie d'administration (PC)      : http://localhost:3001/admin
echo.
echo ===================================================
echo Appuyez sur Ctrl+C pour arreter le serveur.
echo ===================================================
echo.

npm run dev -- -p 3001
pause
