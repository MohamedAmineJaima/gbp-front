(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _index = require('../../components/select-filter/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../components/top-header/index.js');

var _index4 = _interopRequireDefault(_index3);

var _cardSlider = require('../../components/card/card-slider.js');

var _cardSlider2 = _interopRequireDefault(_cardSlider);

var _dateSlider = require('../../components/date-slider/date-slider.js');

var _dateSlider2 = _interopRequireDefault(_dateSlider);

var _index5 = require('../../components/logo-slider/index.js');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('../../components/finance/index.js');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('../../components/nos-banques/index.js');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('../../components/home-slider/index.js');

var _index12 = _interopRequireDefault(_index11);

var _index13 = require('../../components/besoin-aide/index.js');

var _index14 = _interopRequireDefault(_index13);

var _index15 = require('../../components/swipebox/index.js');

var _index16 = _interopRequireDefault(_index15);

var _index17 = require('../../components/date-filter/index.js');

var _index18 = _interopRequireDefault(_index17);

var _index19 = require('../../components/article-slider/index.js');

var _index20 = _interopRequireDefault(_index19);

var _cardRapport = require('../../components/card/card-rapport.js');

var _cardRapport2 = _interopRequireDefault(_cardRapport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
	(0, _index2.default)();
	(0, _index4.default)();
	(0, _cardSlider2.default)();
	(0, _dateSlider2.default)();
	(0, _index6.default)();
	(0, _index8.default)();
	(0, _index10.default)();
	(0, _index12.default)();
	(0, _index14.default)();
	(0, _index16.default)();
	(0, _index18.default)();
	(0, _index20.default)();
	(0, _cardRapport2.default)();
});

},{"../../components/article-slider/index.js":2,"../../components/besoin-aide/index.js":3,"../../components/card/card-rapport.js":4,"../../components/card/card-slider.js":5,"../../components/date-filter/index.js":6,"../../components/date-slider/date-slider.js":7,"../../components/finance/index.js":8,"../../components/home-slider/index.js":9,"../../components/logo-slider/index.js":10,"../../components/nos-banques/index.js":11,"../../components/select-filter/index.js":12,"../../components/swipebox/index.js":13,"../../components/top-header/index.js":14}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.article-slider').length) {

    if ($(window).width() > 991) {
      articleSlider(0);
    } else {
      articleSlider(32);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 991) {
        articleSlider(0);
      } else {
        articleSlider(32);
      }
    });
  }

  function articleSlider(stagePadding) {
    $('.article-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 10,
      dots: true,
      nav: true,
      loop: false,
      responsive: {
        0: {
          items: 1
        },
        992: {
          items: 3
        }
      }
    });
  }
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.besoin-aide').length) {

		$('.besoin-aide').on('click', function () {
			$('.questions').toggleClass('d-none');
		});
	}
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.card--rapport-right').length) {

		if ($(window).width() > 768) {
			rapportSlider(0);
		} else {
			rapportSlider(0);
		}

		$(window).on('resize', function () {
			if ($(window).width() > 768) {
				rapportSlider(0);
			} else {
				rapportSlider(0);
			}
		});
	}

	function rapportSlider(stagePadding) {
		var owl = $('.card--rapport-right.owl-carousel').owlCarousel({
			stagePadding: stagePadding,
			margin: 0,
			dots: false,
			nav: false,
			loop: true,
			responsive: {
				0: {
					items: 1
				}
			}
		});

		$('.card--rapport-right .wrapper_btn .next').on('click', function () {
			owl.trigger('next.owl.carousel');
		});

		// Go to the previous item
		$('.card--rapport-right .wrapper_btn .prev').on('click', function () {
			// With optional speed parameter
			// Parameters has to be in square bracket '[]'
			owl.trigger('prev.owl.carousel');
		});
	}
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {

  if ($('.card-slider-wrapper').length) {

    if ($(window).width() > 768) {
      cardSliderPage(16);
    } else {
      cardSliderPage(0);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 768) {
        cardSliderPage(16);
      } else {
        cardSliderPage(0);
      }
    });
  }

  function cardSliderPage(stagePadding) {
    $('.card-slider-wrapper.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 16,
      dots: true,
      nav: true,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 2
        },
        992: {
          items: 4
        }
      }
    });
  }
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

exports.default = function () {
		if ($('.date-filter').length) {

				$('.start .date-filter_arrows a:first-child').on('click', function (e) {
						e.preventDefault();

						console.log($('.start .date-filter_month input').val());
				});

				$('.start .date-filter_arrows a:last-child').on('click', function () {});
		}
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.date-slider').length) {

    if ($(window).width() > 768) {
      dateSliderPage(0);
    } else {
      dateSliderPage(0);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 768) {
        dateSliderPage(0);
      } else {
        dateSliderPage(0);
      }
    });
  }

  function dateSliderPage(stagePadding) {
    $('.date-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 5,
      dots: true,
      nav: true,
      responsive: {
        0: {
          items: 4
        },
        768: {
          items: 10
        },
        992: {
          items: 15
        }
      }
    });
  }
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.finance.length')) {

		$('.finance').on('click', function () {

			var currentItem = $(this);

			$('.finance').each(function (index, el) {

				if ($(el)[0] !== currentItem[0]) {
					$(el).removeClass('open');
				}
			});

			$(this).toggleClass('open');
		});
	}
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    if ($('.home-slider').length) {

        if ($(window).width() > 768) {

            setHeightSlider();
            homeSlider(0);
        } else {
            homeSlider(0);
        }

        $(window).on('resize', function () {

            if ($(window).width() > 768) {
                $('.home-slider').owlCarousel('destroy');
                homeSlider(0);
            } else {
                $('.home-slider').owlCarousel('destroy');
                homeSlider(0);
            }
        });
    }

    function setHeightSlider() {
        var windowHeight = $(window).height();
        var topHeaderHeight = $('.top-header').height();
        var headerHeight = $('.header').height();

        var sliderHeight = windowHeight - topHeaderHeight - headerHeight;

        var slider = $('.home-slider');
        var sliderItem = $('.home-slider_item');

        slider.css('max-height', sliderHeight);
        sliderItem.css('max-height', sliderHeight);
    }

    function homeSlider(stagePadding) {
        var owl = $('.home-slider.owl-carousel').owlCarousel({
            stagePadding: stagePadding,
            margin: 0,
            dots: true,
            nav: false,
            loop: true,
            navSpeed: 400,
            autoplay: true,
            autoplayTimeout: 5000,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 1,
                    dotsData: true
                }
            }
        });
    }
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.logo-slider').length) {

    if ($(window).width() > 768) {
      logoSlider(0);
    } else {
      logoSlider(0);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 768) {
        logoSlider(0);
      } else {
        logoSlider(0);
      }
    });
  }

  function logoSlider(stagePadding) {
    $('.logo-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 45,
      dots: true,
      nav: true,
      loop: true,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 4
        },
        992: {
          items: 5
        }
      }
    });
  }
};

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    var sliderIndex;

    if ($('.nos-banques').length) {
        handleEventListeners();
    }

    if ($('.nos-banques .owl-carousel').length) {

        if ($(window).width() > 768) {
            banquesSlider(0);
        } else {
            banquesSlider(0);
        }

        $(window).on('resize', function () {

            if ($(window).width() > 768) {
                $('.nos-banques .owl-carousel').owlCarousel('destroy');
                banquesSlider(0);
            } else {
                $('.nos-banques .owl-carousel').owlCarousel('destroy');
                banquesSlider(0);
            }
        });
    }

    function removeHash() {
        history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    function banquesSlider(stagePadding) {
        var owl = $('.nos-banques .owl-carousel').owlCarousel({
            stagePadding: stagePadding,
            margin: 0,
            dots: true,
            nav: true,
            loop: true,
            URLhashListener: true,
            navSpeed: 1000,
            responsive: {
                0: {
                    items: 1
                }
            }
        });

        owl.on("drag.owl.carousel", function (event) {

            if (event.relatedTarget['_drag']['direction']) {

                var indexBeforeChange = event.page.index;

                sliderIndex = indexBeforeChange;
            }
        });

        owl.on("dragged.owl.carousel", function (event) {

            var indexAfterChange = event.page.index;

            if (event.relatedTarget['_drag']['direction']) {

                if (indexAfterChange !== sliderIndex) {
                    if (event.relatedTarget['_drag']['direction'] === "left") {
                        next();
                    } else {
                        prev();
                    }
                }
            }

            //console.log(event)
        });

        $('.owl-next').on('click', function () {
            next();
        });

        $('.owl-prev').on('click', function () {
            prev();
        });

        function next() {
            var currentItem = $('.nos-banques_links .item.active');

            currentItem.removeClass('active');

            if (currentItem.is(':last-child')) {
                $('.nos-banques_links .item:first-child').addClass('active');
            } else {
                currentItem.next().addClass('active');
            }
        }

        function prev() {
            var currentItem = $('.nos-banques_links .item.active');

            currentItem.removeClass('active');

            if (currentItem.is(':first-child')) {
                $('.nos-banques_links .item:last-child').addClass('active');
            } else {
                currentItem.prev().addClass('active');
            }
        }
    }

    function handleEventListeners() {

        $('.nos-banques_links .item:first-child').addClass('active');

        $('.nos-banques_links .item').on('click', function () {

            var clickedItem = $(this);

            if (!clickedItem.hasClass('active')) {
                $('.nos-banques_links .item.active').removeClass('active');
                clickedItem.addClass('active');
            }
        });
    }
};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	$('select.nice-select').niceSelect();
};

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.swipebox').length) {
		$('.swipebox').swipebox();
	}
};

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    $('.top-header_list .list, .top-header_list .lang').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('open');
        $(this).find('.dropdown').toggleClass('d-none');
    });

    $('*').on('click', function (e) {

        if (!$.contains($('.top-header_list')[0], $(e.target)[0]) && ($('.lang').hasClass('open') || $('.list').hasClass('open'))) {

            closeDropdowns();
        }
    });

    function closeDropdowns() {
        if ($('.top-header_list .list').hasClass('open')) {
            $('.top-header_list .list').toggleClass('open');
            $('.top-header_list .list').find('.dropdown').toggleClass('d-none');
        }

        if ($('.top-header_list .lang').hasClass('open')) {
            $('.top-header_list .lang').toggleClass('open');
            $('.top-header_list .lang').find('.dropdown').toggleClass('d-none');
        }
    }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2pzL21haW4uanMiLCJzcmMvY29tcG9uZW50cy9hcnRpY2xlLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2Jlc29pbi1haWRlL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLXJhcHBvcnQuanMiLCJzcmMvY29tcG9uZW50cy9jYXJkL2NhcmQtc2xpZGVyLmpzIiwic3JjL2NvbXBvbmVudHMvZGF0ZS1maWx0ZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9kYXRlLXNsaWRlci9kYXRlLXNsaWRlci5qcyIsInNyYy9jb21wb25lbnRzL2ZpbmFuY2UvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9ob21lLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2xvZ28tc2xpZGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvbm9zLWJhbnF1ZXMvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QtZmlsdGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvc3dpcGVib3gvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy90b3AtaGVhZGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFXO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FkRDs7Ozs7Ozs7O2tCQ2ZlLFlBQVc7QUFDekIsTUFBSSxFQUFFLGlCQUFGLEVBQXFCLE1BQXpCLEVBQWlDOztBQUVoQyxR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QWtEO0FBQzlDLGNBQUUsd0JBQUYsRUFBNEIsV0FBNUIsQ0FBd0MsTUFBeEM7QUFDQSxjQUFFLHdCQUFGLEVBQTRCLElBQTVCLENBQWlDLFdBQWpDLEVBQThDLFdBQTlDLENBQTBELFFBQTFEO0FBQ0g7QUFDSjtBQUNKLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBzZWxlY3QgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9zZWxlY3QtZmlsdGVyL2luZGV4LmpzJztcclxuaW1wb3J0IHRvcEhlYWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL3RvcC1oZWFkZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgY2FyZFNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NhcmQvY2FyZC1zbGlkZXIuanMnO1xyXG5pbXBvcnQgZGF0ZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2RhdGUtc2xpZGVyL2RhdGUtc2xpZGVyLmpzJztcclxuaW1wb3J0IGxvZ29TbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9sb2dvLXNsaWRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBmaW5hbmNlIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZmluYW5jZS9pbmRleC5qcyc7XHJcbmltcG9ydCBiYW5xdWVzU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbm9zLWJhbnF1ZXMvaW5kZXguanMnO1xyXG5pbXBvcnQgaG9tZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2hvbWUtc2xpZGVyL2luZGV4LmpzJztcclxuaW1wb3J0IGJlc29pbkFpZGUgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9iZXNvaW4tYWlkZS9pbmRleC5qcyc7XHJcbmltcG9ydCBzd2lwZWJveCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3N3aXBlYm94L2luZGV4LmpzJztcclxuaW1wb3J0IGRhdGVmaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kYXRlLWZpbHRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBhcnRpY2xlU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYXJ0aWNsZS1zbGlkZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgY2FyZFJhcHBvcnQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtcmFwcG9ydC5qcyc7XHJcblxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblx0c2VsZWN0KCk7XHJcblx0dG9wSGVhZGVyKCk7XHJcblx0Y2FyZFNsaWRlcigpO1xyXG5cdGRhdGVTbGlkZXIoKTtcclxuXHRsb2dvU2xpZGVyKCk7XHJcblx0ZmluYW5jZSgpO1xyXG5cdGJhbnF1ZXNTbGlkZXIoKTtcclxuXHRob21lU2xpZGVyKCk7XHJcblx0YmVzb2luQWlkZSgpO1xyXG5cdHN3aXBlYm94KCk7XHJcblx0ZGF0ZWZpbHRlcigpO1xyXG5cdGFydGljbGVTbGlkZXIoKTtcclxuXHRjYXJkUmFwcG9ydCgpO1xyXG59KTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuXHRpZiAoJCgnLmFydGljbGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcblx0XHRcdGFydGljbGVTbGlkZXIoMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhcnRpY2xlU2xpZGVyKDMyKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcblx0XHRcdFx0YXJ0aWNsZVNsaWRlcigwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhcnRpY2xlU2xpZGVyKDMyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYXJ0aWNsZVNsaWRlcihzdGFnZVBhZGRpbmcpIHtcclxuICAgICAgICAkKCcuYXJ0aWNsZS1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiAzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5iZXNvaW4tYWlkZScpLmxlbmd0aCkge1xyXG5cclxuXHRcdCQoJy5iZXNvaW4tYWlkZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLnF1ZXN0aW9ucycpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmNhcmQtLXJhcHBvcnQtcmlnaHQnKS5sZW5ndGgpIHtcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0cmFwcG9ydFNsaWRlcigwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJhcHBvcnRTbGlkZXIoMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRcdHJhcHBvcnRTbGlkZXIoMCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmFwcG9ydFNsaWRlcigwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmFwcG9ydFNsaWRlcihzdGFnZVBhZGRpbmcpIHtcclxuICAgICAgICB2YXIgb3dsID0gJCgnLmNhcmQtLXJhcHBvcnQtcmlnaHQub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAwLFxyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5jYXJkLS1yYXBwb3J0LXJpZ2h0IC53cmFwcGVyX2J0biAubmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgIG93bC50cmlnZ2VyKCduZXh0Lm93bC5jYXJvdXNlbCcpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gR28gdG8gdGhlIHByZXZpb3VzIGl0ZW1cclxuXHRcdCQoJy5jYXJkLS1yYXBwb3J0LXJpZ2h0IC53cmFwcGVyX2J0biAucHJldicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgIC8vIFdpdGggb3B0aW9uYWwgc3BlZWQgcGFyYW1ldGVyXHJcblx0XHQgICAgLy8gUGFyYW1ldGVycyBoYXMgdG8gYmUgaW4gc3F1YXJlIGJyYWNrZXQgJ1tdJ1xyXG5cdFx0ICAgIG93bC50cmlnZ2VyKCdwcmV2Lm93bC5jYXJvdXNlbCcpO1xyXG5cdFx0fSk7XHJcblxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRpZiAoJCgnLmNhcmQtc2xpZGVyLXdyYXBwZXInKS5sZW5ndGgpIHtcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0Y2FyZFNsaWRlclBhZ2UoMTYpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y2FyZFNsaWRlclBhZ2UoMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRcdGNhcmRTbGlkZXJQYWdlKDE2KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjYXJkU2xpZGVyUGFnZSgwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjYXJkU2xpZGVyUGFnZShzdGFnZVBhZGRpbmcpIHtcclxuICAgICAgICAkKCcuY2FyZC1zbGlkZXItd3JhcHBlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDE2LFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogMlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDk5Mjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiA0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5kYXRlLWZpbHRlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdCQoJy5zdGFydCAuZGF0ZS1maWx0ZXJfYXJyb3dzIGE6Zmlyc3QtY2hpbGQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRjb25zb2xlLmxvZygkKCcuc3RhcnQgLmRhdGUtZmlsdGVyX21vbnRoIGlucHV0JykudmFsKCkpO1xyXG5cdFx0XHRcclxuXHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcuc3RhcnQgLmRhdGUtZmlsdGVyX2Fycm93cyBhOmxhc3QtY2hpbGQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuZGF0ZS1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0ZGF0ZVNsaWRlclBhZ2UoMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkYXRlU2xpZGVyUGFnZSgwKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0ZGF0ZVNsaWRlclBhZ2UoMCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZGF0ZVNsaWRlclBhZ2UoMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGRhdGVTbGlkZXJQYWdlKHN0YWdlUGFkZGluZykge1xyXG4gICAgICAgICQoJy5kYXRlLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDUsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiA0XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiAxMFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDk5Mjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxNVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuZmluYW5jZS5sZW5ndGgnKSkge1xyXG5cclxuXHRcdCQoJy5maW5hbmNlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0dmFyIGN1cnJlbnRJdGVtID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdCQoJy5maW5hbmNlJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCQoZWwpWzBdICE9PSBjdXJyZW50SXRlbVswXSkge1xyXG5cdFx0XHRcdFx0XHQkKGVsKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmhvbWUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblxyXG5cdFx0XHRzZXRIZWlnaHRTbGlkZXIoKTtcclxuICAgICAgICAgICAgaG9tZVNsaWRlcigwKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaG9tZVNsaWRlcigwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ob21lLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBob21lU2xpZGVyKDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLmhvbWUtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGhvbWVTbGlkZXIoMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEhlaWdodFNsaWRlcigpIHtcclxuXHRcdHZhciB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblx0XHR2YXIgdG9wSGVhZGVySGVpZ2h0ID0gJCgnLnRvcC1oZWFkZXInKS5oZWlnaHQoKTtcclxuXHRcdHZhciBoZWFkZXJIZWlnaHQgPSAkKCcuaGVhZGVyJykuaGVpZ2h0KCk7XHJcblxyXG5cdFx0dmFyIHNsaWRlckhlaWdodCA9IHdpbmRvd0hlaWdodCAtIHRvcEhlYWRlckhlaWdodCAtIGhlYWRlckhlaWdodDtcclxuXHJcblx0XHR2YXIgc2xpZGVyID0gJCgnLmhvbWUtc2xpZGVyJyk7XHJcblx0XHR2YXIgc2xpZGVySXRlbSA9ICQoJy5ob21lLXNsaWRlcl9pdGVtJyk7XHJcblxyXG5cdFx0c2xpZGVyLmNzcygnbWF4LWhlaWdodCcsIHNsaWRlckhlaWdodCk7XHJcblx0XHRzbGlkZXJJdGVtLmNzcygnbWF4LWhlaWdodCcsIHNsaWRlckhlaWdodCk7XHJcblx0XHRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGhvbWVTbGlkZXIoc3RhZ2VQYWRkaW5nKSB7XHJcblx0XHR2YXIgb3dsID0gJCgnLmhvbWUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMCxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2U3BlZWQ6IDQwMCxcclxuICAgICAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcblx0XHRcdGF1dG9wbGF5VGltZW91dDo1MDAwLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDEsXHJcbiAgICAgICAgICAgICAgICBcdGRvdHNEYXRhOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcubG9nby1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0bG9nb1NsaWRlcigwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxvZ29TbGlkZXIoMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRcdGxvZ29TbGlkZXIoMCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bG9nb1NsaWRlcigwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbG9nb1NsaWRlcihzdGFnZVBhZGRpbmcpIHtcclxuICAgICAgICAkKCcubG9nby1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiA0NSxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIHNsaWRlckluZGV4O1xyXG5cclxuICAgIGlmICgkKCcubm9zLWJhbnF1ZXMnKS5sZW5ndGgpIHtcclxuICAgICAgICBoYW5kbGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLmxlbmd0aCkge1xyXG5cclxuICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuICAgICAgICAgICAgYmFucXVlc1NsaWRlcigwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBiYW5xdWVzU2xpZGVyKDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG4gICAgICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzIC5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgYmFucXVlc1NsaWRlcigwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGFzaCAoKSB7IFxyXG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCcnLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYmFucXVlc1NsaWRlcihzdGFnZVBhZGRpbmcpIHtcclxuICAgICAgICB2YXIgb3dsID0gJCgnLm5vcy1iYW5xdWVzIC5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgVVJMaGFzaExpc3RlbmVyOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXZTcGVlZDogMTAwMCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG93bC5vbihcImRyYWcub3dsLmNhcm91c2VsXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXZlbnQucmVsYXRlZFRhcmdldFsnX2RyYWcnXVsnZGlyZWN0aW9uJ10pIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXhCZWZvcmVDaGFuZ2UgPSBldmVudC5wYWdlLmluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgIHNsaWRlckluZGV4ID0gaW5kZXhCZWZvcmVDaGFuZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG93bC5vbihcImRyYWdnZWQub3dsLmNhcm91c2VsXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW5kZXhBZnRlckNoYW5nZSA9IGV2ZW50LnBhZ2UuaW5kZXg7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXZlbnQucmVsYXRlZFRhcmdldFsnX2RyYWcnXVsnZGlyZWN0aW9uJ10pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXhBZnRlckNoYW5nZSAhPT0gc2xpZGVySW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQucmVsYXRlZFRhcmdldFsnX2RyYWcnXVsnZGlyZWN0aW9uJ10gPT09IFwibGVmdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLm93bC1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLm93bC1wcmV2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHByZXYoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbmV4dCgpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRJdGVtID0gJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtLmFjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgY3VycmVudEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRJdGVtLmlzKCc6bGFzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW06Zmlyc3QtY2hpbGQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS5uZXh0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcmV2KCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudEl0ZW0gPSAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW0uYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0uaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW06bGFzdC1jaGlsZCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLnByZXYoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCkge1xyXG5cclxuICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW06Zmlyc3QtY2hpbGQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGNsaWNrZWRJdGVtID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY2xpY2tlZEl0ZW0uaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW0uYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgY2xpY2tlZEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0JCgnc2VsZWN0Lm5pY2Utc2VsZWN0JykubmljZVNlbGVjdCgpO1xyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuc3dpcGVib3gnKS5sZW5ndGgpIHtcclxuXHRcdCQoJy5zd2lwZWJveCcpLnN3aXBlYm94KCk7XHJcblx0fVxyXG5cdFxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0LCAudG9wLWhlYWRlcl9saXN0IC5sYW5nJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuZHJvcGRvd24nKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcqJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICBpZiAoISQuY29udGFpbnMoJCgnLnRvcC1oZWFkZXJfbGlzdCcpWzBdLCAkKGUudGFyZ2V0KVswXSkgJiYgXHJcbiAgICAgICAgICAgICgkKCcubGFuZycpLmhhc0NsYXNzKCdvcGVuJykgfHxcclxuICAgICAgICAgICAgJCgnLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSApIHtcclxuXHJcbiAgICAgICAgICAgIGNsb3NlRHJvcGRvd25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0JykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5sYW5nJykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==
