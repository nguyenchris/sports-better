$(document).ready(function() {
    $('.ui.form').form({
        fields: {
            name: {
                identifier: 'name',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Please enter your name'
                    }
                ]
            },
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
                        type: 'minLength[5]',
                        prompt: 'Your password must be at least 5 characters'
                    }
                ]
            },
            confirmPassword: {
                identifier: 'confirmPassword',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Please confirm your password'
                    },
                    {
                        type: 'match[password]',
                        prompt: 'Your passwords do not match'
                    }
                ]
            },
            url: {
                identifier: 'url',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'You must provide an image URL'
                    },
                    {
                        type: 'contains[http]',
                        prompt: 'You must provide a valid image URL'
                    },
                    {
                        type: 'contains[.jpg]',
                        prompt: 'Image URL must end with ".jpg"'
                    }
                ]
            }
        },
        onSuccess: submitSignup
    });

    function submitSignup(event, fields) {
        event.preventDefault();
        let div = $('<div class="ui active dimmer">');
        let loader = $('<div class="ui large text loader">').text('Signing Up');
        div.append(loader);
        $('form').append(div);
        const obj = {
            name: fields.name,
            email: fields.email,
            password: fields.password,
            imageUrl: fields.url
        };

        $.post('/api/signup', obj)
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
