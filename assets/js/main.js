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

		$('.popup-search .btn--tag').on('click', function () {

			if ($(this).is(':first-child')) {
				$('.popup-search .btn--tag:not(:first-child)').removeClass('active');
				$(this).toggleClass('active');
			} else {
				$('.popup-search .btn--tag:first-child').removeClass('active');
				$(this).toggleClass('active');
			}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2pzL21haW4uanMiLCJzcmMvY29tcG9uZW50cy9hcnRpY2xlLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2Jlc29pbi1haWRlL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLXJhcHBvcnQuanMiLCJzcmMvY29tcG9uZW50cy9jYXJkL2NhcmQtc2xpZGVyLmpzIiwic3JjL2NvbXBvbmVudHMvZGF0ZS1maWx0ZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9kYXRlLXNsaWRlci9kYXRlLXNsaWRlci5qcyIsInNyYy9jb21wb25lbnRzL2ZpbmFuY2UvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9ob21lLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2xvZ28tc2xpZGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvbm9zLWJhbnF1ZXMvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9wb3B1cC1zZWFyY2gvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QtZmlsdGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvc3dpcGVib3gvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy90b3AtaGVhZGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVc7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBZkQ7Ozs7Ozs7OztrQkNoQmUs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cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IHNlbGVjdCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3NlbGVjdC1maWx0ZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgdG9wSGVhZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvdG9wLWhlYWRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBjYXJkU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY2FyZC9jYXJkLXNsaWRlci5qcyc7XHJcbmltcG9ydCBkYXRlU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZGF0ZS1zbGlkZXIvZGF0ZS1zbGlkZXIuanMnO1xyXG5pbXBvcnQgbG9nb1NsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2xvZ28tc2xpZGVyL2luZGV4LmpzJztcclxuaW1wb3J0IGZpbmFuY2UgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9maW5hbmNlL2luZGV4LmpzJztcclxuaW1wb3J0IGJhbnF1ZXNTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9ub3MtYmFucXVlcy9pbmRleC5qcyc7XHJcbmltcG9ydCBob21lU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvaG9tZS1zbGlkZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgYmVzb2luQWlkZSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2Jlc29pbi1haWRlL2luZGV4LmpzJztcclxuaW1wb3J0IHN3aXBlYm94IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvc3dpcGVib3gvaW5kZXguanMnO1xyXG5pbXBvcnQgZGF0ZWZpbHRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2RhdGUtZmlsdGVyL2luZGV4LmpzJztcclxuaW1wb3J0IGFydGljbGVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hcnRpY2xlLXNsaWRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBjYXJkUmFwcG9ydCBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NhcmQvY2FyZC1yYXBwb3J0LmpzJztcclxuaW1wb3J0IHBvcHVwU2VhcmNoIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvcG9wdXAtc2VhcmNoL2luZGV4LmpzJztcclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHRzZWxlY3QoKTtcclxuXHR0b3BIZWFkZXIoKTtcclxuXHRjYXJkU2xpZGVyKCk7XHJcblx0ZGF0ZVNsaWRlcigpO1xyXG5cdGxvZ29TbGlkZXIoKTtcclxuXHRmaW5hbmNlKCk7XHJcblx0YmFucXVlc1NsaWRlcigpO1xyXG5cdGhvbWVTbGlkZXIoKTtcclxuXHRiZXNvaW5BaWRlKCk7XHJcblx0c3dpcGVib3goKTtcclxuXHRkYXRlZmlsdGVyKCk7XHJcblx0YXJ0aWNsZVNsaWRlcigpO1xyXG5cdGNhcmRSYXBwb3J0KCk7XHJcblx0cG9wdXBTZWFyY2goKTtcclxufSk7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcblx0aWYgKCQoJy5hcnRpY2xlLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDk5MSkge1xyXG5cdFx0XHRhcnRpY2xlU2xpZGVyKDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YXJ0aWNsZVNsaWRlcigzMik7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDk5MSkge1xyXG5cdFx0XHRcdGFydGljbGVTbGlkZXIoMCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXJ0aWNsZVNsaWRlcigzMik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFydGljbGVTbGlkZXIoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmFydGljbGUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDk5Mjoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogM1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuYmVzb2luLWFpZGUnKS5sZW5ndGgpIHtcclxuXHJcblx0XHQkKCcuYmVzb2luLWFpZGUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5xdWVzdGlvbnMnKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5jYXJkLS1yYXBwb3J0LXJpZ2h0JykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdHJhcHBvcnRTbGlkZXIoMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyYXBwb3J0U2xpZGVyKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRyYXBwb3J0U2xpZGVyKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJhcHBvcnRTbGlkZXIoMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJhcHBvcnRTbGlkZXIoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgdmFyIG93bCA9ICQoJy5jYXJkLS1yYXBwb3J0LXJpZ2h0Lm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMCxcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCAud3JhcHBlcl9idG4gLm5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdCAgICBvd2wudHJpZ2dlcignbmV4dC5vd2wuY2Fyb3VzZWwnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIEdvIHRvIHRoZSBwcmV2aW91cyBpdGVtXHJcblx0XHQkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCAud3JhcHBlcl9idG4gLnByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdCAgICAvLyBXaXRoIG9wdGlvbmFsIHNwZWVkIHBhcmFtZXRlclxyXG5cdFx0ICAgIC8vIFBhcmFtZXRlcnMgaGFzIHRvIGJlIGluIHNxdWFyZSBicmFja2V0ICdbXSdcclxuXHRcdCAgICBvd2wudHJpZ2dlcigncHJldi5vd2wuY2Fyb3VzZWwnKTtcclxuXHRcdH0pO1xyXG5cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0aWYgKCQoJy5jYXJkLXNsaWRlci13cmFwcGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGNhcmRTbGlkZXJQYWdlKDE2KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNhcmRTbGlkZXJQYWdlKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRjYXJkU2xpZGVyUGFnZSgxNik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2FyZFNsaWRlclBhZ2UoMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2FyZFNsaWRlclBhZ2Uoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmNhcmQtc2xpZGVyLXdyYXBwZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAxNixcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuZGF0ZS1maWx0ZXInKS5sZW5ndGgpIHtcclxuXHJcblx0XHQkKCcuc3RhcnQgLmRhdGUtZmlsdGVyX2Fycm93cyBhOmZpcnN0LWNoaWxkJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coJCgnLnN0YXJ0IC5kYXRlLWZpbHRlcl9tb250aCBpbnB1dCcpLnZhbCgpKTtcclxuXHRcdFx0XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLnN0YXJ0IC5kYXRlLWZpbHRlcl9hcnJvd3MgYTpsYXN0LWNoaWxkJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmRhdGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0ZVNsaWRlclBhZ2UoMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkYXRlU2xpZGVyUGFnZShzdGFnZVBhZGRpbmcpIHtcclxuICAgICAgICAkKCcuZGF0ZS1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiA1LFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogMTBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMTVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmZpbmFuY2UubGVuZ3RoJykpIHtcclxuXHJcblx0XHQkKCcuZmluYW5jZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdHZhciBjdXJyZW50SXRlbSA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHQkKCcuZmluYW5jZScpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbCkge1xyXG5cclxuXHRcdFx0XHRcdGlmICgkKGVsKVswXSAhPT0gY3VycmVudEl0ZW1bMF0pIHtcclxuXHRcdFx0XHRcdFx0JChlbCkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5ob21lLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cclxuXHRcdFx0c2V0SGVpZ2h0U2xpZGVyKCk7XHJcbiAgICAgICAgICAgIGhvbWVTbGlkZXIoMCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGhvbWVTbGlkZXIoMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuaG9tZS1zbGlkZXInKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgaG9tZVNsaWRlcigwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5ob21lLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBob21lU2xpZGVyKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRIZWlnaHRTbGlkZXIoKSB7XHJcblx0XHR2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cdFx0dmFyIHRvcEhlYWRlckhlaWdodCA9ICQoJy50b3AtaGVhZGVyJykuaGVpZ2h0KCk7XHJcblx0XHR2YXIgaGVhZGVySGVpZ2h0ID0gJCgnLmhlYWRlcicpLmhlaWdodCgpO1xyXG5cclxuXHRcdHZhciBzbGlkZXJIZWlnaHQgPSB3aW5kb3dIZWlnaHQgLSB0b3BIZWFkZXJIZWlnaHQgLSBoZWFkZXJIZWlnaHQ7XHJcblxyXG5cdFx0dmFyIHNsaWRlciA9ICQoJy5ob21lLXNsaWRlcicpO1xyXG5cdFx0dmFyIHNsaWRlckl0ZW0gPSAkKCcuaG9tZS1zbGlkZXJfaXRlbScpO1xyXG5cclxuXHRcdHNsaWRlci5jc3MoJ21heC1oZWlnaHQnLCBzbGlkZXJIZWlnaHQpO1xyXG5cdFx0c2xpZGVySXRlbS5jc3MoJ21heC1oZWlnaHQnLCBzbGlkZXJIZWlnaHQpO1xyXG5cdFx0XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBob21lU2xpZGVyKHN0YWdlUGFkZGluZykge1xyXG5cdFx0dmFyIG93bCA9ICQoJy5ob21lLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdlNwZWVkOiA0MDAsXHJcbiAgICAgICAgICAgIGF1dG9wbGF5OiB0cnVlLFxyXG5cdFx0XHRhdXRvcGxheVRpbWVvdXQ6NTAwMCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiAxLFxyXG4gICAgICAgICAgICAgICAgXHRkb3RzRGF0YTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmxvZ28tc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGxvZ29TbGlkZXIoMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsb2dvU2xpZGVyKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRsb2dvU2xpZGVyKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZ29TbGlkZXIoMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxvZ29TbGlkZXIoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmxvZ28tc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogNDUsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiA0XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBzbGlkZXJJbmRleDtcclxuXHJcbiAgICBpZiAoJCgnLm5vcy1iYW5xdWVzJykubGVuZ3RoKSB7XHJcbiAgICAgICAgaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJCgnLm5vcy1iYW5xdWVzIC5vd2wtY2Fyb3VzZWwnKS5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcbiAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYmFucXVlc1NsaWRlcigwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBiYW5xdWVzU2xpZGVyKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbW92ZUhhc2ggKCkgeyBcclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSgnJywgZG9jdW1lbnQudGl0bGUsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJhbnF1ZXNTbGlkZXIoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgdmFyIG93bCA9ICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIFVSTGhhc2hMaXN0ZW5lcjogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2U3BlZWQ6IDEwMDAsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvd2wub24oXCJkcmFnLm93bC5jYXJvdXNlbFwiLCBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2ZW50LnJlbGF0ZWRUYXJnZXRbJ19kcmFnJ11bJ2RpcmVjdGlvbiddKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4QmVmb3JlQ2hhbmdlID0gZXZlbnQucGFnZS5pbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICBzbGlkZXJJbmRleCA9IGluZGV4QmVmb3JlQ2hhbmdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvd2wub24oXCJkcmFnZ2VkLm93bC5jYXJvdXNlbFwiLCBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGluZGV4QWZ0ZXJDaGFuZ2UgPSBldmVudC5wYWdlLmluZGV4O1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2ZW50LnJlbGF0ZWRUYXJnZXRbJ19kcmFnJ11bJ2RpcmVjdGlvbiddKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4QWZ0ZXJDaGFuZ2UgIT09IHNsaWRlckluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnJlbGF0ZWRUYXJnZXRbJ19kcmFnJ11bJ2RpcmVjdGlvbiddID09PSBcImxlZnRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5vd2wtbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5vd2wtcHJldicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBwcmV2KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50SXRlbSA9ICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbS5hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50SXRlbS5pcygnOmxhc3QtY2hpbGQnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtOmZpcnN0LWNoaWxkJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZW0ubmV4dCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJldigpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRJdGVtID0gJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtLmFjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgY3VycmVudEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRJdGVtLmlzKCc6Zmlyc3QtY2hpbGQnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtOmxhc3QtY2hpbGQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS5wcmV2KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVFdmVudExpc3RlbmVycygpIHtcclxuXHJcbiAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtOmZpcnN0LWNoaWxkJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBjbGlja2VkSXRlbSA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNsaWNrZWRJdGVtLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGNsaWNrZWRJdGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmKCQoJy5oZWFkZXJfc2VhcmNoJykubGVuZ3RoKSB7XHJcblx0XHRhZGRFdmVudExpc3RlbmVycygpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMgKCkge1xyXG5cdFx0JCgnLmhlYWRlcl9zZWFyY2gnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5wYWdlLWNvbnRlbnQnKS5hZGRDbGFzcygnZC1ub25lJyk7XHJcblx0XHRcdCQoJy5wb3B1cC1zZWFyY2gnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcuY2xvc2Utd3JhcHBlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLnBhZ2UtY29udGVudCcpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcclxuXHRcdFx0JCgnLnBvcHVwLXNlYXJjaCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5wb3B1cC1zZWFyY2ggLmJ0bi0tdGFnJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0aWYoJCh0aGlzKS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuXHRcdFx0XHQkKCcucG9wdXAtc2VhcmNoIC5idG4tLXRhZzpub3QoOmZpcnN0LWNoaWxkKScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcucG9wdXAtc2VhcmNoIC5idG4tLXRhZzpmaXJzdC1jaGlsZCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHQkKCdzZWxlY3QubmljZS1zZWxlY3QnKS5uaWNlU2VsZWN0KCk7XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5zd2lwZWJveCcpLmxlbmd0aCkge1xyXG5cdFx0JCgnLnN3aXBlYm94Jykuc3dpcGVib3goKTtcclxuXHR9XHJcblx0XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QsIC50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAkKHRoaXMpLmZpbmQoJy5kcm9wZG93bicpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJyonKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgIGlmICghJC5jb250YWlucygkKCcudG9wLWhlYWRlcl9saXN0JylbMF0sICQoZS50YXJnZXQpWzBdKSAmJiBcclxuICAgICAgICAgICAgKCQoJy5sYW5nJykuaGFzQ2xhc3MoJ29wZW4nKSB8fFxyXG4gICAgICAgICAgICAkKCcubGlzdCcpLmhhc0NsYXNzKCdvcGVuJykpICkge1xyXG5cclxuICAgICAgICAgICAgY2xvc2VEcm9wZG93bnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZURyb3Bkb3ducygpIHtcclxuICAgICAgICBpZiAoJCgnLnRvcC1oZWFkZXJfbGlzdCAubGlzdCcpLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgICAgICAgJCgnLnRvcC1oZWFkZXJfbGlzdCAubGlzdCcpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS5maW5kKCcuZHJvcGRvd24nKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJCgnLnRvcC1oZWFkZXJfbGlzdCAubGFuZycpLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgICAgICAgJCgnLnRvcC1oZWFkZXJfbGlzdCAubGFuZycpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS5maW5kKCcuZHJvcGRvd24nKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
