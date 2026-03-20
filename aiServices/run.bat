@echo off
echo Activando venv...
call venv\Scripts\activate.bat
echo Iniciando uvicorn server estable...
uvicorn server:app --host 0.0.0.0 --port 8001
pause

