var map, center;
var latitude = 40.7127,
longitude = -74.0059;
var radius = {
  1: '20000km',
  2: '20000km',
  3: '5000km',
  4: '2000km',
  12: '10km',
};
var zoom = 4;

// url structure
function getImages() {
  var site_url = 'https://api.500px.com/',
  version = 'v1',
  consumer_key = 'wI51zwjjuBN40Z8Md3oBX52MgoEtg3Zqe6Wouzr6';
  var request_url = site_url + version + '/photos/search?geo=' + latitude + ',' + longitude + ',' + radius[zoom] + '&sort=rating&only=landscape&rpp=100&consumer_key=' + consumer_key;
  $.getJSON( request_url, function( data ) {
    for (var i = data.photos.length - 1; i >= 0; i--) {
      var imgLatlng = new google.maps.LatLng(data.photos[i].latitude,data.photos[i].longitude);
      var image_marker = {
          url: data.photos[i].image_url,
          scaledSize: new google.maps.Size(30, 30),
        };
      var marker = new google.maps.Marker({
            position: imgLatlng,
            map: map,
            icon: image_marker,
            title: data.photos[i].name
        });
    };
  });
}

// place on google map
function initialize() {
  var mapOptions = {
    center: { lat: latitude, lng: longitude},
    zoom: zoom
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
  google.maps.event.addListener(map, 'dragend', function() {
      center = map.getCenter();
      latitude = center.k;
      longitude = center.D;
      getImages();
    });
  google.maps.event.addListener(map, 'zoom_changed', function() {
      console.log(map.getZoom());
      //getImages();
    });
}
google.maps.event.addDomListener(window, 'load', initialize);
getImages();