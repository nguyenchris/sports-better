// Click Listener for logout button
$('.logout').on('click', function () {
    $.post('/api/logout', function (data, result) {
        if (result == 'success') {
            window.location.assign('/');
        }
    })
});