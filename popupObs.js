//get user coords, return them into the global scope
function popupObs () {
$.get("https://ipinfo.io", function(response) {
      var latLon = response.loc;
      console.log(latLon === response.loc);
      var requestString = 'http://api.mesowest.net/v2/stations/nearesttime?&radius='+latLon+',100&limit=1&units=ENGLISH&token=804c1eb09a394255beef8e84b68123bf&vars=air_temp,wind_speed';

      $.get(requestString, function(obs) {
        var tempOut;
        var windOut;
        var stnName = obs.STATION[0].NAME;
        var stnDist = obs.STATION[0].DISTANCE;
        if (obs.STATION[0].OBSERVATIONS.air_temp_value_1 !== undefined) {
          tempOut = obs.STATION[0].OBSERVATIONS.air_temp_value_1.value;
        } else {tempOut = 'temp undefined';}

        if (obs.STATION[0].OBSERVATIONS.wind_speed_value_1 !== undefined) {
          windOut = obs.STATION[0].OBSERVATIONS.wind_speed_value_1.value;
        } else {windOut = 'no wind data at site';}
       outArr = ['Air temperature is ' +tempOut+' degrees F', ' wind speed: ' + windOut + '. Observations from the ' + stnName + ' site located ' + stnDist + ' miles from you.'];
       document.getElementById('obs').innerHTML=outArr;
      }, "jsonp");
  }, "jsonp");

}

popupObs()