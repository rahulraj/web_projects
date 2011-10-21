$(function() {
  /** @const */ var parent = $('section');

  $.get(networkStickies.storageUrl, function(data) {
    networkStickies.NoteMvcFactory.createMvc(data, parent);
  });
});
