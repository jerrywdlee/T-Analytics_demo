#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <FS.h>
// モード切り替えピン
#define MODE_PIN 5 // GPIO5
// 開閉検知PIN
#define OPEN_PIN 4 // GPIO4
// LED
#define LED_PIN 13
#define USE_SERIAL Serial

// Wi-Fi設定保存ファイル
const char* settings = "/wifi_settings.txt";

// サーバモードでのパスワード
const String pass = "esp8266wifi";

//int opened = 0;//開封かどうかを最初から測る
int counter = 0;//サーバーモードのカウンター、5分後サーバーモードがスリープに陥る

//電力消耗:
//稼働中: 5V 0.07A
//Sleep: 5V 0.00A(<10mA)


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
  String host = f.readStringUntil('\n');
  //int port = f.parseInt();
  int sleep = f.parseInt();
  String sleep_str = String(sleep)?String(sleep) : "30";
  html += "<h1>WiFi Settings</h1>";
  html += "<form method='post'>";
  html += "<p>SSID : <input type='text' name='ssid' placeholder='SSID' value='"+ ssid +"'></p>";
  html += "<p>PASS : <input type='text' name='pass' placeholder='Pass' value='"+ pass +"'></p>";
  html += "<p>UUID : <input type='text' name='uuid' placeholder='UUID' value='"+ uuid +"'></p>";
  html += "<p>HOST : <input type='text' name='host' placeholder='Host' value='"+ host +"'></p>";
  html += "<p>WAIT : <input type='number' name='sleep' placeholder='Wait Time Sec' value='"+ sleep_str +"'><br>";
  html += "  <input type='submit'><br>";
  html += "</form>";
  server.send(200, "text/html", html);
}

void handleRootPost() {
  String ssid = server.arg("ssid");
  String pass = server.arg("pass");
  String uuid = server.arg("uuid");
  String host = server.arg("host");
  String sleep = server.arg("sleep");

  File f = SPIFFS.open(settings, "w");
  f.println(ssid);
  f.println(pass);
  f.println(uuid);
  f.println(host);
  f.println(sleep);
  f.close();

  String html = "";
  html += "<h1>WiFi Settings</h1>";
  html += "SSID: "+ssid + "<br>";
  html += "PASS: "+pass + "<br>";
  html += "UUID: "+uuid + "<br>";
  html += "HOST: "+host + "<br>";
  html += "WAIT TIME: "+sleep + " Sec<br>";
  server.send(200, "text/html", html);

  
  delay(5 * 1000);
  Serial.println("Waiting For Reboot...");
  //休眠1s
  ESP.deepSleep(1000);
}

void delete_crlf(char str[40]);
/* link to server */
void HTTP_GET_1(char url[40],char uuid[20],int remain_lvl,int battery_lvl,int opened)
{
    char S1[150];
    delete_crlf(url);
    delete_crlf(uuid);
    // wait for WiFi connection
    ESP8266WiFiMulti WiFiMulti;
    if((WiFiMulti.run() == WL_CONNECTED)) {

        HTTPClient http;
        //USE_SERIAL.printf(url);
        USE_SERIAL.print("[HTTP] begin...\n");
        // configure traged server and url
        sprintf(S1,"%s/api?uuid=%s&remain_lvl=%d&battery_lvl=%d&opened=%d",url,uuid,remain_lvl,battery_lvl,opened);
        USE_SERIAL.print(S1);
        USE_SERIAL.print("\n");
        http.begin(S1); //HTTP
        //http.begin("http://153.120.158.89:3033/api?uuid=test_esp_dev&remain_lvl=100&battery_lvl=4&opened=1");
        USE_SERIAL.print("[HTTP] GET...\n");
        // start connection and send HTTP header
        int httpCode = http.GET();

        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                USE_SERIAL.println(payload);
            }

        } else {
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
    }
}


void delete_crlf(char str[40]){
  for(int i=0 ; i<40; i++){
    if(str[i] == '\n'){
      str[i] = '\0';
    }  
  }
}

/**
 * 初期化(クライアントモード)
 */
void setup_client() {
    
  File f = SPIFFS.open(settings, "r");
  String ssid = f.readStringUntil('\n');
  String pass = f.readStringUntil('\n');
  String uuid = f.readStringUntil('\n');
  String host = f.readStringUntil('\n');
  int sleep = f.parseInt();
  f.close();

  if(!sleep||sleep < 1){
    sleep = 30;
  }

  //空白を削除
  ssid.trim();
  pass.trim();
  uuid.trim();
  host.trim();
  
  Serial.println("SSID: " + ssid);
  Serial.println("PASS: " + pass);
  Serial.println("UUID: " + uuid);
  Serial.println("HOST: " + host);
  Serial.print("Sleep: " );
  Serial.print(sleep);
  Serial.println(" Sec.");
  
  ESP8266WiFiMulti WiFiMulti;
  //WiFi.begin(ssid.c_str(), pass.c_str());
  WiFi.begin("Mizuho Saotome", "19841990");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  //WiFiMulti.addAP("TEMONA Guest", "welcometotemona");
  delay(1000);
  Serial.println("");

  Serial.println("WiFi connected");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // We now create a URI for the request
  //const char* host = "153.120.158.89";
  //String url = "";
  //int remain_lvl = read_mcp3002(0);
  int remain_lvl = 100;
  int battery_lvl = 4;


  
  //pinMode(2, INPUT);
  
  //Serial.print("Pin2: ");
  //Serial.println(digitalRead(2));
  
  /*
  url += "/api?uuid=" + uuid;
  url += "\&remain_lvl=" + String( remain_lvl);
  url += "\&battery_lvl=" + String( battery_lvl);
  url += "\&opened=" + String(opened);
  */
  
  //sprintf(url,"/api?uuid=%s&remain_lvl=%d&battery_lvl=%d&opened=%d", uuid, remain_lvl, battery_lvl, opened);
  // Use WiFiClient class to create TCP connections
  /*
  WiFiClient client;
  const int httpPort = 3033;
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
  */

  //host = host == ""? "http://153.120.158.89:3033" : host;
  //pinMode(OPEN_PIN, INPUT);//check if closed
  //if(digitalRead(OPEN_PIN) == 0){
    char url_charBuf[40];
    char uuid_charBuf[20];
    host.toCharArray(url_charBuf, 40);
    uuid.toCharArray(uuid_charBuf, 20);
    HTTP_GET_1(url_charBuf,uuid_charBuf,remain_lvl,battery_lvl,1);
  //}else{
  //  Serial.println("Not Closed yet...");
  //  pinMode(LED_PIN, OUTPUT);
  //  digitalWrite(LED_PIN, HIGH); 
  //}

  //HTTP_GET_1("http://153.120.158.89:3033","112233",58,1,1);
  //pin4 のリセット
  pinMode(OPEN_PIN, OUTPUT);
  digitalWrite(OPEN_PIN, HIGH); 
  //pin5 のリセット
  pinMode(MODE_PIN, OUTPUT);
  digitalWrite(MODE_PIN, HIGH); 

  delay(5 * 1000);
  Serial.println("Fall into Sleep...");
  //休眠、数分後ResetにIO16から負のパルスを発信して復帰
  //以下の場合は復帰しない
  ESP.deepSleep(1000*1000,WAKE_RF_DISABLED);
}

/**
 * 初期化(サーバモード)
 */
void setup_server() {
  byte mac[6];
  WiFi.macAddress(mac);
  String ssid = "ESP_";
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

  /*
  //pin5 のリセット
  pinMode(MODE_PIN, OUTPUT);
  digitalWrite(MODE_PIN, HIGH); 
  */
}


/**
 * 初期化
 */
void setup() {
  Serial.begin(74880);
  // ファイルシステム初期化
  SPIFFS.begin();
  Serial.println();
  File f = SPIFFS.open(settings, "r");
  String ssid = f.readStringUntil('\n');
  String pass = f.readStringUntil('\n');
  String uuid = f.readStringUntil('\n');
  String host = f.readStringUntil('\n');
  int sleep = f.parseInt();
  f.close();
  if(!sleep||sleep < 10){
    sleep = 30;
  }
  //pinMode(4, INPUT);
  //Serial.print("Pin4: ");
  //Serial.println(digitalRead(4));
  //int opened = digitalRead(4) == 0? 1:0;
  
  Serial.println("Press Mode Button To Active Setting Mode...");
  // 10秒以内にMODEを切り替える
  // pin5 デフォルトは0
  //  0 : Server
  //  1 : Client
  delay(10000);

  // ファイルシステム初期化
  //SPIFFS.begin();

  pinMode(MODE_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  if (digitalRead(MODE_PIN) == 0) {
    // サーバモード初期化
    setup_server();
  } else {
    // クライアントモード初期化
    Serial.println("Waiting...");
    delay((sleep-10)* 1000); //使用が終わるまで、数秒待ち
    pinMode(OPEN_PIN, INPUT);//check if closed
    if(digitalRead(OPEN_PIN) == 0){
      setup_client();
    }else{
      Serial.println("Not Closed yet...");
      
      digitalWrite(LED_PIN, HIGH); 
    }
  }
}

void loop() {
  server.handleClient();
  pinMode(4, INPUT);
  Serial.print("Pin4: ");
  Serial.println(digitalRead(4));
  digitalWrite(LED_PIN, HIGH);
  delay(2500);
  digitalWrite(LED_PIN, LOW);
  delay(2500);
  counter ++ ;
  if(counter > 60){
    Serial.println("Fall into Sleep...");
    //休眠、数分後ResetにIO16から負のパルスを発信して復帰
    //u32_t使っているため、最大は4,294,967,295us(約1h)
    ESP.deepSleep(4294967295,WAKE_RF_DISABLED);
  }
}
