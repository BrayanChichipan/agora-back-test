# AGORA API
## Description
Este proyecto contiene la logica de recursos del blog, usuarios, y contactos de usuarios que son utilizados en la pagina de [agora](https://master--agora-app-test.netlify.app/)

## Tabla de Contenidos
- [AGORA API](#agora-api)
  - [Description](#description)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Tecnologias](#tecnologias)
  - [Configuración Inicial](#configuración-inicial)
    - [Instalación de Dependencias](#instalación-de-dependencias)
    - [Variables de Entorno](#variables-de-entorno)
    - [Ejecutando la applicacion](#ejecutando-la-applicacion)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Base de Datos](#base-de-datos)
    - [Colecciones](#colecciones)
    - [Configuracion](#configuracion)
    - [Patrón de uso](#patrón-de-uso)
  - [Practicas](#practicas)
    - [Validaciones](#validaciones)
    - [Autenticacion](#autenticacion)
      - [Mejora](#mejora)
    - [Cache](#cache)
      - [Mejora](#mejora-1)
    - [Logging](#logging)
      - [Niveles de Loggin](#niveles-de-loggin)
  - [API Desplegada](#api-desplegada)
    - [URL](#url)

## Tecnologias
  - NestJs (Node,Express)
  - MongoDB
  - JWT

## Configuración Inicial

### Instalación de Dependencias
Para instalar las dependencias del proyecto, ejecuta el siguiente comando:

```bash
yarn
```

### Variables de Entorno

Asegúrate de configurar las variables de entorno necesarias en un archivo .env.

```
PORT=8000
MONGO_URI=
WEB_CLIENT_DOMAIN=
WEB_CLIENT_URL=
JWT_SECRET=
CACHE_TTL=6000
```

### Ejecutando la applicacion
 ```
#development
$yarn run start

# watch mode
$ yarn run start:dev

# production
$yarn run start:prod

 ```

## Estructura del proyecto

```lua
src/
|-- config/
|   |-- envars
|   ...
|-- core/
|   |-- dtos/
|   |-- interceptors/
|   |...
|-- posts/
|   |-- dto/
|   |-- entities/
|   |-- types/ 
|   |-- controller 
|   |-- service
|   |-- module
|-- user-contact/...
|-- users/...
|   ...
|-- mainfiles...

```

## Base de Datos
El proyecto utiliza MongoDB como base de datos, alojada en MongoDB Atlas.

### Colecciones
 - Users
 - Posts
 - User Contact

### Configuracion
La conexión a la base de datos se establece en el module **DatabaseModule**: *src/database/database.module.ts.*

### Patrón de uso
Se siguió el patron repositorio para el uso de las colecciones de la base de datos, el repositorio base se encuentra en: *src/core/BaseRepository.ts*

## Practicas

### Validaciones
En cada ruta son validados tantos el cuerpo de la peticion, como los query params utilizando **DTOS** correspondientes.

### Autenticacion
Se creo un modulo de autenticacion que utiliza el servicio de usuarios (users), para la creacion de usuarios. En este modulo se utiliza la estrategia de tokens JWT, tanto para acceso como para recreacion de credenciales. 

#### Mejora
Si bien se utilizan tokes para autenticacion, es recomendable agregar autorizacion basada en roles para restringir accesos a recursos a los usuarios.

### Cache
El proyecto utiliza configuracion de cache en el modulo de posts para los metodos get, asi mismo se utiliza la invalidacion de cache cuando existen mutationes en los posts. 
EL tiempo de vida de cache es dado por la envar **CACHE_TTL** en milisegundos

#### Mejora
Si bien el cache local es funcional, se puede optar por utilizar un almacenamiento diferente como **redis**, 

### Logging
Se utiliza un sistema de logging para monitorear las operaciones y errores. Se utiliza el propio modulo de login de Nestjs.

#### Niveles de Loggin
- info
- warn
- error

## API Desplegada
La api fue desplegada utilzando los servicios de **render**

### URL
[agora back url](https://agora-back-test.onrender.com)

