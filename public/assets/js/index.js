$(document).ready(function() {
  getTodayMatches();
  let games = [];
  let todaysDate = '';

  function getTodayMatches() {
    $.get('/api/matches')
      .then(function(data) {
        // $('#date-picker').attr('placeholder', data.date);
        // $('.date-header').text('TODAY');
        games = [...data.games];
        todaysDate = data.date;
        if (games.length <= 0) {
          return $('.upcomingContainer').append(
            '<h4>No Matches Available</h4>'
          );
        }
        getData(games);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function getData(arr) {
    const newArr = arr.map(game => {
      const { homeTeam, awayTeam, venue } = game.schedule;
      return {
        home: homeTeam.abbreviation,
        away: awayTeam.abbreviation,
        venue: venue.name,
        sliderDate: game.indexDate
      };
    });

    createMarkup(newArr);
    createSliderData(newArr);
  }

  function createSliderData(arr) {
    arr.forEach((game, i) => {
      if (i > 2) {
        return;
      }
      $(`.slider-${i}-teams`).html(`${game.home}<span>VS</span>${game.away}`);
      $(`.slider-${i}-date`).attr('data-date', `${game.sliderDate}`);
    });
    owl5();
  }

  function createMarkup(arr) {
    const markupData = arr.map(game => {
      let markup = `
      <div class="item">
      <div class="col-md-4 col-sm-4 col-xs-12 first">
          <img src="/img/${game.home}.svg" alt="">
          <h4>${game.home}</h4>
      </div>

      <div class="col-md-4 col-sm-4 col-xs-12">
          <span class="date">${todaysDate}</span>
          <span class="vs">VS</span>
          <span>${game.venue}</span>
      </div>
      <div class="col-md-4 col-sm-4 col-xs-12 last">
          <img src="/img/${game.away}.svg" alt="">
          <h4>${game.away}</h4>
      </div>
  </div>
    `;
      return markup;
    });

    const container = `
    <div id="upcoming" class="rs-carousel owl-carousel" data-loop="true" data-items="1" data-margin="30"
            data-autoplay="true" data-autoplay-timeout="5000" data-smart-speed="2000" data-dots="false" data-nav="false"
            data-nav-speed="false" data-mobile-device="1" data-mobile-device-nav="false" data-mobile-device-dots="false"
            data-ipad-device="1" data-ipad-device-nav="false" data-ipad-device-dots="false" data-ipad-device2="1"
            data-ipad-device-nav2="false" data-ipad-device-dots2="false" data-md-device="1" data-md-device-nav="false"
            data-md-device-dots="false">${markupData.join('')}</div>`;

    $('.upcomingContainer').append(container);
    owl();
  }

  function owl() {
    const rscarousel = $('.rs-carousel');
    if (rscarousel.length) {
      $('.rs-carousel').each(function() {
        var owlCarousel = $(this),
          loop = owlCarousel.data('loop'),
          items = owlCarousel.data('items'),
          margin = owlCarousel.data('margin'),
          stagePadding = owlCarousel.data('stage-padding'),
          autoplay = owlCarousel.data('autoplay'),
          autoplayTimeout = owlCarousel.data('autoplay-timeout'),
          smartSpeed = owlCarousel.data('smart-speed'),
          dots = owlCarousel.data('dots'),
          nav = owlCarousel.data('nav'),
          navSpeed = owlCarousel.data('nav-speed'),
          xsDevice = owlCarousel.data('mobile-device'),
          xsDeviceNav = owlCarousel.data('mobile-device-nav'),
          xsDeviceDots = owlCarousel.data('mobile-device-dots'),
          smDevice = owlCarousel.data('ipad-device'),
          smDeviceNav = owlCarousel.data('ipad-device-nav'),
          smDeviceDots = owlCarousel.data('ipad-device-dots'),
          smDevice2 = owlCarousel.data('ipad-device2'),
          smDeviceNav2 = owlCarousel.data('ipad-device-nav2'),
          smDeviceDots2 = owlCarousel.data('ipad-device-dots2'),
          mdDevice = owlCarousel.data('md-device'),
          mdDeviceNav = owlCarousel.data('md-device-nav'),
          mdDeviceDots = owlCarousel.data('md-device-dots');

        owlCarousel.owlCarousel({
          loop: loop ? true : false,
          items: items ? items : 4,
          lazyLoad: true,
          margin: margin ? margin : 0,
          //stagePadding: (stagePadding ? stagePadding : 0),
          autoplay: autoplay ? true : false,
          autoplayTimeout: autoplayTimeout ? autoplayTimeout : 1000,
          smartSpeed: smartSpeed ? smartSpeed : 100,
          dots: dots ? true : false,
          nav: nav ? true : false,
          navText: [
            "<i class='fa fa-angle-left'></i>",
            "<i class='fa fa-angle-right'></i>"
          ],
          navSpeed: navSpeed ? true : false,
          responsiveClass: true,
          responsive: {
            0: {
              items: xsDevice ? xsDevice : 1,
              nav: xsDeviceNav ? true : false,
              dots: xsDeviceDots ? true : false
            },
            768: {
              items: smDevice ? smDevice : 3,
              nav: smDeviceNav ? true : false,
              dots: smDeviceDots ? true : false
            },
            480: {
              items: smDevice2 ? smDevice : 2,
              nav: smDeviceNav2 ? true : false,
              dots: smDeviceDots2 ? true : false
            },
            992: {
              items: mdDevice ? mdDevice : 4,
              nav: mdDeviceNav ? true : false,
              dots: mdDeviceDots ? true : false
            }
          }
        });
      });
    }
  }

  function owl5() {
    var owl5 = $('#slider-five');
    if (owl5.length) {
      console.log('hi');
      // Carousel initialization
      owl5.owlCarousel({
        animateIn: 'fadeIn',
        items: 1,
        autoplay: true,
        loop: true,
        dots: true,
        autoplayTimeout: 8000
      });
    }
    // add animate.css class(es) to the elements to be animated
    function setAnimation(_elem, _InOut) {
      // Store all animationend event name in a string.
      // cf animate.css documentation
      const animationEndEvent =
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

      _elem.each(function() {
        var $elem = $(this);
        var $animationType = 'animated ' + $elem.data('animation-' + _InOut);

        $elem.addClass($animationType).one(animationEndEvent, function() {
          $elem.removeClass($animationType); // remove animate.css Class at the end of the animations
        });
      });
    }

    // Fired before current slide change
    owl5.on('change.owl.carousel', function(event) {
      var $currentItem = $('.owl-item', owl5).eq(event.item.index);
      var $elemsToanim = $currentItem.find('[data-animation-out]');
      setAnimation($elemsToanim, 'out');
    });

    // Fired after current slide has been changed
    owl5.on('changed.owl.carousel', function(event) {
      var $currentItem = $('.owl-item', owl5).eq(event.item.index);
      var $elemsToanim = $currentItem.find('[data-animation-in]');
      setAnimation($elemsToanim, 'in');
    });

    var CountTimer = $('.CountDownTimer');
    if (CountTimer.length) {
      $('.CountDownTimer').TimeCircles({
        fg_width: 0.03,
        bg_width: 0.8,
        circle_bg_color: '#ffffff',
        time: {
          Days: {
            color: '#fbc02d'
          },
          Hours: {
            color: '#fbc02d'
          },
          Minutes: {
            color: '#fbc02d'
          },
          Seconds: {
            color: '#fbc02d'
          }
        }
      });
    }
  }
});
