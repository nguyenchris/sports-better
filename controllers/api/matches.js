$.ajax({
    type: "GET",
    url: "https://api.mysportsfeeds.com/v1.0/pull/nba/2018-2019-regular/scoreboard.json?fordate=20190227",
    dataType: 'json',
    async: true,
    headers: {
        "Authorization": "Basic " + btoa(["a22651a5-e813-4c51-8218-6f25cf"] + ":" + ["Ri2008zzo!"])
    },
    success: function (res) {
        console.log(res);
    }
  });