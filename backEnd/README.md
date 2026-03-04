# BackEnd - Sistema de Gestión de Mantenimiento

## Requisitos

- Node.js 18+

## Instalación

```bash
npm install
```

## Ejecutar servidor

```bash
npm run dev
```

## Levantar y abrir ambas documentaciones (Swagger + Compodoc)

Desde la raíz del proyecto (`Proyecto Sistema de Gestión de Mantenimiento`), ejecuta en PowerShell:

```powershell
Start-Process powershell -ArgumentList '-NoExit','-Command','Push-Location "backEnd"; npm run dev'; Start-Process powershell -ArgumentList '-NoExit','-Command','Push-Location "frontEnd"; npm run docs:serve'; Start-Sleep -Seconds 8; Start-Process "http://localhost:3000/api-docs"; Start-Process "http://127.0.0.1:8080"
```

Para detenerlos: `Ctrl + C` en cada terminal abierta.
