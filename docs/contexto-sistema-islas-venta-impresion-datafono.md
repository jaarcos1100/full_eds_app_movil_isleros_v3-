# Contexto de Sistema: Flujo de Venta, Impresión y Datáfono en Islas

> Documentación de referencia sobre cómo funciona hoy el datáfono Credibanco y la impresión de tickets entre esta app (`full_eds_app_movil_isleros_v3`) y el backend (`eds_back_end_node_js`). Objetivo: consultar este archivo en vez de re-explorar el código a fondo cada vez que se necesite tocar este flujo.
>
> Documento espejo del creado en `eds_back_end_node_js/docs/contexto-sistema-islas-venta-impresion-datafono.md`.

## Stack de esta app

Ionic 6 + Angular 16 + Capacitor 6. La UI es 100% web, corriendo dentro de un WebView (Android/iOS). No hay lógica nativa relevante fuera de los plugins Capacitor descritos abajo.

## 1. Pago / Datáfono Credibanco

- El plugin nativo `dataphone` (Capacitor, Android) envuelve el SDK propietario `com.credibanco.demosdk.*` (SmartPOS): `dataphone/android/src/main/java/com/fullcolombia/plugins/dataphone/dataphonePlugin.java`. Expone a JS `startSell` (cobro), `print`, `printShiftClosureTicket`, `printQrTicket`.
- El flag que controla si se usa este plugin es `is_integrate_print`, guardado en `LocalStorageIpPortService` (`getIsPrint()`/`setIsPrint()`) y configurable desde `dialog-settings-host.component.ts`.
- Cuando `is_integrate_print = false`, la app simplemente no invoca el plugin — el pago/impresión por datáfono queda desactivado sin tocar código.

## 2. Impresión de tickets

### Flujo cuando el datáfono SÍ está activo
`invoice.component.ts` → `dataphoneService.startPrint(data_json)` → plugin nativo `dataphone['print']` → SDK Credibanco imprime en la impresora térmica integrada al POS.

```ts
// src/app/pages/home/lobby/invoice/invoice.component.ts (~línea 1086)
async print(data_json) {
  if (this.is_integrate_print && this.require_print) {
    await this.dataphoneService.startPrint(data_json);
  }
}
```

No tiene rama `else`: si `is_integrate_print` es `false`, este método no hace nada por sí solo — la impresión para ese caso la resuelve el **backend**, no el frontend.

### Flujo cuando el datáfono NO está activo
Verificado en `eds_back_end_node_js/services/saleService.js`. Al facturar, `completeSale` lee del body los flags `is_integrate_print` y `require_print`, y decide en `sendRecipeSocket`:

```js
// services/saleService.js (~línea 5398)
if (is_integrate_print == true || required_print == false) {
  resolve(recipe); // impresión queda a cargo del cliente (datáfono)
} else {
  const data = await commonService.sendSocket(recipe, idisle, recipe.entity);
  // envía { entity: 'recibo', method: 'CREATE', data: {...} } por WebSocket
  // a la tarjeta electrónica (hardware) de la isla, identificada por idisle
}
```

`commonService.sendSocket` está documentado en el backend como "Envío de datos por Socket a las Tarjetas Hardware de cada Isla" — es el mismo mecanismo que usa el panel de Administrador para reimpresión remota de recibos.

**Regla general:** cualquier cliente (móvil, tablet, PC/web) que facture con `is_integrate_print = false` y `require_print = true` delega la impresión al backend, que la envía por WebSocket a la tarjeta hardware de la isla — no necesita impresora física propia ni SDK de datáfono.

> Nota: existe también un campo `is_dataphone` en el payload de `completeSale`, pero actualmente está inactivo en el backend (rama de código comentada). El flag que realmente controla la decisión es `is_integrate_print`.

## 3. Comunicación con el backend

- REST vía `HttpClient` de Angular, IP/puerto configurados en `src/app/services/localStorageIpPort/local-storage-ip-port.service.ts`.
- WebSocket plano (`ws://`, no socket.io) para eventos en tiempo real: estado de mangueras/surtidores, autorización de venta, y el envío de recibos a hardware descrito arriba (este último lo maneja el backend, no esta app).
- El backend distingue clientes `origin: 'web'` explícitamente en el protocolo — está preparado para aceptar clientes web además de móviles.

## Archivos clave referenciados

**Esta app (`full_eds_app_movil_isleros_v3`):**
- `src/app/pages/home/lobby/invoice/invoice.component.ts` — flujo de facturación e impresión
- `src/app/services/dataphone/dataphone.service.ts` — wrapper del plugin nativo Credibanco
- `src/app/services/localStorageIpPort/local-storage-ip-port.service.ts` — flags `is_integrate_print`, config de IP/puerto
- `dataphone/android/src/main/java/com/fullcolombia/plugins/dataphone/dataphonePlugin.java` — plugin nativo Android (SDK Credibanco SmartPOS)

**Backend (`eds_back_end_node_js`):**
- `services/saleService.js` — `completeSale`, `sendRecipeToIsle`, `sendRecipeSocket`
- `services/saleServiceAdmin.js` — `sendRecipeFromAdminToIsle` (flujo de reimpresión desde Admin, mismo mecanismo)
- `services/commonServices.js` — `sendSocket` (envío genérico por WebSocket a tarjetas hardware de isla)
- `services/webSocketService.js` — manejo de eventos `estadomanguera`, `iButton`, `venta`
