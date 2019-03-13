$(document).ready(function() {
    const test = $('.ui.form').form({
        fields: {
            email: {
                identifier: 'email',
                rules: [
                    {
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
                rules: [
                    {
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

    function submitLogin(event, fields) {
        event.preventDefault();
        let div = $('<div class="ui active dimmer">');
        let loader = $('<div class="ui large text loader">').text('Logging In');
        div.append(loader);
        $('form').append(div);
        const obj = {
            email: fields.email,
            password: fields.password
        };

        $.post('/api/login', obj)
            .done(function(data) {
                window.location.assign('/');
            })
            .fail(function(err) {
                $('.dimmer').remove();
                const msg = err.responseJSON.error;
                $('.ui.form').form('add errors', [msg]);
            });
    }
});
