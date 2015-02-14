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
var image_data;

//https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e728008a0fe3227f71bd0fb87b9e7a52&lat=49.2500&lon=-123.1000&radius=20&extras=url_q&tags=landscape

function kmToMile (km) {
  var mile = km * 0.621371;
  console.log(mile);
}

// url structure
function get500pxImages() {
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
      console.log(map);
      var marker = new google.maps.Marker({
        position: imgLatlng,
        map: map,
        icon: image_marker,
        title: data.photos[i].name,
        draggable:true
      });
      markers.push(marker);
    };
  });
}

function getFlickrImages() {
  var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e728008a0fe3227f71bd0fb87b9e7a52&lat=49.2500&lon=-123.1000&radius=20&tags=landscape";
  var src_arr = [];
  var location_arr = [];
  var counter = 0;
  $.getJSON(url + "&format=json&jsoncallback=?", function( data ) {
    $.each(data.photos.photo, function(i,item){
      var getLocation = 'https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=e728008a0fe3227f71bd0fb87b9e7a52&photo_id=' + item.id;
      var src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
      src_arr[i] = src;
      $.getJSON(getLocation + "&format=json&jsoncallback=?", function( data ) {
        var imgLatlng = new google.maps.LatLng(data.photo.location.latitude,data.photo.location.longitude);
        location_arr.push(imgLatlng);
        var image_marker = {
          url: src_arr[counter],
          scaledSize: new google.maps.Size(Math.pow(zoom, 1.6), Math.pow(zoom, 1.6)),
        };
        var marker = new google.maps.Marker({
          position: imgLatlng,
          map: map,
          icon: image_marker,
          draggable:true
        });
        markers.push(marker);
        counter++;
      });
    });
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
  //get500pxImages();
  getFlickrImages();
}

// place on google map
function initialize() {
  console.log("called");
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
  // get500pxImages();
  getFlickrImages();
}
google.maps.event.addDomListener(window, 'load', initialize);
