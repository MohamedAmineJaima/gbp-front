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

var _index21 = require('../../components/popup-search/index.js');

var _index22 = _interopRequireDefault(_index21);

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
	(0, _index22.default)();
});

},{"../../components/article-slider/index.js":2,"../../components/besoin-aide/index.js":3,"../../components/card/card-rapport.js":4,"../../components/card/card-slider.js":5,"../../components/date-filter/index.js":6,"../../components/date-slider/date-slider.js":7,"../../components/finance/index.js":8,"../../components/home-slider/index.js":9,"../../components/logo-slider/index.js":10,"../../components/nos-banques/index.js":11,"../../components/popup-search/index.js":12,"../../components/select-filter/index.js":13,"../../components/swipebox/index.js":14,"../../components/top-header/index.js":15}],2:[function(require,module,exports){
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
	if ($('.header_search').length) {
		addEventListeners();
	}

	function addEventListeners() {
		$('.header_search').on('click', function () {
			$('.page-content').addClass('d-none');
			$('.popup-search').removeClass('d-none');
		});

		$('.close-wrapper').on('click', function () {
			$('.page-content').removeClass('d-none');
			$('.popup-search').addClass('d-none');
		});
	}
};

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	$('select.nice-select').niceSelect();
};

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.swipebox').length) {
		$('.swipebox').swipebox();
	}
};

},{}],15:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2pzL21haW4uanMiLCJzcmMvY29tcG9uZW50cy9hcnRpY2xlLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2Jlc29pbi1haWRlL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLXJhcHBvcnQuanMiLCJzcmMvY29tcG9uZW50cy9jYXJkL2NhcmQtc2xpZGVyLmpzIiwic3JjL2NvbXBvbmVudHMvZGF0ZS1maWx0ZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9kYXRlLXNsaWRlci9kYXRlLXNsaWRlci5qcyIsInNyYy9jb21wb25lbnRzL2ZpbmFuY2UvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9ob21lLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2xvZ28tc2xpZGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvbm9zLWJhbnF1ZXMvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9wb3B1cC1zZWFyY2gvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QtZmlsdGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvc3dpcGVib3gvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy90b3AtaGVhZGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVc7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBZkQ7Ozs7Ozs7OztrQkNoQmUs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QyxFQUFFLFFBQUYsQ0FBVyxFQUFFLGtCQUFGLEVBQXNCLENBQXRCLENBQVgsRUFBcUMsRUFBRSxFQUFFLE1BQUosRUFBWSxDQUFaLENBQXJDLENBQUQsS0FDQyxFQUFFLE9BQUYsRUFBVyxRQUFYLENBQW9CLE1BQXBCLEtBQ0QsRUFBRSxPQUFGLEVBQVcsUUFBWCxDQUFvQixNQUFwQixDQUZBLENBQUosRUFFbUM7O0FBRS9CO0FBQ0g7QUFDSixLQVJEOztBQVVBLGFBQVMsY0FBVCxHQUEwQjtBQUN0QixZQUFJLEVBQUUsd0JBQUYsRUFBNEIsUUFBNUIsQ0FBcUMsTUFBckMsQ0FBSixFQUFrRDtBQUM5QyxjQUFFLHdCQUFGLEVBQTRCLFdBQTVCLENBQXdDLE1BQXhDO0FBQ0EsY0FBRSx3QkFBRixFQUE0QixJQUE1QixDQUFpQyxXQUFqQyxFQUE4QyxXQUE5QyxDQUEwRCxRQUExRDtBQUNIOztBQUVELFlBQUksRUFBRSx3QkFBRixFQUE0QixRQUE1QixDQUFxQyxNQUFyQyxDQUFKLEVBQWtEO0FBQzlDLGNBQUUsd0JBQUYsRUFBNEIsV0FBNUIsQ0FBd0MsTUFBeEM7QUFDQSxjQUFFLHdCQUFGLEVBQTRCLElBQTVCLENBQWlDLFdBQWpDLEVBQThDLFdBQTlDLENBQTBELFFBQTFEO0FBQ0g7QUFDSjtBQUNKLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBzZWxlY3QgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9zZWxlY3QtZmlsdGVyL2luZGV4LmpzJztcclxuaW1wb3J0IHRvcEhlYWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL3RvcC1oZWFkZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgY2FyZFNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NhcmQvY2FyZC1zbGlkZXIuanMnO1xyXG5pbXBvcnQgZGF0ZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2RhdGUtc2xpZGVyL2RhdGUtc2xpZGVyLmpzJztcclxuaW1wb3J0IGxvZ29TbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9sb2dvLXNsaWRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBmaW5hbmNlIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZmluYW5jZS9pbmRleC5qcyc7XHJcbmltcG9ydCBiYW5xdWVzU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbm9zLWJhbnF1ZXMvaW5kZXguanMnO1xyXG5pbXBvcnQgaG9tZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2hvbWUtc2xpZGVyL2luZGV4LmpzJztcclxuaW1wb3J0IGJlc29pbkFpZGUgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9iZXNvaW4tYWlkZS9pbmRleC5qcyc7XHJcbmltcG9ydCBzd2lwZWJveCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3N3aXBlYm94L2luZGV4LmpzJztcclxuaW1wb3J0IGRhdGVmaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kYXRlLWZpbHRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBhcnRpY2xlU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYXJ0aWNsZS1zbGlkZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgY2FyZFJhcHBvcnQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtcmFwcG9ydC5qcyc7XHJcbmltcG9ydCBwb3B1cFNlYXJjaCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3BvcHVwLXNlYXJjaC9pbmRleC5qcyc7XHJcblxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblx0c2VsZWN0KCk7XHJcblx0dG9wSGVhZGVyKCk7XHJcblx0Y2FyZFNsaWRlcigpO1xyXG5cdGRhdGVTbGlkZXIoKTtcclxuXHRsb2dvU2xpZGVyKCk7XHJcblx0ZmluYW5jZSgpO1xyXG5cdGJhbnF1ZXNTbGlkZXIoKTtcclxuXHRob21lU2xpZGVyKCk7XHJcblx0YmVzb2luQWlkZSgpO1xyXG5cdHN3aXBlYm94KCk7XHJcblx0ZGF0ZWZpbHRlcigpO1xyXG5cdGFydGljbGVTbGlkZXIoKTtcclxuXHRjYXJkUmFwcG9ydCgpO1xyXG5cdHBvcHVwU2VhcmNoKCk7XHJcbn0pOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG5cdGlmICgkKCcuYXJ0aWNsZS1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuXHRcdFx0YXJ0aWNsZVNsaWRlcigwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFydGljbGVTbGlkZXIoMzIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuXHRcdFx0XHRhcnRpY2xlU2xpZGVyKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFydGljbGVTbGlkZXIoMzIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhcnRpY2xlU2xpZGVyKHN0YWdlUGFkZGluZykge1xyXG4gICAgICAgICQoJy5hcnRpY2xlLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDEwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmJlc29pbi1haWRlJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0JCgnLmJlc29pbi1haWRlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcucXVlc3Rpb25zJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCcpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRyYXBwb3J0U2xpZGVyKDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmFwcG9ydFNsaWRlcigwKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0cmFwcG9ydFNsaWRlcigwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyYXBwb3J0U2xpZGVyKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByYXBwb3J0U2xpZGVyKHN0YWdlUGFkZGluZykge1xyXG4gICAgICAgIHZhciBvd2wgPSAkKCcuY2FyZC0tcmFwcG9ydC1yaWdodC5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLmNhcmQtLXJhcHBvcnQtcmlnaHQgLndyYXBwZXJfYnRuIC5uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHQgICAgb3dsLnRyaWdnZXIoJ25leHQub3dsLmNhcm91c2VsJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBHbyB0byB0aGUgcHJldmlvdXMgaXRlbVxyXG5cdFx0JCgnLmNhcmQtLXJhcHBvcnQtcmlnaHQgLndyYXBwZXJfYnRuIC5wcmV2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHQgICAgLy8gV2l0aCBvcHRpb25hbCBzcGVlZCBwYXJhbWV0ZXJcclxuXHRcdCAgICAvLyBQYXJhbWV0ZXJzIGhhcyB0byBiZSBpbiBzcXVhcmUgYnJhY2tldCAnW10nXHJcblx0XHQgICAgb3dsLnRyaWdnZXIoJ3ByZXYub3dsLmNhcm91c2VsJyk7XHJcblx0XHR9KTtcclxuXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGlmICgkKCcuY2FyZC1zbGlkZXItd3JhcHBlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRjYXJkU2xpZGVyUGFnZSgxNik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjYXJkU2xpZGVyUGFnZSgwKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0Y2FyZFNsaWRlclBhZ2UoMTYpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNhcmRTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNhcmRTbGlkZXJQYWdlKHN0YWdlUGFkZGluZykge1xyXG4gICAgICAgICQoJy5jYXJkLXNsaWRlci13cmFwcGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTYsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiAyXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmRhdGUtZmlsdGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0JCgnLnN0YXJ0IC5kYXRlLWZpbHRlcl9hcnJvd3MgYTpmaXJzdC1jaGlsZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKCQoJy5zdGFydCAuZGF0ZS1maWx0ZXJfbW9udGggaW5wdXQnKS52YWwoKSk7XHJcblx0XHRcdFxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5zdGFydCAuZGF0ZS1maWx0ZXJfYXJyb3dzIGE6bGFzdC1jaGlsZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5kYXRlLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRkYXRlU2xpZGVyUGFnZSgwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRkYXRlU2xpZGVyUGFnZSgwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkYXRlU2xpZGVyUGFnZSgwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZGF0ZVNsaWRlclBhZ2Uoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmRhdGUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogNSxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDEwXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDE1XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5maW5hbmNlLmxlbmd0aCcpKSB7XHJcblxyXG5cdFx0JCgnLmZpbmFuY2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHR2YXIgY3VycmVudEl0ZW0gPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0JCgnLmZpbmFuY2UnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWwpIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoJChlbClbMF0gIT09IGN1cnJlbnRJdGVtWzBdKSB7XHJcblx0XHRcdFx0XHRcdCQoZWwpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuaG9tZS1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHJcblx0XHRcdHNldEhlaWdodFNsaWRlcigpO1xyXG4gICAgICAgICAgICBob21lU2xpZGVyKDApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBob21lU2xpZGVyKDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG4gICAgICAgICAgICAgICAgJCgnLmhvbWUtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGhvbWVTbGlkZXIoMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuaG9tZS1zbGlkZXInKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgaG9tZVNsaWRlcigwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SGVpZ2h0U2xpZGVyKCkge1xyXG5cdFx0dmFyIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHRcdHZhciB0b3BIZWFkZXJIZWlnaHQgPSAkKCcudG9wLWhlYWRlcicpLmhlaWdodCgpO1xyXG5cdFx0dmFyIGhlYWRlckhlaWdodCA9ICQoJy5oZWFkZXInKS5oZWlnaHQoKTtcclxuXHJcblx0XHR2YXIgc2xpZGVySGVpZ2h0ID0gd2luZG93SGVpZ2h0IC0gdG9wSGVhZGVySGVpZ2h0IC0gaGVhZGVySGVpZ2h0O1xyXG5cclxuXHRcdHZhciBzbGlkZXIgPSAkKCcuaG9tZS1zbGlkZXInKTtcclxuXHRcdHZhciBzbGlkZXJJdGVtID0gJCgnLmhvbWUtc2xpZGVyX2l0ZW0nKTtcclxuXHJcblx0XHRzbGlkZXIuY3NzKCdtYXgtaGVpZ2h0Jywgc2xpZGVySGVpZ2h0KTtcclxuXHRcdHNsaWRlckl0ZW0uY3NzKCdtYXgtaGVpZ2h0Jywgc2xpZGVySGVpZ2h0KTtcclxuXHRcdFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaG9tZVNsaWRlcihzdGFnZVBhZGRpbmcpIHtcclxuXHRcdHZhciBvd2wgPSAkKCcuaG9tZS1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXZTcGVlZDogNDAwLFxyXG4gICAgICAgICAgICBhdXRvcGxheTogdHJ1ZSxcclxuXHRcdFx0YXV0b3BsYXlUaW1lb3V0OjUwMDAsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogMSxcclxuICAgICAgICAgICAgICAgIFx0ZG90c0RhdGE6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5sb2dvLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRsb2dvU2xpZGVyKDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bG9nb1NsaWRlcigwKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0bG9nb1NsaWRlcigwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsb2dvU2xpZGVyKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBsb2dvU2xpZGVyKHN0YWdlUGFkZGluZykge1xyXG4gICAgICAgICQoJy5sb2dvLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDQ1LFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDk5Mjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiA1XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgc2xpZGVySW5kZXg7XHJcblxyXG4gICAgaWYgKCQoJy5ub3MtYmFucXVlcycpLmxlbmd0aCkge1xyXG4gICAgICAgIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG4gICAgICAgICAgICBiYW5xdWVzU2xpZGVyKDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBiYW5xdWVzU2xpZGVyKDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzIC5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgYmFucXVlc1NsaWRlcigwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVIYXNoICgpIHsgXHJcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoJycsIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBiYW5xdWVzU2xpZGVyKHN0YWdlUGFkZGluZykge1xyXG4gICAgICAgIHZhciBvd2wgPSAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMCxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICBVUkxoYXNoTGlzdGVuZXI6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdlNwZWVkOiAxMDAwLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb3dsLm9uKFwiZHJhZy5vd2wuY2Fyb3VzZWxcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0WydfZHJhZyddWydkaXJlY3Rpb24nXSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleEJlZm9yZUNoYW5nZSA9IGV2ZW50LnBhZ2UuaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kZXggPSBpbmRleEJlZm9yZUNoYW5nZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb3dsLm9uKFwiZHJhZ2dlZC5vd2wuY2Fyb3VzZWxcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbmRleEFmdGVyQ2hhbmdlID0gZXZlbnQucGFnZS5pbmRleDtcclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0WydfZHJhZyddWydkaXJlY3Rpb24nXSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleEFmdGVyQ2hhbmdlICE9PSBzbGlkZXJJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0WydfZHJhZyddWydkaXJlY3Rpb24nXSA9PT0gXCJsZWZ0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXYoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcub3dsLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcub3dsLXByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcHJldigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudEl0ZW0gPSAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW0uYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0uaXMoJzpsYXN0LWNoaWxkJykpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbTpmaXJzdC1jaGlsZCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLm5leHQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZXYoKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50SXRlbSA9ICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbS5hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50SXRlbS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbTpsYXN0LWNoaWxkJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZW0ucHJldigpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblxyXG4gICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbTpmaXJzdC1jaGlsZCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2xpY2tlZEl0ZW0gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjbGlja2VkSXRlbS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbS5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBjbGlja2VkSXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZigkKCcuaGVhZGVyX3NlYXJjaCcpLmxlbmd0aCkge1xyXG5cdFx0YWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzICgpIHtcclxuXHRcdCQoJy5oZWFkZXJfc2VhcmNoJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcucGFnZS1jb250ZW50JykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0XHQkKCcucG9wdXAtc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLmNsb3NlLXdyYXBwZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5wYWdlLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcblx0XHRcdCQoJy5wb3B1cC1zZWFyY2gnKS5hZGRDbGFzcygnZC1ub25lJyk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0JCgnc2VsZWN0Lm5pY2Utc2VsZWN0JykubmljZVNlbGVjdCgpO1xyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuc3dpcGVib3gnKS5sZW5ndGgpIHtcclxuXHRcdCQoJy5zd2lwZWJveCcpLnN3aXBlYm94KCk7XHJcblx0fVxyXG5cdFxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0LCAudG9wLWhlYWRlcl9saXN0IC5sYW5nJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuZHJvcGRvd24nKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcqJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICBpZiAoISQuY29udGFpbnMoJCgnLnRvcC1oZWFkZXJfbGlzdCcpWzBdLCAkKGUudGFyZ2V0KVswXSkgJiYgXHJcbiAgICAgICAgICAgICgkKCcubGFuZycpLmhhc0NsYXNzKCdvcGVuJykgfHxcclxuICAgICAgICAgICAgJCgnLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSApIHtcclxuXHJcbiAgICAgICAgICAgIGNsb3NlRHJvcGRvd25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0JykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5sYW5nJykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==
