@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0backup-to-github.ps1" %*
if errorlevel 1 (
  echo.
  echo Backup failed.
  pause
  exit /b 1
)
