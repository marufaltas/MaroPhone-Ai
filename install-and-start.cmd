@echo off
cd /d %~dp0
cd backend
npm install
cd ..
cd frontend
npm install
cd ..
start cmd /k "cd backend && npm start"
start cmd /k "cd frontend && npm start"
echo تم تثبيت الحزم وتشغيل الفرونت اند والباك اند
pause
