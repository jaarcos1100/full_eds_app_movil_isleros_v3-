package com.fullcolombia.plugins.dataphone;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.credibanco.demosdk.IntegrationClientSDK;
import com.credibanco.demosdk.ResultIntegrationSDK;
import com.credibanco.demosdk.util.SubExtraInfoDto;

import java.io.File;
import java.io.FileInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.io.File;

import android.content.Context;

import androidx.activity.result.ActivityResult;
import androidx.annotation.NonNull;

import static com.fullcolombia.utils.Constants.*;

import android.util.Log;


import org.json.JSONObject;
import org.json.JSONArray;

import java.util.ArrayList;
import java.util.Arrays;
import com.credibanco.demosdk.IntegrationPeripherialSDK;

import java.text.DecimalFormat;

import java.math.RoundingMode;
import java.text.DecimalFormatSymbols;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.nio.charset.StandardCharsets;
import android.graphics.BitmapFactory;



@CapacitorPlugin(name = "dataphone")
public class dataphonePlugin extends Plugin implements ResultIntegrationSDK {
    private static final int STORAGE_PERMISSION_REQUEST_CODE = 1001;
    private PluginCall pendingCall;
    private dataphone implementation = new dataphone();

    @Override
    protected void load() {
        super.load();
        requestStoragePermissionIfNeeded();
    }

    /**
     * El QR del recibo se escribe en /storage/emulated/0/images/qr (ruta pública
     * legada que espera el SDK del datáfono). En Android 6-10 ese permiso es en
     * tiempo de ejecución; se pide aquí al cargar el plugin para que ya esté
     * concedido cuando se intente imprimir. En Android 11+ (scoped storage) no aplica.
     */
    private void requestStoragePermissionIfNeeded() {
        if (android.os.Build.VERSION.SDK_INT > android.os.Build.VERSION_CODES.Q) {
            return;
        }
        android.app.Activity activity = getActivity();
        if (activity == null) {
            return;
        }
        if (androidx.core.content.ContextCompat.checkSelfPermission(
                activity, android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != android.content.pm.PackageManager.PERMISSION_GRANTED) {
            androidx.core.app.ActivityCompat.requestPermissions(
                activity,
                new String[]{
                    android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    android.Manifest.permission.READ_EXTERNAL_STORAGE
                },
                STORAGE_PERMISSION_REQUEST_CODE
            );
        }
    }

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");


        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
public void print(PluginCall call) {
    try {

        Log.d("ResultActivity", "Lego a impresion de venta ");
        Context context = getActivity();
        String hashCode = "AN4zBdaJ";
        String jsonString = call.getString("json");

        if (jsonString == null) {
            call.reject("No se recibió ningún JSON.");
            return;
        }

        JSONObject json = new JSONObject(jsonString);
        Log.d("ResultActivity", "JSON Completo: " + json.toString());
        ArrayList<String> valuesToSend = new ArrayList<>();

        // ⬇️ 1. Entrar al bloque "data"
        JSONObject data = json.optJSONObject("data");
        if (data == null) {
            Log.e("ResultActivity", "La clave 'data' no existe o es null");
            return;
        }

        // Obtener el valor de "copia" desde la raíz del JSON
        int copia = json.optInt("copia", 0);

        // Determinar la línea de separación según el valor de "copia"
        String separador = (copia == 0)
                ? ",------------------------,"
                : ",-----COPIA NO VALIDA----,";

        JSONObject o = data.optJSONObject("o");

        JSONObject cli = data.optJSONObject("cli");
        JSONObject veh = data.optJSONObject("veh");
        JSONObject res = data.optJSONObject("res");


        String documento = cli != null ? cli.optString("d", "") : "";

        if (o != null && copia ==0) {
            valuesToSend.add(TEXT + "," + o.optString("ti", "") + "," + FONT_BIG + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + "," + o.optString("na", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",NIT: " + o.optString("ni", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Teléfono: " + o.optString("te", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + "," + o.optString("d", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + "," + o.optString("m", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + "," + o.optString("e", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
        }else{
            valuesToSend.add(TEXT + ", COPIA PARA ADMIN EDS Y CONTROL DE FLOTAS ," + FONT_NORMAL + "," + ALIGN_CENTER);
        }


        // Obtener "tipo" desde la raíz del JSON
        int tipo = json.optInt("tipo", -1);  // -1 en caso de que no exista

        if (res != null  &&( tipo==1 || tipo==2)) {
            if(copia==1) {
                valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);
            }else{
                valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            }
            // Mostrar según tipo
            if (tipo == 1) {
                valuesToSend.add(TEXT + ",Resolución POS," + FONT_NORMAL + "," + ALIGN_CENTER);
            } else if (tipo == 2) {
                valuesToSend.add(TEXT + ",Resolución Electrónica," + FONT_NORMAL + "," + ALIGN_CENTER);
            }

            // Mostrar número sin prefijo si tipo 3 o 4, o simplemente siempre mostrar el número
            valuesToSend.add(TEXT + "," + res.optString("numero", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);

            // Mostrar rango y fecha solo si tipo es 1 o 2
            if (tipo == 1 || tipo == 2) {
                valuesToSend.add(TEXT + "," + res.optString("rango", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
                valuesToSend.add(TEXT + "," + res.optString("fecha", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
            }
        }else if(tipo==3){
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", Comprobante de venta cupo ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
        }else if(tipo==4){
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", Comprobante de venta cupo libre ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
        }


        // 2. Obtener is_vale de la raíz
        int isVale = json.optInt("is_vale", 0);

        // 3. Validar si es cliente registrado Y is_vale == 1
        if (!"222222222222-7".equals(documento) && isVale == 1) {
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",*** VENTA CREDITO ***," + FONT_NORMAL + "," + ALIGN_CENTER);
        }



        JSONObject general = data.optJSONObject("general");
        if (general != null) {
            String numero = general.optString("numero", "");
            String pre = (res != null) ? res.optString("pre", "") : "";
            String valorFinal = pre.isEmpty() ? numero : pre + numero;
            valuesToSend.add(TEXT + "," + valorFinal + "," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Fecha: " + general.optString("fecha", "") + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ",Hora: " + general.optString("hora", "") + "," + FONT_NORMAL + "," + ALIGN_LEFT);
        }

        if (cli != null || veh != null) {
            if(copia==1) {
                valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);
            }else{
                valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            }
            valuesToSend.add(TEXT + ",Cliente: ," + FONT_NORMAL + "," + ALIGN_LEFT);
            if (cli != null) {
                valuesToSend.add(TEXT + "," + cli.optString("n", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
                valuesToSend.add(TEXT + ",Nit: " + cli.optString("d", "") + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            }
            if (veh != null) {
                valuesToSend.add(TEXT + ",Placa: " + veh.optString("p", "") + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            }
            // Verificamos si el campo "k" existe y es un número válido
            if (veh != null && veh.has("k")) {
                double kilometraje = veh.optDouble("k", 0);
                if (kilometraje > 0) {
                    valuesToSend.add(TEXT + ",KM: " + (int) kilometraje + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                }
            }
        }


        if(copia==1) {
            valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);
        }else{
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
        }

        valuesToSend.add(TEXT + ",Isla     : " + json.optInt("isla", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
        valuesToSend.add(TEXT + ",Posición : " + json.optInt("posicion", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);


        JSONArray productos = json.optJSONArray("prod");
        if (productos != null) {
            for (int i = 0; i < productos.length(); i++) {
                JSONObject p = productos.getJSONObject(i);
                valuesToSend.add(TEXT + ",Producto : " + p.optString("n", "") + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                valuesToSend.add(TEXT + ",Precio   : " + p.optDouble("p", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                valuesToSend.add(TEXT + ",Cantidad : " + p.optDouble("c", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                valuesToSend.add(TEXT + ",Venta    : $" + p.optDouble("v", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            }
        }



        // Validar si hay descuento y d > 0
        JSONObject desc = json.optJSONObject("desc");
        if (desc != null) {
            double descuento = desc.optDouble("d", 0);
            if (descuento > 0) {
                valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);
                valuesToSend.add(TEXT + ",Desc/GAL: $" + (int) desc.optDouble("d", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                valuesToSend.add(TEXT + ",PPU: $" + (int) desc.optDouble("ppu", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                valuesToSend.add(TEXT + ",Total: $" + (int) desc.optDouble("v", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            }
        }



        if(copia==1) {
            valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);
        }else{
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
        }

        valuesToSend.add(TEXT + ",Subtotal : $" + json.optDouble("sub_total", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
        valuesToSend.add(TEXT + ",Impuestos: $" + json.optDouble("imp", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
        valuesToSend.add(TEXT + ",Retención: $" + json.optString("ret", "0.00") + "," + FONT_NORMAL + "," + ALIGN_LEFT);
        valuesToSend.add(TEXT + ",Total    : $" + json.optDouble("total", 0) + "," + FONT_BIG + "," + ALIGN_LEFT);


        if (!"222222222222-7".equals(documento)) {
            double cupo = cli.optDouble("c", 0);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Cupo : $" + (int) cupo + "," + FONT_NORMAL + "," + ALIGN_LEFT);

        }

        if (json.has("anticipate")) {
            double anticipateValue = json.optDouble("anticipate", 0);
            if (anticipateValue > 0) {
                valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
                valuesToSend.add(TEXT + ",Anticipo : $" + (int) anticipateValue + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            }
        }

        if (!"222222222222-7".equals(documento)) {

            if (json.has("pun")) {
                if(copia==1) {
                    valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);
                }else{
                    valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
                }

                JSONObject pun = json.optJSONObject("pun");
                double ven = pun.optDouble("ven", 0);
                double acu = pun.optDouble("acu", 0);

                valuesToSend.add(TEXT + ",Puntos :" + (int) ven + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                valuesToSend.add(TEXT + ",Puntos acumulados :" + (int) acu + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            }
        }

        valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
        valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);
        valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);


        if ("222222222222-7".equals(documento)) {
            valuesToSend.add(TEXT + ",AUN NO ERES CLIENTE EDS," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Regístrate y acumula puntos," + FONT_NORMAL + "," + ALIGN_CENTER);
        }

        valuesToSend.add(TEXT + ",Atendido por: " + json.optString("islero", "") + "," + FONT_NORMAL + "," + ALIGN_LEFT);
        valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);

        if(copia==1){
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",ESTA COPIA NO TIENE VALIDEZ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",EXCLUSIVO USO ADMIN Y CONTROL DE FLOTAS," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
        }

        final String URL_TO_ENCODE = json.optString("url", "");
        Log.d("ResultActivity", "URL"+URL_TO_ENCODE);
        if (copia == 0 && !URL_TO_ENCODE.isEmpty()) {
            try {
                valuesToSend.addAll(generateQrForPrint(URL_TO_ENCODE));
            } catch (Exception qrError) {
                Log.e("ResultActivity", "Error generando QR del recibo original, se imprime sin QR: " + qrError.getMessage());
            }
        }


        valuesToSend.add(TEXT + ",ESTACION 100% COLOMBIANA," + FONT_NORMAL + "," + ALIGN_CENTER);
        valuesToSend.add(TEXT + ",GRACIAS POR SU COMPRA," + FONT_NORMAL + "," + ALIGN_CENTER);
        valuesToSend.add(TEXT + ",SISTEMA POR FULL COLOMBIA SAS," + FONT_NORMAL + "," + ALIGN_CENTER);
        valuesToSend.add(TEXT + ",NIT: 901402077," + FONT_NORMAL + "," + ALIGN_CENTER);


        if(copia==1){
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Firma:__________________," + FONT_NORMAL + "," + ALIGN_CENTER);
        }




        //deleteQRImage(context);


        // Validar si se debe imprimir ticket de fidelización
        int efp = json.optInt("efp", 0);
        if (efp == 1 && copia ==0) {

            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + separador + FONT_NORMAL + "," + ALIGN_CENTER);

            valuesToSend.add(TEXT + ",*PLAN FIDELIZACION-BONO*," + FONT_BIG + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Cliente  : " + cli.optString("n", "")  + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ",Nit      : " + cli.optString("d", "")  + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ",Fecha    : " + general.optString("fecha", "") + "," + FONT_NORMAL + "," + ALIGN_LEFT);

            for (int i = 0; i < productos.length(); i++) {
                JSONObject p = productos.getJSONObject(i);
                valuesToSend.add(TEXT + ",Cantidad : " + p.optDouble("c", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            }

            if (json.has("pun")) {

                JSONObject pun = json.optJSONObject("pun");
                double ven = pun.optDouble("ven", 0);
                double acu = pun.optDouble("acu", 0);

                valuesToSend.add(TEXT + ",Puntos :" + (int) ven + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                valuesToSend.add(TEXT + ",Puntos acumulados :" + (int) acu + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            }
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Atendido por: " + json.optString("islero", "") + "," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Firma:________________," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ",*Aplica términos y condiciones acepto el tratamiento de datos e inclusion a programa fidelizacion. www.hotelbriolalibertad.com.co," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ",*BONO NO ACUMULABLE*," + FONT_NORMAL + "," + ALIGN_CENTER);
        }




        IntegrationPeripherialSDK sdkPeripherals = IntegrationPeripherialSDK.Companion.getSmartPosInstancePeripherals();
        sdkPeripherals.starPrint(context, TYPEFACE_DEFAULT, 6, GRAY_LEVEL_2, "AN4zBdaJ", valuesToSend, this);

        call.resolve();  // no se imprime nada más
        return;


    } catch (Exception e) {
        call.reject("Error al imprimir: " + e.getMessage());
    }
}


    @PluginMethod
    public void printShiftClosureTicket(PluginCall call) {
        try {
            Log.d("ResultActivity", "lLego a impresion de cierre de turno");

            Context context = getActivity();
            String hashCode = "AN4zBdaJ";
            String jsonString = call.getString("json");

            if (jsonString == null) {
                call.reject("No se recibió ningún JSON.");
                return;
            }
            Log.d("ResultActivity", "Lego a impresion de cierre de turno 111111 ");

            // ✅ CORRECCIÓN: leer body desde la raíz
            JSONObject root = new JSONObject(jsonString);
            JSONObject body = root.optJSONObject("body");
            Log.d("ResultActivity", "JSON Completo: " + root.toString());

            if (body == null) {
                call.reject("El cuerpo del JSON no contiene 'body'");
                return;
            }

            Log.d("ResultActivity", "Lego a impresion de cierre de turno 22222 ");

            // ✅ CORRECCIÓN: shift y data están dentro de 'body'
            JSONObject shift = body.optJSONObject("shift");
            JSONObject data = body.optJSONObject("data");
            if (shift == null || data == null) {
                call.reject("Faltan campos obligatorios: 'shift' o 'data'");
                return;
            }

            Log.d("ResultActivity", "Lego a impresion de cierre de turno 333333 ");

            // ✅ CORRECCIÓN: gen dentro de data
            JSONObject gen = data.optJSONObject("gen");
            if (gen == null) {
                call.reject("Falta el bloque 'gen' dentro de 'data'");
                return;
            }

            JSONArray surt = data.optJSONArray("surt");
            double totalVenta = data.optDouble("Tven", 0);
            double canastilla = data.optDouble("Tcan", 0);
            String islero = data.optString("islero", "");
            JSONArray tpago = data.optJSONArray("Tpago");
            double totalDescuento = data.optDouble("Tdesc", 0);

            Log.d("ResultActivity", "Lego a impresion de cierre de turno 44444 ");

            ArrayList<String> valuesToSend = new ArrayList<>();

            valuesToSend.add(TEXT + ",Sistema de impresion," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",y Facturacion Electronica," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",FULL COLOMBIA SAS," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Telefono: 320 382 1500," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",fullcolombiasas@gmail.com," + FONT_NORMAL + "," + ALIGN_CENTER);

            Log.d("ResultActivity", "Lego a impresion de cierre de turno 555555 ");

            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",CIERRE DE TURNOS," + FONT_BIG + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);

            Log.d("ResultActivity", "Lego a impresion de cierre de turno 666666 ");

            valuesToSend.add(TEXT + ",CIERRE DE TURNO No: " + shift.optInt("id_shift", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ",Inicio : " + gen.optString("ini", "") + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ",Final  : " + gen.optString("fin", "") + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",ISLA " + gen.optInt("isl", 0) + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",EQUIPO 3," + FONT_NORMAL + "," + ALIGN_LEFT);

            Log.d("ResultActivity", "Lego a impresion de cierre de turno 77777 ");

            if (surt != null) {
                for (int i = 0; i < surt.length(); i++) {
                    JSONObject surtidor = surt.getJSONObject(i);
                    int id = surtidor.optInt("id", 0);
                    valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
                    valuesToSend.add(TEXT + ",POSICION : " + id + "," + FONT_NORMAL + "," + ALIGN_LEFT);

                    for (String cKey : Arrays.asList("c1", "c2")) {
                        JSONObject c = surtidor.optJSONObject(cKey);
                        if (c == null) continue;
                        JSONArray man = c.optJSONArray("man");
                        if (man == null) continue;

                        DecimalFormatSymbols symbols = new DecimalFormatSymbols();
                        DecimalFormat df = new DecimalFormat("#.###", symbols);
                        df.setRoundingMode(RoundingMode.DOWN);

                        for (int j = 0; j < man.length(); j++) {
                            JSONObject m = man.getJSONObject(j);



                            double volInicial = m.optDouble("i", 0);
                            double volFinal   = m.optDouble("f", 0);
                            double ventaGal   = volFinal - volInicial;
                            double precio     = m.optDouble("p", 0);



                            // Forzar punto decimal reemplazando coma
                            String volInicialStr = df.format(volInicial).replace(',', '.');
                            String volFinalStr   = df.format(volFinal).replace(',', '.');
                            String ventaGalStr   = df.format(ventaGal).replace(',', '.');
                            String producto      = m.optString("pro", "");


                            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
                            valuesToSend.add(TEXT + ",PRODUCTO : " + producto + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                            valuesToSend.add(TEXT + ",Vol. Inicial : " + volInicialStr + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                            valuesToSend.add(TEXT + ",Vol. Final   : " + volFinalStr + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                            valuesToSend.add(TEXT + ",Venta (GAL) : " + ventaGalStr + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                            valuesToSend.add(TEXT + ",P/G         : $" + precio + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                            valuesToSend.add(TEXT + ",Venta (Pesos): $" + (int)(ventaGal * precio) + "," + FONT_NORMAL + "," + ALIGN_LEFT);

                        }
                    }
                }
            }

            Log.d("ResultActivity", "Lego a impresion de cierre de turno 888888 ");

            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",CANASTILLA : $" + (int) canastilla + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",VENTA TOTAL : $" + (int) totalVenta + "," + FONT_BIG + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ",DESCUENTO APLICADO : $" + (int) totalDescuento + "," + FONT_NORMAL + "," + ALIGN_LEFT);
            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);

            if (tpago != null) {
                valuesToSend.add(TEXT + ",DESGLOSE POR MEDIO DE PAGO," + FONT_NORMAL + "," + ALIGN_CENTER);
                for (int i = 0; i < tpago.length(); i++) {
                    JSONObject pago = tpago.getJSONObject(i);
                    String method = pago.optString("method", "");
                    int total = pago.optInt("total", 0);
                    valuesToSend.add(TEXT + "," + method + " : $" + total + "," + FONT_NORMAL + "," + ALIGN_LEFT);
                }
                valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            }

            valuesToSend.add(TEXT + "," + islero + "," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",FIN DE CORTE.," + FONT_NORMAL + "," + ALIGN_CENTER);

            valuesToSend.add(TEXT + ", ," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.add(TEXT + ",Hecho por FULL COLOMBIA SAS," + FONT_NORMAL + "," + ALIGN_CENTER);




            Log.d("ResultActivity", "Lego a impresion de cierre de turno 88888 ");

            IntegrationPeripherialSDK sdkPeripherals = IntegrationPeripherialSDK.Companion.getSmartPosInstancePeripherals();
            sdkPeripherals.starPrint(context, TYPEFACE_DEFAULT, 6, GRAY_LEVEL_2, "AN4zBdaJ", valuesToSend, this);


            call.resolve();
        } catch (Exception e) {
            call.reject("Error al imprimir cierre de turno: " + e.getMessage());
        }
    }

    public void printFidelizacionTicket(Context context, JSONObject json, PluginCall call) {
        try {

            JSONObject data = json.optJSONObject("data");
            if (data == null) {
                Log.e("FidelizacionTicket", "El objeto 'data' es null.");
                return;
            }

            JSONObject cli = data.optJSONObject("cli");
            JSONObject general = data.optJSONObject("general");
            JSONObject pun = json.optJSONObject("pun");
            JSONArray productos = json.optJSONArray("prod");

            String nombre = cli != null ? cli.optString("n", "") : "";
            String nit = cli != null ? cli.optString("d", "") : "";
            String fecha = general != null ? general.optString("fecha", "") : "";
            String islero = json.optString("islero", "");

            int cantidadGalones = 0;
            if (productos != null && productos.length() > 0) {
                JSONObject p = productos.getJSONObject(0);
                cantidadGalones = (int) p.optDouble("c", 0);
            }

            int puntosVen = pun != null ? (int) pun.optDouble("ven", 0) : 0;
            int puntosAcumulados = pun != null ? (int) pun.optDouble("acu", 0) : 0;

            ArrayList<String> ticket = new ArrayList<>();


            // Invocar impresión
            IntegrationPeripherialSDK sdkPeripherals = IntegrationPeripherialSDK.Companion.getSmartPosInstancePeripherals();
            sdkPeripherals.starPrint(context, TYPEFACE_DEFAULT, 6, GRAY_LEVEL_2, "AN4zBdaJ", ticket, this);

            Log.d("FidelizacionTicket", "Ticket de fidelización impreso correctamente.");

            call.resolve();  // no se imprime nada más
            return;

        } catch (Exception e) {
            Log.e("FidelizacionTicket", "Error al imprimir ticket: " + e.getMessage());
        }
    }

    @PluginMethod
    public void startSell(PluginCall call) {
        String amount = call.getString("amount");
        String tax  = call.getString("tax");
        String tip = call.getString("tip");
        String iac = call.getString("iac");

        Log.d("ResultActivity", "amount: " + amount);
        Log.d("ResultActivity", "tax: " + tax);
        Log.d("ResultActivity", "tip: " + tip);
        Log.d("ResultActivity", "iac: " + iac);

        Context context = getContext();
        if (amount == null || amount.isEmpty()) {
            call.reject("Amount is required");
            return;
        }

        try {

            IntegrationClientSDK sdkInstance = IntegrationClientSDK.Companion.getSmartPosInstance();

            if (sdkInstance == null) {
                call.reject("SDK instance is null. Make sure the SDK is initialized correctly.");
                return;
            }

            long parsedAmount;
            try {
                parsedAmount = Long.parseLong(amount);
            } catch (NumberFormatException e) {
                call.reject("Invalid amount format: " + amount);
                return;
            }

            String codeItem = "123456";
            String quantity = "1";
            String unitValue = "100";
            SubExtraInfoDto subExtraInfo = new SubExtraInfoDto(codeItem, quantity, unitValue, parsedAmount);

            ResultIntegrationSDK resultIntegrationSDK = new ResultIntegrationSDK() {
                @Override
                public void resultActivity(@NonNull ActivityResult activityResult) {
                    JSObject result = new JSObject();
                    result.put("status", "Transaction completed successfully");
                    notifyListeners("transactionComplete", result);
                }
            };

            this.pendingCall = call;

            sdkInstance.startSell(
                    context,
                    amount,
                    tax,
                    tip,
                    iac,
                    "AN4zBdaJ",
                    "",
                    subExtraInfo,
                    resultIntegrationSDK = this
            );

        } catch (Exception e) {
            call.reject("Error starting transaction: " + e.getMessage());
        }
    }


    /**
     * Genera un QR desde una URL y lo deja disponible para el SDK.
     * - Crea el PNG en memoria, lo codifica Base64 (sin saltos) y lo guarda como
     *   /storage/emulated/0/images/qr  (sin extensión), que es lo que espera el SDK.
     * - Retorna la(s) línea(s) que debes agregar a valuesToSend para imprimir el QR.
     *
     * @param url URL a codificar en el QR
     * @return líneas para añadir a valuesToSend (incluye $QR)
     */
    private java.util.List<String> generateQrForPrint(String url) throws Exception {
        final int SIZE = 512;

        // 1) Generar BitMatrix con ZXing
        com.google.zxing.qrcode.QRCodeWriter writer = new com.google.zxing.qrcode.QRCodeWriter();
        java.util.Map<com.google.zxing.EncodeHintType, Object> hints =
                new java.util.EnumMap<>(com.google.zxing.EncodeHintType.class);
        hints.put(com.google.zxing.EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(com.google.zxing.EncodeHintType.MARGIN, 1);

        com.google.zxing.common.BitMatrix matrix =
                writer.encode(url, com.google.zxing.BarcodeFormat.QR_CODE, SIZE, SIZE, hints);

        // 2) Pasar a Bitmap
        android.graphics.Bitmap bmp = android.graphics.Bitmap.createBitmap(
                SIZE, SIZE, android.graphics.Bitmap.Config.ARGB_8888);
        for (int x = 0; x < SIZE; x++) {
            for (int y = 0; y < SIZE; y++) {
                bmp.setPixel(x, y, matrix.get(x, y) ? android.graphics.Color.BLACK : android.graphics.Color.WHITE);
            }
        }

        // 3) A PNG (bytes) y Base64 sin saltos
        java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
        bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, baos);
        byte[] pngBytes = baos.toByteArray();
        String encodedNoWrap = android.util.Base64.encodeToString(pngBytes, android.util.Base64.NO_WRAP);

        // 4) Guardar exactamente en /storage/emulated/0/images/qr
        java.io.File publicDir = new java.io.File(android.os.Environment.getExternalStorageDirectory(), "images");
        if (!publicDir.exists() && !publicDir.mkdirs()) {
            throw new IllegalStateException("No se pudo crear /storage/emulated/0/images");
        }
        java.io.File outPublic = new java.io.File(publicDir, "qr"); // nombre fijo que el SDK leerá
        writeText(outPublic, encodedNoWrap);

        android.util.Log.d("QR_TEMP", "QR escrito en: " + outPublic.getAbsolutePath() + " len=" + outPublic.length());

        // 5) Devolver la(s) línea(s) de impresión
        java.util.List<String> qrLines = new java.util.ArrayList<>();
        qrLines.add(QR + "," + FONT_NORMAL + "," + ALIGN_CENTER); // el SDK imprime el archivo 'qr'
        return qrLines;
    }

    @PluginMethod
    public void printQrTicket(PluginCall call) {
        try {
            Log.d("ResultActivity", "Generando QR…");

            Context context = getActivity();
            if (context == null) { call.reject("Contexto nulo"); return; }

            // 1) Contenido del QR
            final String URL_TO_ENCODE = "https://mi-dominio.com/pago?id=123456";
            Log.d("ResultActivity", "111111111");

            // 2) Generar QR (ZXing)
            Log.d("ResultActivity", "22222222");
            final int SIZE = 512;
            com.google.zxing.qrcode.QRCodeWriter writer = new com.google.zxing.qrcode.QRCodeWriter();
            java.util.Map<com.google.zxing.EncodeHintType, Object> hints =
                    new java.util.EnumMap<>(com.google.zxing.EncodeHintType.class);
            hints.put(com.google.zxing.EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(com.google.zxing.EncodeHintType.MARGIN, 1);

            com.google.zxing.common.BitMatrix matrix =
                    writer.encode(URL_TO_ENCODE, com.google.zxing.BarcodeFormat.QR_CODE, SIZE, SIZE, hints);

            android.graphics.Bitmap bmp = android.graphics.Bitmap.createBitmap(
                    SIZE, SIZE, android.graphics.Bitmap.Config.ARGB_8888);
            for (int x = 0; x < SIZE; x++) {
                for (int y = 0; y < SIZE; y++) {
                    bmp.setPixel(x, y, matrix.get(x, y) ? android.graphics.Color.BLACK : android.graphics.Color.WHITE);
                }
            }

            // 3) A bytes (PNG)
            Log.d("ResultActivity", "333333333");
            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, baos);
            byte[] pngBytes = baos.toByteArray();

            // 4) Codificar como Base64 SIN saltos
            Log.d("ResultActivity", "4444444444");
            String encodedNoWrap = android.util.Base64.encodeToString(pngBytes, android.util.Base64.NO_WRAP);

            // 5) Guardar exactamente como /storage/emulated/0/images/qr (sin extensión)
            Log.d("ResultActivity", "555555555");
            java.io.File publicDir = new java.io.File(android.os.Environment.getExternalStorageDirectory(), "images");
            if (!publicDir.exists()) publicDir.mkdirs();
            java.io.File outPublic = new java.io.File(publicDir, "qr"); // nombre FIJO "qr"
            writeText(outPublic, encodedNoWrap);
            Log.d("QR_TEMP", "QR escrito en: " + outPublic.getAbsolutePath() + " len=" + outPublic.length());

            // 6) Payload: NO uses $IMAGE; usa $QR para que el SDK tome el archivo 'qr'
            Log.d("ResultActivity", "66666666666");
            java.util.ArrayList<String> valuesToSend = new java.util.ArrayList<>();
            valuesToSend.add(TEXT + ",FULL COLOMBIA SAS," + FONT_NORMAL + "," + ALIGN_CENTER);
            valuesToSend.addAll(generateQrForPrint(URL_TO_ENCODE));


            // 7) Imprimir (5º parámetro = hash de seguridad)
            Log.d("ResultActivity", "7777777777");
            IntegrationPeripherialSDK sdkPeripherals =
                    IntegrationPeripherialSDK.Companion.getSmartPosInstancePeripherals();


            sdkPeripherals.starPrint(
                    context,
                    TYPEFACE_DEFAULT,
                    6,
                    GRAY_LEVEL_2,
                    "AN4zBdaJ",              // hash de seguridad
                    valuesToSend,
                    this
            );
            Log.d("ResultActivity", "8888888888");

            call.resolve();
        } catch (Exception e) {
            call.reject("Falla generando/imprimiendo QR: " + e.getMessage());
        }
    }

    /* Helpers */
    /*
    private java.io.File getPrivateImagesDir(Context ctx) {
        java.io.File base = (ctx.getExternalFilesDir(null) != null) ? ctx.getExternalFilesDir(null) : ctx.getFilesDir();
        java.io.File dir = new java.io.File(base, "images");
        if (!dir.exists()) dir.mkdirs();
        return dir;
    }*/
    private void writeText(java.io.File file, String text) throws Exception {
        java.io.FileOutputStream fos = new java.io.FileOutputStream(file);
        java.io.OutputStreamWriter osw = new java.io.OutputStreamWriter(fos);
        osw.write(text);
        osw.close();
    }


    /*
    private static String readFileToString(File file) throws IOException {
        FileInputStream fis = new FileInputStream(file);
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int n;
        while ((n = fis.read(buffer)) != -1) {
            bos.write(buffer, 0, n);
        }
        fis.close();
        return new String(bos.toByteArray(), StandardCharsets.UTF_8);
    }*/

    // Guarda un PNG visible en la galería (Pictures/FullColombia).
// API 29+: usa MediaStore (sin permisos).
// API ≤28: escribe en Pictures/ (requiere WRITE_EXTERNAL_STORAGE en tiempo de ejecución).
    /*
    private static android.net.Uri savePngToGalleryCompat(Context ctx, byte[] pngBytes, String displayName) throws Exception {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            // --- API 29+ (Android 10+): MediaStore sin permisos ---
            android.content.ContentValues values = new android.content.ContentValues();
            values.put(android.provider.MediaStore.Images.Media.DISPLAY_NAME, displayName + ".png");
            values.put(android.provider.MediaStore.Images.Media.MIME_TYPE, "image/png");
            values.put(android.provider.MediaStore.Images.Media.RELATIVE_PATH, "Pictures/FullColombia");
            values.put(android.provider.MediaStore.Images.Media.IS_PENDING, 1);

            android.net.Uri uri = ctx.getContentResolver().insert(
                    android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            if (uri == null) throw new IllegalStateException("No se pudo crear entrada en MediaStore");

            java.io.OutputStream os = ctx.getContentResolver().openOutputStream(uri);
            if (os == null) throw new IllegalStateException("No OutputStream para " + uri);
            os.write(pngBytes);
            os.flush();
            os.close();

            values.clear();
            values.put(android.provider.MediaStore.Images.Media.IS_PENDING, 0);
            ctx.getContentResolver().update(uri, values, null, null);
            return uri;
        } else {
            // --- API 28 o menor: escribir en Pictures ---
            java.io.File pictures = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_PICTURES);
            java.io.File appDir = new java.io.File(pictures, "FullColombia");
            if (!appDir.exists()) appDir.mkdirs();

            java.io.File out = new java.io.File(appDir, displayName + ".png");
            java.io.FileOutputStream fos = new java.io.FileOutputStream(out);
            fos.write(pngBytes);
            fos.flush();
            fos.close();

            // Notificar a la galería (MediaScanner)
            android.content.Intent scanIntent = new android.content.Intent(android.content.Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
            scanIntent.setData(android.net.Uri.fromFile(out));
            ctx.sendBroadcast(scanIntent);

            return android.net.Uri.fromFile(out);
        }
    }*/

    @Override
    public void handleOnActivityResult(int requestCode, int resultCode, android.content.Intent data) {
        JSObject result = new JSObject();
        result.put("status", "Transaction completed successfully");
        notifyListeners("transactionComplete", result);
    }

    @Override
    public void resultActivity(@NonNull ActivityResult activityResult) {
            int resultCode = activityResult.getResultCode();
            Log.d("ResultActivity", "Result Code: " + resultCode);
            
            // Preparamos el objeto a retornar a TS
            JSObject result = new JSObject();
            result.put("resultCode", resultCode);
            
            // Se resuelve el PluginCall pendiente
            if (this.pendingCall != null) {
                this.pendingCall.resolve(result);
                this.pendingCall = null; // se limpia para evitar reutilización
        }
        /*
        if (activityResult.getResultCode() == RESULT_SELL_CODE) {
            Intent data = activityResult.getData();
            if (data != null) {
                Bundle bundle = data.getExtras();
                if (bundle != null && !bundle.isEmpty()) {
                    Log.d("ResultActivity", "Received Bundle Data:");

                    for (String key : bundle.keySet()) {
                        Object value = bundle.get(key);
                        Log.d("ResultActivity", key + " : " + (value != null ? value.toString() : "null"));
                    }
                } else {
                    Log.d("ResultActivity", "Bundle is empty or null.");
                }
            } else {
                Log.d("ResultActivity", "Intent data is null.");
            }
        }*/
    }
}
