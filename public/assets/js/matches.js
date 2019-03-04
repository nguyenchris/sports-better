$(document).ready(function() {

    // Get request for today's games
    $.get('/api/matches', function (data) {
        console.log(data);
    })

$('.bet').on('click', function() {
    console.log($(this).attr('data-teamId'));
});

$('.cards .dimmable').dimmer({
    on: 'hover'
});

})