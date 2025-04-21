@echo off

:: Config
set IMAGE_NAME=node_dev_image_fe
set CONTAINER_NAME=shop_fe
set LOCAL_DIR=..
set VOLUME_DIR=volume_node_modules
set PORT=5173

if not exist "%LOCAL_DIR%" (
    echo Errore: La directory del progetto "%LOCAL_DIR%" non esiste.
    pause
    exit /b
)

if not exist "%VOLUME_DIR%" (
    echo Creazione della directory per il volume persistente...
    mkdir "%VOLUME_DIR%"
)

echo Costruzione dell'immagine Docker...
docker build -t %IMAGE_NAME% .
if errorlevel 1 (
    echo Errore durante la costruzione dell'immagine Docker.
    pause
    exit /b
)

echo Avvio del container Docker...
docker run --rm -it ^
  --name %CONTAINER_NAME% ^
  -p %PORT%:5173 ^
  -v "%cd%\%LOCAL_DIR%:/workspace" ^
  -v "%cd%\%VOLUME_DIR%:/workspace/node_modules" ^
  %IMAGE_NAME% bash -c "npm install -g npm@latest vite@latest vue@latest && cd /workspace && npm install && npm install vite@latest --save-dev && npm run dev"
if errorlevel 1 (
    echo Errore durante l'avvio del container Docker.
    pause
    exit /b
)

pause
