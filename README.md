# Ecosistema de Proyectos

Plataforma web para exponer proyectos y colaborar mediante tokens, con sistema de reputación, panel de control, mensajería y notificaciones.

Stack: React 19 + Vite + TypeScript + Tailwind CSS + Firebase (Auth y Firestore).

## Correr en local

**Requisitos:** Node.js 18 o superior.

1. Instalar dependencias:
   ```
   npm install
   ```
2. (Opcional) Copiar `.env.example` a `.env.local` y completar las variables `VITE_FIREBASE_*` con los datos de tu proyecto de Firebase. Si no lo haces, la app usa por defecto los valores de `firebase-applet-config.json`.
3. Levantar el servidor de desarrollo:
   ```
   npm run dev
   ```

## Despliegue (Vercel + GitHub + Firebase)

1. **GitHub**: subir este repositorio a GitHub.
2. **Firebase**:
   - Crear/usar un proyecto en [Firebase Console](https://console.firebase.google.com/).
   - Habilitar **Authentication** (proveedores Google y Email/Contraseña) y **Firestore Database**.
   - En **Configuración del proyecto > Tus apps**, registrar una app web y copiar los datos del SDK.
   - Agregar el dominio de Vercel (ej. `tu-proyecto.vercel.app`) en **Authentication > Settings > Authorized domains**, para que el login funcione en producción.
   - Desplegar `firestore.rules` con la Firebase CLI (`firebase deploy --only firestore:rules`) o pegarlas manualmente en la consola.
3. **Vercel**:
   - Importar el repositorio desde GitHub en [vercel.com](https://vercel.com/).
   - Vercel detecta automáticamente la configuración vía `vercel.json` (framework Vite, build con `npm run build`, salida en `dist`).
   - En **Project Settings > Environment Variables**, agregar las variables `VITE_FIREBASE_*` (ver `.env.example`) con los datos de tu proyecto de Firebase.
   - Desplegar.

## Variables de entorno

Ver `.env.example`. Todas son opcionales: si no se definen, se usan los valores de `firebase-applet-config.json` incluidos en el repo.
