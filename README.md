# Yo Compro

**Yo Compro** es una plataforma que conecta compradores y vendedores de autos de manera rápida y eficiente.  
Los compradores publican lo que están buscando y reciben notificaciones por correo cuando se publica un vehículo que coincide.  
Los vendedores publican sus autos gratis.

Construido con [Next.js](https://nextjs.org), Firebase y Nodemailer como MVP.

---

## 🚀 Funcionalidades del MVP

- 📩 Notificaciones automáticas por email cuando hay coincidencia
- 🔎 Formulario de búsqueda para compradores
- 🚗 Publicación de autos con foto por parte de los vendedores
- 🔥 Desplegado con Vercel y Firestore como base de datos

---

## 🧑‍💻 Cómo iniciar el proyecto localmente

```bash
npm install
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000)

---

## 🔐 Variables de entorno necesarias

Crea un archivo `.env.local` con las siguientes variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

EMAIL_USER=tuemail@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicación
```

---

## 📦 Deploy

Este proyecto está pensado para desplegarse fácilmente en [Vercel](https://vercel.com).  
Solo conecta el repositorio y configura las variables de entorno.

---

## 📄 Licencia

MVP creado por [@DaliGabriel](https://github.com/DaliGabriel) — libre de usar como base de aprendizaje o inspiración.
