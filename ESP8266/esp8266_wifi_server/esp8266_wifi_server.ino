#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <FS.h>
extern "C" {
  #include <user_interface.h>
}

// モード切り替えピン
const int MODE_PIN = 5; // GPIO5

// Wi-Fi設定保存ファイル
const char* settings = "/wifi_settings.txt";

// サーバモードでのパスワード
const String pass = "esp8266wifi";





ESP8266WebServer server(80);

/**
 * WiFi設定
 */
void handleRootGet() {
  String html = "";
  File f = SPIFFS.open(settings, "r");
  String ssid = f.readStringUntil('\n');
  String pass = f.readStringUntil('\n');
  String uuid = f.readStringUntil('\n');
  //String host = f.readStringUntil('\n');
  int sleep = f.parseInt();
  String sleep_str = String(sleep);
  html += "<h1>WiFi Settings</h1>";
  html += "<form method='post'>";
  html += "  <input type='text' name='ssid' placeholder='ssid' value='"+ ssid +"'><br>";
  html += "  <input type='text' name='pass' placeholder='pass' value='"+ pass +"'><br>";
  html += "  <input type='text' name='uuid' placeholder='ssid' value='"+ uuid +"'><br>";
  //html += "  <input type='text' name='host' placeholder='pass' value='"+ host +"'><br>";
  html += "  <input type='number' name='sleep' placeholder='sleep minute' value='"+ sleep_str +"'><br>";
  html += "  <input type='submit'><br>";
  html += "</form>";
  server.send(200, "text/html", html);
}

void handleRootPost() {
  String ssid = server.arg("ssid");
  String pass = server.arg("pass");
  String uuid = server.arg("uuid");
  //String host = server.arg("host");
  String sleep = server.arg("sleep");

  File f = SPIFFS.open(settings, "w");
  f.println(ssid);
  f.println(pass);
  f.println(uuid);
  //f.println(host);
  f.println(sleep);
  f.close();

  String html = "";
  html += "<h1>WiFi Settings</h1>";
  html += "SSID: "+ssid + "<br>";
  html += "PASS: "+pass + "<br>";
  html += "UUID: "+uuid + "<br>";
  //html += "HOST: "+host + "<br>";
  html += "SLEEEP TIME: "+sleep + " min<br>";
  server.send(200, "text/html", html);
}

/**
 * 初期化(クライアントモード)
 */
void setup_client() {

  File f = SPIFFS.open(settings, "r");
  String ssid = f.readStringUntil('\n');
  String pass = f.readStringUntil('\n');
  String uuid = f.readStringUntil('\n');
  //String host_f = f.readStringUntil('\n');
  int sleep = f.parseInt();
  f.close();

  if(!sleep||sleep < 1){
    sleep = 1;
  }

  //空白を削除
  ssid.trim();
  pass.trim();
  uuid.trim();
  //host_f.trim();
  
  Serial.println("SSID: " + ssid);
  Serial.println("PASS: " + pass);
  Serial.println("UUID: " + uuid);
  //Serial.println("HOST: " + host_f);
  Serial.print("Sleep: " );
  Serial.print(sleep);
  Serial.println(" min");

  WiFi.begin(ssid.c_str(), pass.c_str());

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");

  Serial.println("WiFi connected");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  delay(5 * 1000);
  
  // We now create a URI for the request
  const char* host = "78da5dca.ngrok.io";
  String url = "";
  int remain_lvl = 75;
  int battery_lvl = 3;
  int opened = 1;

  url += "/api?uuid=" + uuid;
  url += "\&remain_lvl=" + String( remain_lvl);
  url += "\&battery_lvl=" + String( battery_lvl);
  url += "\&opened=" + String(opened);
  
  //sprintf(url,"/api?uuid=%s&remain_lvl=%d&battery_lvl=%d&opened=%d", uuid, remain_lvl, battery_lvl, opened);
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 80;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }



  Serial.print("connecting to ");
  Serial.println(host);

  Serial.print("Requesting URL: ");
  Serial.println(url);

  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
  int timeout = millis() + 5000;
  while (client.available() == 0) {
    if (timeout - millis() < 0) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      return;
    }
  }

  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }

  Serial.println();
  Serial.println("closing connection");

  delay(10 * 1000);
  //休眠、数分後ResetにIO16から負のパルスを発信して復帰
  ESP.deepSleep(sleep * 60 * 1000 * 1000);
}

/**
 * 初期化(サーバモード)
 */
void setup_server() {
  byte mac[6];
  WiFi.macAddress(mac);
  String ssid = "";
  for (int i = 0; i < 6; i++) {
    ssid += String(mac[i], HEX);
  }
  Serial.println("SSID: " + ssid);
  Serial.println("PASS: " + pass);

  /* You can remove the password parameter if you want the AP to be open. */
  WiFi.softAP(ssid.c_str(), pass.c_str());

  server.on("/", HTTP_GET, handleRootGet);
  server.on("/", HTTP_POST, handleRootPost);
  server.begin();
  Serial.println("HTTP server started.");
  Serial.println("Setup: http://192.168.4.1/");
}

/**
 * 初期化
 */
void setup() {
  Serial.begin(115200);
  Serial.println();

  // 1秒以内にMODEを切り替える
  //  0 : Server
  //  1 : Client
  delay(1000);

  // ファイルシステム初期化
  SPIFFS.begin();

  pinMode(MODE_PIN, INPUT);
  if (digitalRead(MODE_PIN) == 0) {
    // サーバモード初期化
    setup_server();
  } else {
    // クライアントモード初期化
    setup_client();
  }
}

void loop() {
  server.handleClient();
}
