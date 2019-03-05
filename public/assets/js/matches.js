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
})