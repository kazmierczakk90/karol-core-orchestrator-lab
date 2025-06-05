
@echo off
set MODE=%1

if "%MODE%"=="" (
    echo Uzycie: launcher.bat [tryb]
    echo Dostepne tryby: standard, narrative, reflective, debug, mentor, fighter, sync, audit
    exit /b
)

echo ===========================================
echo   KAROL-CORE - URUCHAMIANIE TRYBU: %MODE%
echo ===========================================

if "%MODE%"=="audit" (
    karol audit now
    exit /b
)

start karol-core.exe --mode=%MODE%
