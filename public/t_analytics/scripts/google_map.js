$(document).ready(function(){
  var markerData = [ // マーカーを立てる場所名・緯度・経度
    {
        name: '<a href="#">順天堂大学</a>',
        lat: 35.7021342,
        lng: 139.7586458,
        icon: 't_analytics/images/ware_chu_icon.png' // TAM 東京のマーカーだけイメージを変更する
    },
      {
          name: '<a href="#">小川町駅</a>',
          lat: 35.6951212,
          lng: 139.76610649999998
      }, {
          name: '<a href="#">淡路町駅</a>',
          lat: 35.69496,
          lng: 139.76746000000003
      }, {
          name: '<a href="#">御茶ノ水駅</a>',
          lat: 35.6993529,
          lng: 139.76526949999993
      }, {
          name: '<a href="#">神保町駅</a>',
          lat: 35.695932,
          lng: 139.75762699999996
      }, {
          name: '<a href="#">新御茶ノ水駅</a>',
          lat: 35.696932,
          lng: 139.76543200000003
      }, {
          name: '<a href="#">秋葉原駅</a>',
          lat: 35.698333,
          lng: 139.773056
      }
  ];

  google.maps.event.addDomListener(window, 'load', create_google_map('google_map',markerData,15));
})



var create_google_map = function (div_id,markerData, zoom_lvl) {
  var map;
  var marker = [];
  var infoWindow = [];
  function initMap() {
    //calculate center of map
    var bound = new google.maps.LatLngBounds();
    for (i = 0; i < markerData.length; i++) {
      bound.extend( new google.maps.LatLng(markerData[i].lat, markerData[i].lng) );
      // OTHER CODE
    }
    //console.log( bound.getCenter() );

      // 地図の作成
      var mapLatLng = new google.maps.LatLng({lat: markerData[0]['lat'], lng: markerData[0]['lng']}); // 緯度経度のデータ作成
      map = new google.maps.Map(document.getElementById('google_map'), { // #sampleに地図を埋め込む
          //center: mapLatLng, // 地図の中心を指定
          center:bound.getCenter(),
          scrollwheel: false,
          zoom: zoom_lvl?zoom_lvl:15 // 地図のズームを指定
      });

      // マーカー毎の処理
      for (var i = 0; i < markerData.length; i++) {
          markerLatLng = new google.maps.LatLng({lat: markerData[i]['lat'], lng: markerData[i]['lng']}); // 緯度経度のデータ作成
          marker[i] = new google.maps.Marker({ // マーカーの追加
              position: markerLatLng, // マーカーを立てる位置を指定
              map: map // マーカーを立てる地図を指定
          });

          infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
              content: '<div class="google-map-info">' + markerData[i]['name'] + '</div>' // 吹き出しに表示する内容
          });

          markerEvent(i); // マーカーにクリックイベントを追加
      }
      if ( markerData[0]['icon']) {
        marker[0].setOptions({
          icon: {
            url: markerData[0]['icon']// マーカーの画像を変更
          }
        });
      }
  }

  // マーカーにクリックイベントを追加
  function markerEvent(i) {
      marker[i].addListener('click', function() { // マーカーをクリックしたとき
          infoWindow[i].open(map, marker[i]); // 吹き出しの表示
      });
  }
  setTimeout(function () {
    initMap()
  }, 1000);
}
