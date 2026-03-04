# Proyectoutn

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Documentación con Compodoc

Generar documentación estática:

`npm run docs`

Esto crea los archivos en la carpeta `documentation/`.

Generar y abrir servidor local de documentación:

`npm run docs:serve`

Por defecto, Compodoc publica en:

- `http://127.0.0.1:8080`

## Levantar y abrir ambas documentaciones (Swagger + Compodoc)

Desde la raíz del proyecto (`Proyecto Sistema de Gestión de Mantenimiento`), ejecuta en PowerShell:

```powershell
Start-Process powershell -ArgumentList '-NoExit','-Command','Push-Location "backEnd"; npm run dev'; Start-Process powershell -ArgumentList '-NoExit','-Command','Push-Location "frontEnd"; npm run docs:serve'; Start-Sleep -Seconds 8; Start-Process "http://localhost:3000/api-docs"; Start-Process "http://127.0.0.1:8080"
```

Para detenerlos: `Ctrl + C` en cada terminal abierta.
