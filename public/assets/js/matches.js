// $('#button').on('click', function(e) {
//     console.log('hi');
//     e.preventDefault();
//     $.ajax({
//         url: '/api/matches',
//         method: 'GET',
//         dataType: 'json'
//     }).done(function(data) {
//         console.log(data);
//     })
// });


$.get('/api/matches', function(data) {
    console.log(data);
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