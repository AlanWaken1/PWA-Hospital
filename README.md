# Control de Inventario Hospitalario

Sistema de gestión de inventario desarrollado con Next.js, TypeScript y Tailwind CSS para el control eficiente de productos hospitalarios.

## 🚀 Características

- **Dashboard Interactivo**: Visualización de estadísticas en tiempo real del inventario
- **Gestión Completa de Productos**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Alertas Inteligentes**: Notificaciones automáticas para:
  - Productos con stock bajo
  - Productos próximos a vencer (30 días)
  - Productos vencidos
- **Búsqueda y Filtrado**: Búsqueda avanzada por nombre, categoría, proveedor y ubicación
- **Categorización**: Organización por categorías médicas:
  - Medicamentos
  - Equipos Médicos
  - Material Desechable
  - Material Quirúrgico
  - Insumos de Laboratorio
  - Dispositivos Médicos
  - Otros
- **Información Detallada**: Cada producto incluye:
  - Nombre y descripción
  - Cantidad actual y mínima
  - Precio unitario
  - Fecha de vencimiento
  - Proveedor
  - Ubicación (almacén/sala)
  - Código de barras
  - Fecha de ingreso

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **LocalStorage** - Persistencia de datos (puede migrarse a base de datos)

## 🎯 Uso

1. **Dashboard** (`/`): Vista general con estadísticas y productos que requieren atención
2. **Inventario** (`/inventario`): Lista completa de productos con búsqueda y filtros
3. **Agregar Producto** (`/agregar`): Formulario para agregar nuevos productos
4. **Editar Producto** (`/editar/[id]`): Modificar información de productos existentes

## 📊 Funcionalidades Principales

### Dashboard
- Estadísticas en tiempo real
- Lista de productos urgentes
- Productos recientemente agregados
- Valor total del inventario

### Gestión de Inventario
- Tarjetas visuales con códigos de color según estado
- Filtrado por categoría
- Ordenamiento por nombre, cantidad, vencimiento, categoría
- Búsqueda en tiempo real

### Formularios
- Validación de campos requeridos
- Interfaz intuitiva y responsive
- Manejo de fechas de vencimiento
- Control de stock mínimo


