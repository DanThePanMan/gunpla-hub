# Gunpla Hub Development Server Startup Script
# This script starts both the frontend (Vite) and backend (Express) servers

Write-Host "Starting Gunpla Hub Development Servers..." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Start the backend server in a new PowerShell window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

# Wait a moment for the backend to start
Start-Sleep -Seconds 2

# Start the frontend server in a new PowerShell window  
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "Both servers are starting up!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:3000 (or your configured port)" -ForegroundColor Cyan
Write-Host "Press any key to exit this script (servers will continue running)..." -ForegroundColor Gray

# Wait for user input before closing this script window
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
