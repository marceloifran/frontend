# 🎨 Vision Chat Frontend

Un cliente de Next.js de alta gama que presenta un diseño inspirado en "Glassmorphism" y orquestación de IA en tiempo real. Esta aplicación se enfoca en ofrecer una experiencia de usuario fluida, animada y altamente responsiva.

## ✨ Aspectos Destacados de UI/UX

- **Diseño Glassmorphism**: CSS personalizado utilizando `backdrop-filter` y capas semitransparentes para una apariencia moderna y con profundidad.
- **Animaciones Fluidas**: Integrado con `Framer Motion` para transiciones de página y micro-interacciones suaves.
- **Diseño Responsivo**: Optimizado para funcionar perfectamente en dispositivos móviles, tablets y escritorios.
- **Sincronización en Tiempo Real**: Integración directa con Firestore para streaming de mensajes con actualizaciones de latencia cero.

## 🧠 Gestión de Estado

Utilizamos **Zustand** para la gestión del estado global, dividido en stores especializados:
- **`useAuthStore`**: Administra la sesión del usuario autenticado en Firebase.
- **`useChatStore`**: Maneja las suscripciones a mensajes, actualizaciones optimistas de la interfaz y la comunicación con el backend de IA.

## 🛠️ Stack Tecnológico

- **Next.js 15+** (App Router)
- **Firebase SDK** (Autenticación y Firestore)
- **Zustand** (Estado Global)
- **Lucide React** (Iconos)
- **Framer Motion** (Animaciones)

## 🏁 Desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar Entorno
# Copia .env.example a .env.local y completa tu configuración web de Firebase.
# Asegúrate de que NEXT_PUBLIC_API_URL apunte a tu servidor NestJS en ejecución.

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---
*Frontend meticulosamente diseñado para un alto rendimiento y excelencia visual.*
