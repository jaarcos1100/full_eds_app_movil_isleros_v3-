package com.fyllcolombia.www;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Obtener la instancia de WebView de Capacitor
        WebView webView = (WebView) this.bridge.getWebView();

        // Configurar la WebView para permitir contenido mixto
        WebSettings webSettings = webView.getSettings();
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
    }
}