(function() {
  var body, lightsOffButton;
  lightsOffButton = document.getElementsByTagName('input')[0];
  body = document.getElementsByTagName('body')[0];
  lightsOffButton.addEventListener('click', function(event) {
    return body.className = 'lightsOff';
  });
}).call(this);
