window.onload = () => {
  // EVENT LISTENERS -------------
  // hike hover
  $('#hike').on('mouseover', () => {
    console.log('moused over');
    $('#hover_info').text('Find a wonderful place to hike. Our optimized algorithm will suggest a nearby location with low humidity, a light breeze, and a temperature around 18 degrees celsius.');
    $('#hover_info').fadeIn(1000);
  });
  $('#hike').on('mouseleave', () => {
    console.log('mouse left');
    $('#hover_info').fadeOut(10);
  });
  // ski hover
  $('#ski').on('mouseover', () => {
    console.log('moused over');
    $('#hover_info').text('Find the ski destination with the most snow on the ground!');
    $('#hover_info').fadeIn(1000);
  });
  $('#ski').on('mouseleave', () => {
    $('#hover_info').fadeOut(10);
  });
  // switch unit hover
  $('#switch').on('mouseover', () => {
    console.log('moused over');
    $('#hover_info').text('Would you like to switch to Fahrenheit?');
    $('#hover_info').fadeIn(1000);
  });
  $('#switch').on('mouseleave', () => {
    $('#hover_info').fadeOut(10);
    if ($('#unit-img').css("display") !== 'none') $('#unit-img').fadeOut(1000);
  });
  $('#switch').on('click', () => {
    $('#unit-img').fadeIn(1000);
  });

//get user coords, return them into the global scope
function popupObs () {
$.get("https://ipinfo.io", function(response) {
      var latLon = response.loc;
      let coordArr = latLon.split(',');
      let userLat = coordArr[0];
      let userLon = coordArr[1];
      let userCity = response.city;
      let city = userCity.split(' ').join('_');
      console.log(latLon === response.loc);
      var requestString = 'https://api.wunderground.com/api/5b8022f5c6ed3bec/conditions/q/CA/' + city + '.json';

      $.get(requestString, function(obs) {
        let temp;
        let wind;
        let relativeHumidity;
        let cloud;
        let precip;

        if (obs.current_observation.temp_c !== undefined) {
          temp = obs.current_observation.temp_c;
        } else {temp = 'temp undefined';}

        if (obs.current_observation.wind_mph !== undefined) {
          relativeHumidity = obs.current_observation.relative_humidity;
        } else {relativeHumidity = 'no RH at site';}

        if (obs.current_observation.wind_mph !== undefined) {
          wind = obs.current_observation.wind_mph + ', ' + obs.current_observation.wind_dir;
        } else {wind = 'no wind speed data at site';}
        
        if (obs.current_observation.precip_today_in !== undefined) {
          precip = obs.current_observation.precip_today_in;
        } else {precip = 'daily precip unavailable';}

        if (obs.current_observation.icon !== undefined) {
          cloud = obs.current_observation.icon;
        } else {cloud = 'no cloud cover data at site';}

       document.getElementById('temp').innerHTML=temp;
       document.getElementById('precip').innerHTML=precip;
       document.getElementById('humidity').innerHTML=relativeHumidity;
       document.getElementById('cloud_cover').innerHTML=cloud;
       document.getElementById('wind').innerHTML=wind;
      }, "jsonp");
  }, "jsonp");
}

//map element
let overlay;
wundergroundOverlay.prototype = new google.maps.OverlayView();

// Initialize the map and the custom overlay.

const renderMap = () => {
  let map = new google.maps.Map(document.getElementById('map_container'), {
    zoom: 6,
    center: {lat: 34.052, lng: -118.243},
    mapTypeId: 'satellite'
  });

  var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(24.7433195, -124.7844079),
      new google.maps.LatLng(49.3457868, -66.9513812));

  // The photograph is courtesy of the wunderground API.
  var srcImage = 'https://api.wunderground.com/api/5b8022f5c6ed3bec/animatedradar/animatedsatellite/image.gif?num=5&delay=50&rad.maxlat=49.346&rad.maxlon=-66.9513&rad.minlat=24.743&rad.minlon=-124.784&rad.width=640&rad.height=480&rad.rainsnow=1&rad.reproj.automerc=1&rad.num=5&sat.maxlat=47.709&sat.maxlon=-69.263&sat.minlat=31.596&sat.minlon=-97.388&sat.width=640&sat.height=480&sat.key=sat_ir4_bottom&sat.gtt=107&sat.proj=me&sat.timelabel=0&sat.num=5';

  overlay = new wundergroundOverlay(bounds, srcImage, map);
}

/** @constructor */
function wundergroundOverlay(bounds, image, map) {

  // Initialize all properties.
  this.bounds_ = bounds;
  this.image_ = image;
  this.map_ = map;

  // Define a property to hold the image's div. 
  this.div_ = null;

  // Explicitly call setMap on this overlay.
  this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
wundergroundOverlay.prototype.onAdd = function() {

  var div = document.createElement('div');
  div.style.borderStyle = 'none';
  div.style.borderWidth = '0px';
  div.style.position = 'absolute';

  // Create the img element and attach it to the div.
  var img = document.createElement('img');
  img.id = 'overlay';
  img.src = this.image_;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.position = 'absolute';
  div.appendChild(img);

  this.div_ = div;

  // Add the element to the "overlayLayer" pane.
  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);
};

wundergroundOverlay.prototype.draw = function() {

  //retrieve the projection from the overlay.
  var overlayProjection = this.getProjection();

  // Retrieve the south-west and north-east coordinates of this overlay
  // in LatLngs and convert them to pixel coordinates.
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Resize the image's div to fit the indicated dimensions.
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
wundergroundOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

google.maps.event.addDomListener(window, 'load', map);
popupObs();

}