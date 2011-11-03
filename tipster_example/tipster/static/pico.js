$(document).ready(function() {
    $('a#shorten').bind('click', function() {
        $.getJSON('/s', {
            url: $('input[name="url"]').val()
        }, function(data) {
            $('#result').text('http://127.0.0.1:5000/' + data.h);
        });
        return false;
    });
});
