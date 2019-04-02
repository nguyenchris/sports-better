$(document).ready(function() {
  // Click Listener for logout button
  $('.logout').on('click', function() {
    $.post('/api/logout', function(data, result) {
      if (result == 'success') {
        window.location.assign('/');
      }
    });
  });

  function getTodayMatches() {
    activateLoader();
    $.get('/api/matches')
      .done(function(data) {
        $('#date-picker').attr('placeholder', data.date);
        $('.date-header').text('TODAY');
        matchesData = data;
        getAllMatchBets(matchesData);
      })
      .fail(function(err) {
        console.log(err);
      });
  }
});
