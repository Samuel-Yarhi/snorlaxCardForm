# Desafío de Ingeniería Frontend

Este desafío evalúa tu conocimiento en desarrollo frontend moderno usando:
- Next.js
- React Hook Form
- Zod
- Tailwind CSS
- TypeScript

## El Desafío

Crea un formulario de solicitud de empleo de múltiples pasos con las siguientes características:

### Características Requeridas

1. **Implementación de Formulario Multi-paso**
   - Crea 3 pasos distintos: Información Personal, Experiencia y Revisión
   - Implementa un indicador de progreso
   - Permite navegación entre pasos
   - Agrega validación apropiada entre pasos

2. **Campos del Formulario**
   - **Paso de Información Personal:**
     - Nombre Completo (requerido)
     - Email (requerido, email válido)
     - Teléfono (requerido, formato válido)
     - Ubicación (requerido)
     - URL del Portafolio (opcional, URL válida)

   - **Paso de Experiencia:**
     - Rol Actual (requerido)
     - Años de Experiencia (requerido, número)
     - Habilidades (requerido, mínimo 3)
     - Empresa (requerido)
     - Descripción de Logros (requerido, mínimo 100 caracteres)

3. **Validación del Formulario**
   - Implementa esquemas Zod para validación
   - Muestra mensajes de error apropiados
   - Evita avanzar al siguiente paso si el actual es inválido

4. **Paso de Revisión**
   - Muestra toda la información ingresada
   - Permite editar pasos anteriores
   - Muestra confirmación antes del envío

5. **Estilizado**
   - Usa Tailwind CSS para el diseño
   - Hazlo visualmente atractivo
   - Asegura un diseño responsivo

### Características Adicionales (Bonus)

- Persistencia del formulario usando localStorage
- Estados de carga durante el envío
- Animaciones de transición entre pasos
- Implementación de límites de error
- Características de accesibilidad
- Pruebas unitarias

## Requisitos Técnicos

1. **Gestión de Estado**
   - Usa React Hook Form para el estado del formulario
   - Implementa tipos apropiados en TypeScript
   - Maneja la validación con Zod

2. **Calidad del Código**
   - Código limpio y bien organizado
   - Estructura apropiada de componentes
   - Seguridad de tipos
   - Manejo de errores
   - Comentarios donde sea necesario

3. **UI/UX**
   - Diseño profesional
   - Diseño responsivo
   - Estados de carga
   - Estados de error
   - Retroalimentación de éxito

## Comenzando

1. Revisa la estructura existente del proyecto
2. Planifica tu jerarquía de componentes
3. Implementa los pasos del formulario
4. Agrega validación
5. Estiliza tus componentes
6. Prueba exhaustivamente

## Criterios de Evaluación

- Organización y claridad del código
- Uso de TypeScript
- Implementación de validación de formularios
- Diseño UI/UX
- Manejo de errores
- Implementación de características adicionales

¡Buena suerte!