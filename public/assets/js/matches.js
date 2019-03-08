$(document).ready(function() {
  getTodayMatches();
  // Function to get all of today's matches
  function getTodayMatches() {
    activateLoader();
    $.get('/api/matches')
      .done(function(data) {
        console.log(data);
        $('#date-picker').attr('placeholder', data.date);
        $('.date-header').text('TODAY');
        generateGameCard(data);
      })
      .fail(function(err) {
        console.log(err);
      });
  }

  function getMatchByDate(date, text) {
    activateLoader();
    $.get(`/api/matches/${date}`)
      .done(function(data) {
        if (data.today == text) {
          $('.date-header').text('TODAY');
        } else {
          $('.date-header').text(data.day);
        }
        generateGameCard(data);
        console.log(data);
      })
      .fail(function(err) {
        console.log(err);
      });
  }

  function getMatchDetails(id) {
    $.get(`/api/matches/modal/${id}`)
      .done(function(game) {
        console.log(game);
      })
      .fail(function(err) {
        console.log(err);
      });
  }

  function postBet(bet) {
    $.post(`/api/bets`, bet)
      .done(function(result) {
        console.log(result);
      })
      .fail(function(err) {
        console.log(err);
      });
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

  // Click handler for when user selects bet button. Pulls teamId and input amount.
  function betClickHandler(event) {
      const id = $(this).attr('data-teamId');
      event.stopPropagation();
      postBet({
          id: id,
          amount: 100
      })
      console.log('teamId=', id);
  }

  // Activates bet button clicker and
  function activateListeners() {
    $('.bet').on('click', betClickHandler)

    $('.cards .dimmable').dimmer({
      on: 'hover'
    });

    /*
        Click match > open modal > get boxscore, comments > render items > remove loader
        active class > 
        */

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
          // onShow: function () {
          //     $('.game-details').modal({
          //         transition: 'fade',
          //         duration: 10000
          //     })
          // },
          // onVisible: getChartFG,
          onHide: function() {
            // $('.chart-area').empty();
          }
        })
        .modal('show');
    });
    $('.menu .item').tab();
  }

  $('#calendar').calendar({
    type: 'date',
    onChange: function(date, text) {
      const utcDate = new Date(date);
      console.log(text);
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
      let markupData = data.games.map(game => {
        const {playedStatus} = game.schedule;
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
                                        playedStatus === 'LIVE' ? 'red' : ''
                                      }">${playedStatus}</span><span
                                      class="right floated away-team">${
                                        game.schedule.awayTeam.abbreviation
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
                              }.svg"><div class="meta center aligned time"><span>${game.schedule.startTime.toUpperCase()} MT</span>
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
                              <p class="total-money">Total Bid Amt: $900</p>
                              <p class="num-bids">Total Bids: 15</p>
                          </div>
                      </div>
                      <div class="extra content">
                          <div class="ui two buttons">
                              <div class="ui basic animated fade green button bet home-bet" data-teamId="${
                                game.schedule.homeTeam.id
                              }" tabindex="0">
                                <div class="visible content">Bet Home</div>
                                <div class="hidden content">
                                  <i class="dollar sign icon"></i>
                                </div>
                              </div>
                              <div class="ui basic animated fade red button bet home-bet" data-teamId="${
                                game.schedule.awayTeam.id
                              }" tabindex="0">
                                <div class="visible content">Bet Away</div>
                                <div class="hidden content">
                                  <i class="dollar sign icon"></i>
                                </div>
                              </div>
                          </div>
                      </div>
                  </div>`;
        return markup;
      });
      removeLoader();
      document.getElementById('matches-div').innerHTML = markupData.join('');
      activateListeners();
    }
  }

  function createCharts() {
    Chart.pluginService.register({
      beforeDraw: function(chart) {
        var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;
        ctx.restore();
        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + 'em sans-serif';
        ctx.textBaseline = 'middle';
        var text = chart.config.options.elements.center.text,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.57;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    });

    let markup = `    
            <div class="home-charts">
                <div class="fg-chart charts">
                    <canvas id="home-fg"></canvas>
                </div>
                <div class="three-pt-chart charts">
                    <canvas id="home-3pt"></canvas>
                </div>
                <div class="ft-chart charts">
                    <canvas id="home-ft"></canvas>
                </div>
            </div>

            <div class="away-charts">
                <div class="fg-chart charts" id="home-fg">
                    <canvas id="away-fg"></canvas>
                </div>
                <div class="three-pt-chart charts">
                    <canvas id="away-3pt"></canvas>
                </div>
                <div class="ft-chart charts">
                    <canvas id="away-ft"></canvas>
                </div>
            </div>`;
  }

  function getChartFG() {
    // chart1
    var data = {
      labels: ['Red', 'Blue'],
      datasets: [
        {
          data: [50, 50],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    var promisedDeliveryChart = new Chart(document.getElementById('myChart'), {
      type: 'doughnut',
      data: data,
      options: {
        elements: {
          center: {
            text: '50%' //set as you wish
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

    // chart2
    var data = {
      labels: ['Red', 'Blue'],
      datasets: [
        {
          data: [75, 25],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    var promisedDeliveryChart = new Chart(document.getElementById('myChart2'), {
      type: 'doughnut',
      data: data,
      options: {
        elements: {
          center: {
            text: '75%' //set as you wish
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: '3 Pt %',
          fontSize: 15,
          padding: 8
        }
      }
    });

    var data = {
      labels: ['Red', 'Blue'],
      datasets: [
        {
          data: [75, 25],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    var promisedDeliveryChart = new Chart(document.getElementById('myChart3'), {
      type: 'doughnut',
      data: data,
      options: {
        elements: {
          center: {
            text: '75%' //set as you wish
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: '3 Pt %',
          fontSize: 15,
          padding: 8
        }
      }
    });

    var data = {
      labels: ['Red', 'Blue'],
      datasets: [
        {
          data: [75, 25],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    var promisedDeliveryChart = new Chart(document.getElementById('myChart4'), {
      type: 'doughnut',
      data: data,
      options: {
        elements: {
          center: {
            text: '75%'
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: '3 Pt %',
          fontSize: 15,
          padding: 8
        }
      }
    });

    var data = {
      labels: ['Red', 'Blue'],
      datasets: [
        {
          data: [75, 25],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    var promisedDeliveryChart = new Chart(document.getElementById('myChart5'), {
      type: 'doughnut',
      data: data,
      options: {
        elements: {
          center: {
            text: '75%'
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: '3 Pt %',
          fontSize: 15,
          padding: 8
        }
      }
    });

    var data = {
      labels: ['Red', 'Blue'],
      datasets: [
        {
          data: [75, 25],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    var promisedDeliveryChart = new Chart(document.getElementById('myChart6'), {
      type: 'doughnut',
      data: data,
      options: {
        elements: {
          center: {
            text: '75%' //set as you wish
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: '3 Pt %',
          fontSize: 15,
          padding: 8
        }
      }
    });

    // var data = {
    //   labels: ['Red', 'Blue'],
    //   datasets: [
    //     {
    //       data: [55, 45],
    //       backgroundColor: ['#FF6384', '#36A2EB'],
    //       hoverBackgroundColor: ['#FF6384', '#36A2EB']
    //     }
    //   ]
    // };

    //   Chart.pluginService.register({
    //     beforeDraw: function(chart) {
    //       var width = chart.chart.width,
    //         height = chart.chart.height,
    //         ctx = chart.chart.ctx;

    //       ctx.restore();
    //       var fontSize = (height / 114).toFixed(2);
    //       ctx.font = fontSize + 'em sans-serif';
    //       ctx.textBaseline = 'middle';

    //       let text2 = 'FG';
    //       var text = '55%';
    //       (textX = Math.round((width - ctx.measureText(text).width) / 3)),
    //         (textY = height / 3);

    //       ctx.fillText(text, textX, textY);
    //       ctx.save();
    //     }
    //   });

    // var chart = new Chart(document.getElementById('myChart'), {
    //   type: 'doughnut',
    //   data: data,
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     legend: {
    //       display: false
    //     },
    // title: {
    //   display: true,
    //   text: 'FG%'
    // }
    //   }
    // });
  }

  function getChart3PT() {
    //     var data = {
    //       labels: ['Red', 'Blue'],
    //       datasets: [
    //         {
    //           data: [33, 67],
    //           backgroundColor: ['#FF6384', '#36A2EB'],
    //           hoverBackgroundColor: ['#FF6384', '#36A2EB']
    //         }
    //       ]
    //     };
    //     var chart = new Chart(document.getElementById('myChart2'), {
    //       type: 'doughnut',
    //       data: data,
    //       options: {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         legend: {
    //           display: false
    //         },
    //         title: {
    //           display: true,
    //           text: '3PT%'
    //         }
    //       }
    //     });
  }
});

// Chart.pluginService.register({
//     beforeDraw: function (chart) {
//         if (chart.canvas.id === 'doghnutChart') {
//             let width = chart.chart.width,
//                 height = chart.chart.outerRadius * 2,
//                 ctx = chart.chart.ctx;

//             rewardImg.width = 40;
//             rewardImg.height = 40;
//             let imageX = Math.round((width - rewardImg.width) / 2),
//                 imageY = (height - rewardImg.height) / 2;

//             ctx.drawImage(rewardImg, imageX, imageY, 40, 40);
//             ctx.save();
//         }
//     }
// });
