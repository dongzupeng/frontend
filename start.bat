@echo off

rem 检查并杀死占用端口5173的进程
echo Checking for process using port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    echo Found process using port 5173, PID: %%a
    taskkill /F /PID %%a
    echo Killed process %%a
)

echo Starting frontend service...
npm run dev
