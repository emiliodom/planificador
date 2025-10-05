# 📚 Plan de Clase - Gestión de Planes Educativos

Una aplicación moderna para gestionar planes de clase con React, Vite, Tailwind CSS, NocoDB y exportación a PDF.

## ✨ Características

- 📝 **CRUD completo** de planes de clase
- 🎨 **Animaciones fluidas** con Framer Motion
- 📄 **Exportación a PDF** individual y masiva
- 🌐 **API REST** con NocoDB
- 📱 **Diseño responsivo** con Tailwind CSS
- 🚀 **Desarrollo rápido** con Vite

## 🛠️ Tecnologías

- **Frontend**: React 18, Vite 5
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Base de datos**: NocoDB (API v3)
- **PDF**: html2canvas + jsPDF
- **Iconos**: Lucide React

## 🚀 Configuración Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd plan-clase-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo de ejemplo y configura tus valores:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus datos de NocoDB:
```env
VITE_NOCODB_API_BASE=https://app.nocodb.com/api/v3/data/TU_BASE_ID/TU_TABLE_ID
VITE_NOCODB_API_TOKEN=TU_TOKEN_AQUI
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 🔧 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_NOCODB_API_BASE` | URL completa de tu tabla en NocoDB | `https://app.nocodb.com/api/v3/data/abc123/def456` |
| `VITE_NOCODB_API_TOKEN` | Token de autenticación de NocoDB | `zlbClCcVqqRclQ4BnokVIs1Z6IVGFeBm0kRZ4ECv` |

### 📍 Cómo obtener los valores:

1. **API_BASE**: En NocoDB → Tu tabla → API Documentation → Copia la URL del endpoint
2. **API_TOKEN**: Account Settings → Tokens → Create new token → Copy

## 🌐 Despliegue en Vercel

### Paso 1: Conectar repositorio
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Selecciona tu proyecto

### Paso 2: Configurar variables de entorno
En el dashboard de Vercel:
1. Ve a **Settings** → **Environment Variables**
2. Agrega estas variables:

```
VITE_NOCODB_API_BASE = https://app.nocodb.com/api/v3/data/TU_BASE_ID/TU_TABLE_ID
VITE_NOCODB_API_TOKEN = TU_TOKEN_AQUI
```

### Paso 3: Deploy
Vercel desplegará automáticamente tu aplicación.

## 📊 Estructura del Proyecto

```
plan-clase-app/
├── src/
│   ├── LessonPlannerCRUD.jsx    # Componente principal
│   ├── App.jsx                  # App principal
│   ├── main.jsx                 # Punto de entrada
│   └── style.css                # Estilos globales
├── public/                      # Archivos estáticos
├── .env.example                 # Ejemplo de variables de entorno
├── .env.local                   # Variables de entorno (local)
└── vite.config.js              # Configuración de Vite
```

## 🎯 Funcionalidades

### Gestión de Planes
- ✅ Crear nuevos planes de clase
- ✅ Editar planes existentes
- ✅ Eliminar planes
- ✅ Visualización en tarjetas

### Exportación PDF
- 📄 Exportar plan individual
- 📄 Exportar todos los planes
- 🎨 Formato profesional
- 📑 Múltiples páginas automáticas

### Campos del Plan
- **Docente**: Nombre del profesor
- **Curso**: Nivel o grado
- **Tema**: Asunto de la clase
- **Fecha**: Fecha programada
- **Objetivos**: Metas de aprendizaje
- **Contenido**: Temas a desarrollar
- **Recursos**: Materiales necesarios

## 🔨 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de producción
npm run lint         # Linter ESLint
```

## 📝 NocoDB Setup

1. Crea una cuenta en [app.nocodb.com](https://app.nocodb.com)
2. Crea una nueva base de datos
3. Crea una tabla con estos campos:
   - `docente` (Text)
   - `curso` (Text)
   - `tema` (Text)
   - `fecha` (Date)
   - `objetivos` (LongText)
   - `contenido` (LongText)
   - `recursos` (LongText)
4. Obtén tu API token y URLs

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

🚀 **¡Hecho con ❤️ para educadores!**
