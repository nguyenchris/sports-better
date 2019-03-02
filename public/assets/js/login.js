$(document).ready(function () {
    const test = $('.ui.form').form({
        fields: {
            email: {
                identifier: 'email',
                rules: [{
                        type: 'empty',
                        prompt: 'Please enter your e-mail'
                    },
                    {
                        type: 'email',
                        prompt: 'Please enter a valid e-mail'
                    }
                ]
            },
            password: {
                identifier: 'password',
                rules: [{
                        type: 'empty',
                        prompt: 'Please enter your password'
                    },
                    {
                        type: 'length[5]',
                        prompt: 'Your password must be at least 5 characters'
                    }
                ]
            }
        },
        onSuccess: submitLogin
    });

    $('#search_form').keypress((e) => {
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            if (query.length > 1) {
                encodeSearch('&q=', query);
                $('#textarea1').val('');
            }
        }
    });

    function submitLogin(event, fields) {
        event.preventDefault();
        const obj = {
            email: fields.email,
            password: fields.password
        }

        $.post('/api/login', obj, function(data, result) {
            if (result == 'success') {
                window.location.assign('/');
            } else {
                
            }
        })
    }
});