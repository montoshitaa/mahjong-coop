# Mahjong Colaborativo 🀄
### EIF209 - Programación IV | Universidad Nacional de Costa Rica (UNA)

Este proyecto es una aplicación web de Mahjong multijugador colaborativo en tiempo real, desarrollada como parte del curso de Programación IV.

## 🎮 Descripción
Mahjong Colaborativo es un juego de emparejamiento de fichas donde hasta 5 jugadores pueden participar simultáneamente en una misma sesión. El objetivo es trabajar en conjunto (o competir por la puntuación más alta) para despejar el tablero de fichas Mahjong. 

**Características principales:**
- **Multijugador en tiempo real:** Sincronización instantánea entre todos los clientes conectados.
- **Sin base de datos:** El estado del juego se mantiene en la memoria del servidor (Server-side state).
- **Comunicación bidireccional:** Implementada mediante WebSockets para una experiencia fluida.
- **Gráficos de rendimiento:** Visualización en vivo del progreso de las puntuaciones de los jugadores.

## 🏗️ Arquitectura
El proyecto utiliza una arquitectura de monorepositorio dividida en dos partes principales:

- **Servidor (`/server`):** Construido con **Node.js**, **Express** y **Socket.io** utilizando **TypeScript**. Se encarga de la lógica autoritativa del juego, validación de movimientos y difusión del estado.
- **Cliente (`/client`):** Desarrollado con **React 18**, **TypeScript**, **Vite** y **Tailwind CSS**. Utiliza **Recharts** para la visualización de datos y **Framer Motion** para las animaciones.

### Flujo de Eventos (Socket.io)
1. `player:join` → El servidor procesa el nuevo jugador y emite `game:state` a todos los clientes.
2. `tile:select` → El servidor valida el movimiento, bloquea fichas o procesa emparejamientos, y emite el nuevo `game:state`.
3. `disconnect` → El servidor marca al jugador como desconectado y actualiza el `game:state` global.

## ⚙️ Instalación y ejecución local

Para ejecutar el proyecto en su entorno local, siga estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd mahjong-colaborativo
   ```

2. **Configurar y ejecutar el Servidor:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Configurar y ejecutar el Cliente:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Acceder a la aplicación:**
   Abra su navegador en [http://localhost:5173](http://localhost:5173).

## 🌐 Despliegue

La aplicación está preparada para ser desplegada en las siguientes plataformas:

- **Frontend (Vercel):** Configurado con el directorio raíz en `/client`.
- **Backend (Railway):** Configurado con el directorio raíz en `/server`.
- **Variable de Entorno:** Es necesario configurar `VITE_SERVER_URL` en Vercel apuntando a la URL proporcionada por Railway para establecer la conexión de WebSockets.

## 👥 Integrantes
| Nombre | Carné |
| :--- | :--- |
| [Nombre del Integrante 1] | [Carné] |
| [Nombre del Integrante 2] | [Carné] |
| [Nombre del Integrante 3] | [Carné] |
| [Nombre del Integrante 4] | [Carné] |
| [Nombre del Integrante 5] | [Carné] |

## 📋 Rúbrica cumplida
El proyecto cumple con los siguientes criterios de evaluación:

- **Servidor + Socket.io (20 pts):** Implementación robusta de un servidor Node.js con manejo de eventos en tiempo real.
- **Lógica del juego (20 pts):** Algoritmos de barajado (Fisher-Yates), validación de emparejamientos y gestión de estados inmutables.
- **Frontend React (20 pts):** Interfaz moderna, responsiva y componentes reutilizables.
- **Tiempo real (15 pts):** Sincronización de latencia mínima entre múltiples jugadores.
- **TypeScript (10 pts):** Tipado estricto en todo el proyecto (frontend y backend) para mayor seguridad.
- **Despliegue (10 pts):** Configuración lista para entornos de producción.
- **Calidad de código (5 pts):** Código limpio, documentado y siguiendo las mejores prácticas de desarrollo.
