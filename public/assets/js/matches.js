$(document).ready(function () {
    getMatches();

    // Function to get all of today's matches
    // NOTE: Refactor this into a function that renders the markup to DOM in order for pagination to occur when selecting different dates.
    function getMatches() {
        activateLoader();
        $.get('/api/matches')
            .done(function (data) {
                console.log(data);
                $('.date-header').text(data.date);
                let markupData = data.games.map(game => {
                    const { playedStatus } = game.schedule;
                    if (!game.score.homeScoreTotal || !game.score.awayScoreTotal) {
                        game.score.homeScoreTotal = '';
                        game.score.awayScoreTotal = '';
                    }
                    let markup = `
        <div class="card" data-matchId="${game.schedule.id}">
            <div class="blurring dimmable content">
                <div class="ui dimmer">
                    <div class="content">
                        <div class="center">
                            <div class="ui inverted button game-details" data-matchId="${game.schedule.id}">Game Details</div>
                        </div>
                    </div>
                </div>
                <div class="content info">
                    <div class="ui header centered">
                        <span class="left floated home-team">${game.schedule.homeTeam.abbreviation}</span><span
                            class="live ${playedStatus === 'LIVE' ? 'red' : ''}">${playedStatus}</span><span
                            class="right floated away-team">${game.schedule.awayTeam.abbreviation}</span>
                    </div>
                    <div class="meta">
                        <span class="left aligned home">Home</span>
                        <span class="right floated away">Away</span>
                    </div>
                    <img class="left floated tiny ui image home-img" src="/img/${game.schedule.homeTeam.abbreviation}.svg">
                    <img class="right floated tiny ui image away-img" src="/img/${game.schedule.awayTeam.abbreviation}.svg"><div class="meta center aligned time"><span>${game.schedule.startTime.toUpperCase()} MT</span>
                    </div>
                    <div class="description">
                        <span class="left aligned home-score">${game.score.homeScoreTotal}</span>
                        <span class="right floated away-score">${game.score.awayScoreTotal}</span>
                    </div>
                </div>
            </div>
            <div class="extra content bet-money">
                <div class="ui description">
                    <p class="total-money">Total: $900</p>
                </div>
            </div>
            <div class="extra content">
                <div class="ui two buttons">
                    <div class="ui basic green button bet home-bet" data-teamId="${game.schedule.homeTeam.id}">Bet <span
                            class="bet-btn-team">Home</span>
                    </div>
                    <div class="ui basic red button bet away-bet" data-teamId="${game.schedule.awayTeam.id}">Bet
                        <span>Away</span></div>
                </div>
            </div>
        </div>
        `;
                    return markup;
                });
                removeLoader();
                document.getElementById('matches-div').innerHTML = markupData.join('');
                activateListeners();
            })
            .fail(function (err) {
                console.log(err);
            })
    }

    function activateLoader() {
        let div = $('<div class="ui active centered inline dimmer">')
        let loader = $('<div class="ui large text loader">').text('Loading Matches');
        div.append(loader);
        $('#matches-div').append(div);
    }

    function removeLoader() {
        $('#matches-div').empty();
    }

    function activateListeners() {
        // Click event listener for when a bet button is clicked
        $('.bet').on('click', function (event) {
            // Get the teamid for whichever team user bets on
            const id = $(this).attr('data-teamId');
            event.stopPropagation();
            console.log('teamId=', id);
        });
        $('.cards .dimmable').dimmer({
            on: 'hover'
        });

        const gameClickHandler = $('.game-details').on('click', function () {
            const id = $(this).attr('data-matchId');
            console.log('matchId=', id);
        })
        $('.ui.modal')
            .modal('attach events', '.game-details', 'show');
    }

    $('#example2').calendar({
        type: 'date'
    });


    $(document).on("change", '#date-picker', function (e) {
        console.log(e)
        console.log("Date changed: ", e.target.value);
    });


})