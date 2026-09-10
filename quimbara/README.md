# Químbara — demo de menú digital

Prototipo móvil para presentar una posible experiencia de pedidos para Químbara, restaurante de comida cubana en Providencia, Chile.

## Funcionalidades

- Carta filtrable por categorías.
- Selección orientativa con cantidades y total en pesos chilenos.
- Accesos demostrativos a PedidosYa y Uber Eats.
- Asistente guiado para preguntas frecuentes y consultas escritas.
- Simulación de edición de precios y disponibilidad.
- Diseño responsive para celular y escritorio.

## Ejecutar localmente

No requiere compilación ni instalación de dependencias. Abre `index.html` en un navegador o usa cualquier servidor HTTP estático.

Por ejemplo, con Node.js:

```bash
npx serve .
```

## Estado de la demo

Los platos, precios, textos e imagen son ilustrativos. La demo no envía pedidos ni mensajes, no procesa pagos y no guarda cambios. Antes de usarla comercialmente deben confirmarse la carta, precios, ingredientes, horarios, fotografías autorizadas y enlaces directos de PedidosYa y Uber Eats con las propietarias.

Los enlaces de delivery se configuran en el objeto `deliveryLinks` de `app.js`. Mientras estén vacíos, los botones muestran un aviso de demostración en lugar de abrir una plataforma externa.

## Estructura

```text
.
├── assets/
│   └── food.jpg
├── app.js
├── index.html
├── styles.css
└── README.md
```
