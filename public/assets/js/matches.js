$(document).ready(function() {
    fetchUser();

    // Global variable to hold all the data for the selected date of matches
    let matchesData = {};
    let matchIdBet = null;
    let teamIdBet = null;
    let betObj = {};
    let currentUser;

    // Helper functions
    const createUser = ({ user, bets, betTotal }) => ({
        user,
        bets,
        betTotal
    });

    function findWhere(array, criteria) {
        var key = Object.keys(criteria)[0];
        return array.find(obj => {
            return obj[key] == criteria[key];
        });
    }

    function fetchUser(update) {
        $.get('/api/user').then(function(fetchedUser) {
            return getUserBet(fetchedUser, update);
        });
    }

    function getUserBet(userData, update) {
        $.get(`/api/bets/${userData.id}`)
            .done(function(data) {
                if (update) {
                    currentUser = createUser(data);
                    getAllMatchBets(matchesData, true);
                } else {
                    currentUser = createUser(data);
                    getTodayMatches();
                }
            })
            .fail(function(err) {
                console.log(err);
            });
    }

    // Function to get all of today's matches
    function getTodayMatches() {
        activateLoader();
        $.get('/api/matches')
            .done(function(data) {
                $('#date-picker').attr('placeholder', data.date);
                $('.date-header').text('TODAY');
                getAllMatchBets(data);
            })
            .fail(function(err) {
                console.log(err);
            });
    }

    function getMatchByDate(date, text) {
        activateLoader();
        console.log('USER', currentUser);
        $.get(`/api/matches/${date}`)
            .done(function(data) {
                if (data.today == text) {
                    $('.date-header').text('TODAY');
                } else {
                    $('.date-header').text(data.day);
                }
                getAllMatchBets(data);
            })
            .fail(function(err) {
                console.log(err);
            });
    }

    function getMatchDetails(id) {
        $.get(`/api/matches/boxscore/${id}`)
            .done(function(game) {
                console.log(game);
            })
            .fail(function(err) {
                console.log(err);
            });
    }

    function getAllMatchBets(matches, update) {
        const matchIdsArr = matches.games.map(match => {
            return match.schedule.id;
        });
        const query = encodeURIComponent(JSON.stringify(matchIdsArr));
        matchesData = { ...matches };
        $.get(`/api/bets/matches/?matches=${query}`)
            .done(function(data) {
                matchesData.matchBetsArr = data.matchesArr.map(match => {
                    match.betTotal = match.Bets.reduce((acc, bet) => {
                        return (acc += bet.amount);
                    }, 0);
                    return match;
                });
                console.log('FINAL', matchesData);
                if (!update) {
                    generateGameCard(matchesData);
                }
            })
            .fail(function(err) {
                console.log(err);
            });
    }

    // Function to send post request with data for the user's selection
    function postBet(bet) {
        $.post(`/api/bets/user`, bet)
            .done(function(result) {
                fetchUser(true);
            })
            .fail(function(err) {
                console.log(err);
            });
    }

    function deleteBet(id) {
        $.ajax({
            url: `/api/bets/${id}`,
            method: 'DELETE'
        }).then(function(result) {
            fetchUser(true);
        });
    }

    // Helper function to sort through searched match data in order to find the data for a match by passing in the id
    function findMatchData(id) {
        console.log(matchesData);
        const matchObj = matchesData.games.find(game => {
            return game.schedule.id === id;
        });
        return matchObj;
    }

    function activateLoader() {
        let div = $('<div class="ui active centered inline dimmer">');
        let loader = $('<div class="ui large text loader">').text(
            'Loading Matches'
        );
        div.append(loader);
        $('#matches-div').append(div);
    }

    function removeLoader() {
        $('#matches-div').empty();
    }

    function getBetAmount(event, fields) {
        if (fields.amount) {
            $('.mini.modal').modal('hide');
            const matchObj = findMatchData(matchIdBet);
            console.log('=======BET DATA AFTER SUBMIT=======');
            console.log('matchIdBet', matchIdBet);
            console.log('teamIdBet', teamIdBet);
            console.log('matchObj', matchObj);
            console.log('amount', fields.amount);
            console.log('USER', currentUser);
            console.log('================================');
            let localBetObj = {
                bet: {
                    selectedTeamId: teamIdBet,
                    amount: parseInt(fields.amount)
                },
                match: {
                    id: matchIdBet,
                    playedStatus: matchObj.schedule.playedStatus,
                    startTime: matchObj.schedule.startTime,
                    homeTeamId: matchObj.schedule.homeTeam.id,
                    awayTeamId: matchObj.schedule.awayTeam.id
                }
            };

            betObj = { ...localBetObj };
            updateBetButton(betObj, true);
        }
    }

    function updateBetButton(betObj, isNew) {
        console.log(betObj);
        const { amount, selectedTeamId } = betObj.bet;
        const { awayTeamId, homeTeamId, id } = betObj.match;
        const matchObj = matchesData.matchBetsArr.find(match => {
            return match.id === id;
        });
        let matchBets, matchBetsAmt, homeOrAway, opponentTeamId;
        if (matchObj == undefined) {
            matchBets = 0;
            matchBetsAmt = 0;
        } else {
            matchBets = matchObj.Bets.length;
            matchBetsAmt = matchObj.betTotal;
        }

        if (selectedTeamId === homeTeamId) {
            homeOrAway = 'Home';
            opponentTeamId = awayTeamId;
        } else {
            homeOrAway = 'Away';
            opponentTeamId = homeTeamId;
        }
        if (isNew) {
            $(`.bet[data-teamid='${selectedTeamId}']`)
                .addClass('chosen-bet')
                .children('.visible')
                .text(`You Bet: $${amount}`);
            $(`.bet[data-teamid='${selectedTeamId}']`)
                .find('.icon')
                .replaceWith(`<i class='x icon'></i><span>Cancel</span>`);
            $(`.bet[data-teamid='${opponentTeamId}']`).addClass('disabled');
            $(`.card[data-matchid='${id}'] .total-bet-val`).text(
                `${matchBets + 1}`
            );
            $(`.card[data-matchid='${id}'] .total-bet-amt-val`).text(
                `${matchBetsAmt + parseInt(amount)}`
            );
            postBet(betObj);
        } else {
            $(`.bet[data-teamid='${selectedTeamId}']`)
                .removeClass('chosen-bet')
                .find('.visible')
                .text(`Bet ${homeOrAway}`);
            $(`.bet[data-teamid='${selectedTeamId}']`)
                .find('.hidden')
                .empty()
                .append("<i class='dollar sign icon'></i>");
            $(`.bet[data-teamid='${opponentTeamId}']`).removeClass('disabled');
            $(`.card[data-matchid='${id}'] .total-bet-val`).text(
                `${matchBets - 1}`
            );
            $(`.card[data-matchid='${id}'] .total-bet-amt-val`).text(
                `${matchBetsAmt - parseInt(amount)}`
            );
            deleteBet(betObj.bet.id);
        }
    }

    // Click handler for when user selects bet button. Pulls teamId and input amount.
    function betClickHandler(event) {
        event.stopPropagation();
        let isChosenBet = $(this).hasClass('chosen-bet');
        teamIdBet = parseInt($(this).attr('data-teamId'));
        matchIdBet = parseInt(
            $(this)
                .parents()
                .attr('data-matchId')
        );
        if (isChosenBet) {
            betObj.match = matchesData.matchBetsArr.find(match => {
                return match.id === matchIdBet;
            });
            betObj.bet = betObj.match.Bets.find(bet => {
                return bet.MatchId === matchIdBet;
            });
            updateBetButton(betObj, false);
        } else {
            $('.mini.modal')
                .modal({
                    duration: 210,
                    onHidden: function() {
                        $('#bet-amount').val('');
                    }
                })
                .modal('show');
        }
    }

    // Activates bet button clicker and
    function activateListeners() {
        $('.bet').on('click', betClickHandler);
        $('.cards .dimmable').dimmer({
            on: 'hover'
        });
        $('.mini.modal').modal({
            onHidden: function() {
                $('#bet-amount').val('');
            }
        });
        // Click handler to get match id
        $('.game-details').on('click', function() {
            const id = $(this).attr('data-matchId');
            // getChartFG();
            // getChart3PT();
            console.log('matchId=', id);
            $('.ui.modal')
                .modal({
                    transition: 'scale',
                    duration: 400,
                    blurring: true,
                    // onShow: function() {
                    //     $('.game-details').modal({
                    //         transition: 'fade',
                    //         duration: 10000
                    //     });
                    // },
                    onShow: function() {
                        getMatchDetails(id);
                    },
                    onVisible: getChartFG
                    // onHide: function() {
                    //     $('.chart-area').empty();
                    // }
                })
                .modal('show');
        });
        $('.menu>[data-tab=game-stats]').tab();
        $('.menu>[data-tab=bet-odds]').tab();

        $('.small.form').form({
            on: 'submit',
            fields: {
                amount: {
                    identifier: 'amount',
                    rules: [
                        {
                            type: 'integer[1..100000]',
                            prompt: 'Please enter an integer value'
                        }
                    ]
                }
            },
            onSuccess: getBetAmount
        });
    }
    $('#calendar').calendar({
        type: 'date',
        onChange: function(date, text) {
            const utcDate = new Date(date);
            getMatchByDate(utcDate, text);
        }
    });

    // Function to generate each individual game card
    function generateGameCard(data) {
        $('matches-div').empty();
        if (data.games.length === 0) {
            removeLoader();
            $('#matches-div').append('<h1 class="white">No Games Found</h1>');
        } else {
            const markupData = data.games.map(game => {
                const { playedStatus } = game.schedule;
                let userBetHome, userBetAway;
                let matchWithBets = {};
                let matchWithUserBet = {};
                if (matchesData.matchBetsArr.length !== 0) {
                    matchWithBets = matchesData.matchBetsArr.find(match => {
                        return match.id == game.schedule.id;
                    });
                } else {
                    matchWithBets = undefined;
                }

                if (currentUser.bets.length !== 0) {
                    matchWithUserBet = currentUser.bets.find(bet => {
                        return bet.MatchId == game.schedule.id;
                    });
                    if (matchWithUserBet) {
                        if (
                            matchWithUserBet.selectedTeamId ==
                            game.schedule.homeTeam.id
                        ) {
                            userBetHome = true;
                        } else {
                            userBetAway = true;
                        }
                    }
                } else {
                    userBetHome = false;
                    userBetAway = false;
                }
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
                                          <div class="ui inverted button game-details" data-matchId="${
                                              game.schedule.id
                                          }">Game Details</div>
                                      </div>
                                  </div>
                              </div>
                              <div class="content info">
                                  <div class="ui header centered">
                                      <span class="left floated home-team">${
                                          game.schedule.homeTeam.abbreviation
                                      }</span><span
                                          class="live ${
                                              playedStatus === 'LIVE'
                                                  ? 'red'
                                                  : ''
                                          }">${playedStatus}</span><span
                                          class="right floated away-team">${
                                              game.schedule.awayTeam
                                                  .abbreviation
                                          }</span>
                                  </div>
                                  <div class="meta">
                                      <span class="left aligned home">Home</span>
                                      <span class="right floated away">Away</span>
                                  </div>
                                  <img class="left floated tiny ui image home-img" src="/img/${
                                      game.schedule.homeTeam.abbreviation
                                  }.svg">
                                  <img class="right floated tiny ui image away-img" src="/img/${
                                      game.schedule.awayTeam.abbreviation
                                  }.svg"><div class="meta center aligned time"><span>${game.startTime.toUpperCase()} MST</span>
                                  </div>
                                  <div class="description">
                                      <span class="left aligned home-score">${
                                          game.score.homeScoreTotal
                                      }</span>
                                      <span class="right floated away-score">${
                                          game.score.awayScoreTotal
                                      }</span>
                                  </div>
                              </div>
                          </div>
                          <div class="extra content bet-money">
                              <div class="ui description">
                                  <p class="total-bets">Total Bets: <span class="total-bet-val">${
                                      matchWithBets
                                          ? matchWithBets.Bets.length
                                          : 0
                                  }</span></p>
                                  <p class="total-bet-amt">Total Bet Amt: $<span class="total-bet-amt-val">${
                                      matchWithBets ? matchWithBets.betTotal : 0
                                  }</span></p>
                              </div>
                          </div>
                          <div class="extra content">
                              <div class="ui two buttons" data-matchId="${
                                  game.schedule.id
                              }">
                                  <div class="ui basic animated fade green button bet home-bet ${
                                      playedStatus !== 'VS'
                                          ? 'disabled'
                                          : userBetAway
                                          ? 'disabled'
                                          : ''
                                  } ${
                    userBetHome ? 'chosen-bet' : ''
                }" data-teamId="${game.schedule.homeTeam.id}" tabindex="0">
                                    <div class="visible content">${
                                        userBetHome
                                            ? 'You Bet: $' +
                                              matchWithUserBet.amount
                                            : 'Bet Home'
                                    }</div>
                                    <div class="hidden content">
                                      <i class="${
                                          userBetHome ? 'x' : 'dollar sign'
                                      } icon"></i>${
                    userBetHome ? '<span>Cancel</span>' : ''
                }
                                    </div>
                                  </div>
                                  <div class="ui basic animated fade red button bet away-bet ${
                                      playedStatus !== 'VS'
                                          ? 'disabled'
                                          : userBetHome
                                          ? 'disabled'
                                          : ''
                                  } ${
                    userBetAway ? 'chosen-bet' : ''
                }" data-teamId="${game.schedule.awayTeam.id}" tabindex="0">
                                    <div class="visible content">${
                                        userBetAway
                                            ? 'You Bet: $' +
                                              matchWithUserBet.amount
                                            : 'Bet Away'
                                    }</div>
                                    <div class="hidden content">
                                      <i class="${
                                          userBetAway ? 'x' : 'dollar sign'
                                      } icon"></i>${
                    userBetAway ? '<span>Cancel</span>' : ''
                }
                                    </div>
                                  </div>
                              </div>
                          </div>
                      </div>`;
                return markup;
            });
            removeLoader();
            document.getElementById('matches-div').innerHTML = markupData.join(
                ''
            );
            activateListeners();
        }
    }

    // function createCharts() {
    // Chart.pluginService.register({
    //     beforeDraw: function(chart) {
    //         var width = chart.chart.width,
    //             height = chart.chart.height,
    //             ctx = chart.chart.ctx;
    //         ctx.restore();
    //         var fontSize = (height / 114).toFixed(2);
    //         ctx.font = fontSize + 'em sans-serif';
    //         ctx.textBaseline = 'middle';
    //         var text = chart.config.options.elements.center.text,
    //             textX = Math.round((width - ctx.measureText(text).width) / 2),
    //             textY = height / 1.57;
    //         ctx.fillText(text, textX, textY);
    //         ctx.save();
    //     }
    // });

    // let markup = `
    //     <div class="home-charts">
    //         <div class="fg-chart charts">
    //             <canvas id="home-fg"></canvas>
    //         </div>
    //         <div class="three-pt-chart charts">
    //             <canvas id="home-3pt"></canvas>
    //         </div>
    //         <div class="ft-chart charts">
    //             <canvas id="home-ft"></canvas>
    //         </div>
    //     </div>

    //     <div class="away-charts">
    //         <div class="fg-chart charts" id="home-fg">
    //             <canvas id="away-fg"></canvas>
    //         </div>
    //         <div class="three-pt-chart charts">
    //             <canvas id="away-3pt"></canvas>
    //         </div>
    //         <div class="ft-chart charts">
    //             <canvas id="away-ft"></canvas>
    //         </div>
    //     </div>`;
    // }

    function getChartFG() {
        Chart.pluginService.register({
            beforeDraw: function(chart) {
                const width = chart.chart.width,
                    height = chart.chart.height,
                    ctx = chart.chart.ctx;
                ctx.restore();
                const fontSize = (height / 114).toFixed(2);
                ctx.font = fontSize + 'em sans-serif';
                ctx.textBaseline = 'middle';
                const text = chart.config.options.elements.center.text,
                    textX = Math.round(
                        (width - ctx.measureText(text).width) / 2
                    ),
                    textY = height / 1.57;
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        });

        const data = {
            labels: ['Red', 'Blue'],
            datasets: [
                {
                    data: [50, 50],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB']
                }
            ]
        };
        let homeFGChart = new Chart(document.getElementById('home-fg'), {
            type: 'doughnut',
            data: data,
            options: {
                elements: {
                    center: {
                        text: '50%'
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Field Goal %',
                    fontSize: 15,
                    padding: 8
                },
                animation: {
                    duration: 1500
                }
            }
        });

        let awayFGChart = new Chart(document.getElementById('away-fg'), {
            type: 'doughnut',
            data: data,
            options: {
                elements: {
                    center: {
                        text: '50%'
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Field Goal %',
                    fontSize: 15,
                    padding: 8
                },
                animation: {
                    duration: 1500
                }
            }
        });

        let home3Pt = new Chart(document.getElementById('home-3pt'), {
            type: 'doughnut',
            data: data,
            options: {
                elements: {
                    center: {
                        text: '50%'
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Field Goal %',
                    fontSize: 15,
                    padding: 8
                },
                animation: {
                    duration: 1500
                }
            }
        });

        // let homeFt = new Chart(document.getElementById('home-ft'), {
        //     type: 'doughnut',
        //     data: data,
        //     options: {
        //         elements: {
        //             center: {
        //                 text: '50%'
        //             }
        //         },
        //         responsive: true,
        //         maintainAspectRatio: false,
        //         legend: {
        //             display: false
        //         },
        //         title: {
        //             display: true,
        //             text: 'Field Goal %',
        //             fontSize: 15,
        //             padding: 8
        //         },
        //         animation: {
        //             duration: 1500
        //         }
        //     }
        // });

        let away3Pt = new Chart(document.getElementById('away-3pt'), {
            type: 'doughnut',
            data: data,
            options: {
                elements: {
                    center: {
                        text: '50%'
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Field Goal %',
                    fontSize: 15,
                    padding: 8
                },
                animation: {
                    duration: 1500
                }
            }
        });

        // let awayFt = new Chart(document.getElementById('away-ft'), {
        //     type: 'doughnut',
        //     data: data,
        //     options: {
        //         elements: {
        //             center: {
        //                 text: '50%'
        //             }
        //         },
        //         responsive: true,
        //         maintainAspectRatio: false,
        //         legend: {
        //             display: false
        //         },
        //         title: {
        //             display: true,
        //             text: 'Field Goal %',
        //             fontSize: 15,
        //             padding: 8
        //         },
        //         animation: {
        //             duration: 1500
        //         }
        //     }
        // });
    }
    //     /****************************
    //           Jeremy's Code Below for comments
    //      */
});
