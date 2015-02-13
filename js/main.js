var map, center;
var latitude = 49.2500,
longitude = -123.1000;
var radius = {
  1: 20000,
  2: 20000,
  3: 10000,
  4: 4000,
  5: 1500,
  6: 700,
  7: 500,
  8: 200,
  9: 100,
  10: 50,
  11: 25,
  12: 13,
  13: 6,
  14: 3,
  15: 1.6,
  16: 0.8,
  17: 0.4,
  18: 0.2,
  19: 0.1,
  20: 0.05,
  21: 0.03
};
var zoom = 8;
var markers = [];
var cricle;
var marker_size = Math.pow(zoom, 2);

// url structure
function getImages() {
  var site_url = 'https://api.500px.com/',
  version = 'v1',
  consumer_key = 'wI51zwjjuBN40Z8Md3oBX52MgoEtg3Zqe6Wouzr6';
  var request_url = site_url + version + '/photos/search?geo=' + latitude + ',' + longitude + ',' + radius[zoom] + 'km&sort=rating&only=landscape&rpp=100&consumer_key=' + consumer_key;
  $.getJSON( request_url, function( data ) {
    for (var i = data.photos.length - 1; i >= 0; i--) {
      var imgLatlng = new google.maps.LatLng(data.photos[i].latitude,data.photos[i].longitude);
      var image_marker = {
          url: data.photos[i].image_url,
          scaledSize: new google.maps.Size(Math.pow(zoom, 1.6), Math.pow(zoom, 1.6)),
        };
      var marker = new google.maps.Marker({
            position: imgLatlng,
            map: map,
            icon: image_marker,
            title: data.photos[i].name
        });
      markers.push(marker);
    };
  });
}

function removeMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function drawCircle() {
  var circleOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 0,
        fillColor: '#FF0000',
        fillOpacity: 0.05,
        map: map,
        center: map.getCenter(),
        radius: radius[zoom] * 1000
      };
  circle = new google.maps.Circle(circleOptions);
}

function reloadImage() {
  removeMarkers();
  circle.setMap(null);
  drawCircle();
  getImages();
}

// place on google map
function initialize() {
  var mapOptions = {
    center: { lat: latitude, lng: longitude},
    zoom: zoom
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
  drawCircle();
  google.maps.event.addListener(map, 'dragend', function() {
      center = map.getCenter();
      latitude = center.k;
      longitude = center.D;
      reloadImage();
    });
  google.maps.event.addListener(map, 'zoom_changed', function() {
      zoom = map.getZoom();
      reloadImage();
    });
}
google.maps.event.addDomListener(window, 'load', initialize);
getImages();