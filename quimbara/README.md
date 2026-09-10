# Químbara — demo privada

Prototipo estático de carta, accesos demostrativos a PedidosYa y Uber Eats, asistente de preguntas frecuentes y backoffice interactivo. No recibe pedidos ni envía mensajes reales.

## Ejecutar

Servir la raíz del repositorio con un servidor HTTP estático. No requiere compilación ni dependencias. Abrir `index.html` para la web y `backoffice.html` para el panel. Usar el mismo origen y pestaña para compartir los cambios de carta.

## Información

- Nombre y cuenta suministrados por el usuario: Quimbara, @quimbara_cu.
- Dirección pública indexada del perfil: Manuel Montt 1041, local 43, Providencia. Revisada el 5 de septiembre de 2026. https://www.instagram.com/quimbara_cu/
- Ubicación corroborada con ficha de Uber Eats: https://www.ubereats.com/cl-en/store/quimbara-cafeteria/yiKAHjV8VaWdnLNveoT8oQ . La ficha señala que no opera allí desde julio de 2026; no implica cierre del local.
- Platos, precios, descripciones y disponibilidad son ejemplos no verificados. Imagen generada con IA, no corresponde a comida real del local.
- Dirección visual propuesta (verde profundo, amarillo y tipografía editorial); no se afirma que sea identidad oficial.

## Backoffice demostrativo

- Resumen calculado desde pedidos ficticios, con importes brutos y productos más pedidos.
- Filtros por canal, estado, número y cliente; avance y cancelación de pedidos.
- Edición de precios y disponibilidad compartida con la carta web.
- Consultas ficticias, respuestas simuladas y cierre o reapertura de conversaciones.
- Estado informativo de canales: no hay conexiones con proveedores.

`demo-data.js` comparte los precios y la disponibilidad mediante `sessionStorage`, solo en la misma pestaña y origen. El panel guarda también los estados de pedidos y consultas durante esa sesión. Los pedidos conservan su precio original. Se puede restaurar todo desde «Reiniciar datos de ejemplo», disponible en el menú lateral y en Canales.

La bandeja contiene ejemplos y no recibe las preguntas del asistente web ni envía mensajes. No hay autenticación propia, backend ni integración con delivery. El sitio es estático y puede alojarse en un servicio de hosting. Proteger el acceso antes de añadir datos reales.

## Antes de un uso real

Confirmar carta, precios, ingredientes, fotografías autorizadas, dirección, horarios y enlaces del restaurante en las plataformas. Incorporar acceso protegido y almacenamiento compartido; validar las integraciones con cada proveedor. Definir quién recibe y responde consultas. No introducir datos reales en este prototipo.
