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
});

},{"../../components/article-slider/index.js":2,"../../components/besoin-aide/index.js":3,"../../components/card/card-slider.js":4,"../../components/date-filter/index.js":5,"../../components/date-slider/date-slider.js":6,"../../components/finance/index.js":7,"../../components/home-slider/index.js":8,"../../components/logo-slider/index.js":9,"../../components/nos-banques/index.js":10,"../../components/select-filter/index.js":11,"../../components/swipebox/index.js":12,"../../components/top-header/index.js":13}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.article-slider').length) {

    if ($(window).width() > 991) {
      articleSlider(0);
    } else {
      articleSlider(0);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 991) {
        articleSlider(0);
      } else {
        articleSlider(0);
      }
    });
  }

  function articleSlider(stagePadding) {
    $('.article-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 18,
      dots: true,
      nav: true,
      loop: true,
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	$('select.nice-select').niceSelect();
};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.swipebox').length) {
		$('.swipebox').swipebox();
	}
};

},{}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2pzL21haW4uanMiLCJzcmMvY29tcG9uZW50cy9hcnRpY2xlLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2Jlc29pbi1haWRlL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLXNsaWRlci5qcyIsInNyYy9jb21wb25lbnRzL2RhdGUtZmlsdGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZGF0ZS1zbGlkZXIvZGF0ZS1zbGlkZXIuanMiLCJzcmMvY29tcG9uZW50cy9maW5hbmNlL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvaG9tZS1zbGlkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9sb2dvLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL25vcy1iYW5xdWVzL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvc2VsZWN0LWZpbHRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3N3aXBlYm94L2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvdG9wLWhlYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVc7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FiRDs7Ozs7Ozs7O2tCQ2RlLFlBQVc7QUFDekIsTUFBSSxFQUFFLGlCQUFGLEVBQXFCLE1BQXpCLEVBQWlDOztBQUVoQyxRQUFJLEVBQUUsTUFBRixFQUFVLEtBQVYsS0FBb0IsR0FBeEIsRUFBNkI7QUFDNUIsb0JB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Q0FBaUMsV0FBakMsRUFBOEMsV0FBOUMsQ0FBMEQsUUFBMUQ7QUFDSDs7QUFFRCxZQUFJLEVBQUUsd0JBQUYsRUFBNEIsUUFBNUIsQ0FBcUMsTUFBckMsQ0FBSixFQUFrRDtBQUM5QyxjQUFFLHdCQUFGLEVBQTRCLFdBQTVCLENBQXdDLE1BQXhDO0FBQ0EsY0FBRSx3QkFBRixFQUE0QixJQUE1QixDQUFpQyxXQUFqQyxFQUE4QyxXQUE5QyxDQUEwRCxRQUExRDtBQUNIO0FBQ0o7QUFDSixDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgc2VsZWN0IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvc2VsZWN0LWZpbHRlci9pbmRleC5qcyc7XHJcbmltcG9ydCB0b3BIZWFkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy90b3AtaGVhZGVyL2luZGV4LmpzJztcclxuaW1wb3J0IGNhcmRTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtc2xpZGVyLmpzJztcclxuaW1wb3J0IGRhdGVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kYXRlLXNsaWRlci9kYXRlLXNsaWRlci5qcyc7XHJcbmltcG9ydCBsb2dvU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbG9nby1zbGlkZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgZmluYW5jZSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2ZpbmFuY2UvaW5kZXguanMnO1xyXG5pbXBvcnQgYmFucXVlc1NsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL25vcy1iYW5xdWVzL2luZGV4LmpzJztcclxuaW1wb3J0IGhvbWVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9ob21lLXNsaWRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBiZXNvaW5BaWRlIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYmVzb2luLWFpZGUvaW5kZXguanMnO1xyXG5pbXBvcnQgc3dpcGVib3ggZnJvbSAnLi4vLi4vY29tcG9uZW50cy9zd2lwZWJveC9pbmRleC5qcyc7XHJcbmltcG9ydCBkYXRlZmlsdGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZGF0ZS1maWx0ZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgYXJ0aWNsZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FydGljbGUtc2xpZGVyL2luZGV4LmpzJztcclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHRzZWxlY3QoKTtcclxuXHR0b3BIZWFkZXIoKTtcclxuXHRjYXJkU2xpZGVyKCk7XHJcblx0ZGF0ZVNsaWRlcigpO1xyXG5cdGxvZ29TbGlkZXIoKTtcclxuXHRmaW5hbmNlKCk7XHJcblx0YmFucXVlc1NsaWRlcigpO1xyXG5cdGhvbWVTbGlkZXIoKTtcclxuXHRiZXNvaW5BaWRlKCk7XHJcblx0c3dpcGVib3goKTtcclxuXHRkYXRlZmlsdGVyKCk7XHJcblx0YXJ0aWNsZVNsaWRlcigpO1xyXG59KTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuXHRpZiAoJCgnLmFydGljbGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcblx0XHRcdGFydGljbGVTbGlkZXIoMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhcnRpY2xlU2xpZGVyKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuXHRcdFx0XHRhcnRpY2xlU2xpZGVyKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFydGljbGVTbGlkZXIoMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFydGljbGVTbGlkZXIoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmFydGljbGUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTgsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiAzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5iZXNvaW4tYWlkZScpLmxlbmd0aCkge1xyXG5cclxuXHRcdCQoJy5iZXNvaW4tYWlkZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLnF1ZXN0aW9ucycpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0aWYgKCQoJy5jYXJkLXNsaWRlci13cmFwcGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGNhcmRTbGlkZXJQYWdlKDE2KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNhcmRTbGlkZXJQYWdlKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRjYXJkU2xpZGVyUGFnZSgxNik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2FyZFNsaWRlclBhZ2UoMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2FyZFNsaWRlclBhZ2Uoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmNhcmQtc2xpZGVyLXdyYXBwZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAxNixcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuZGF0ZS1maWx0ZXInKS5sZW5ndGgpIHtcclxuXHJcblx0XHQkKCcuc3RhcnQgLmRhdGUtZmlsdGVyX2Fycm93cyBhOmZpcnN0LWNoaWxkJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coJCgnLnN0YXJ0IC5kYXRlLWZpbHRlcl9tb250aCBpbnB1dCcpLnZhbCgpKTtcclxuXHRcdFx0XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLnN0YXJ0IC5kYXRlLWZpbHRlcl9hcnJvd3MgYTpsYXN0LWNoaWxkJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmRhdGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0ZVNsaWRlclBhZ2UoMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkYXRlU2xpZGVyUGFnZShzdGFnZVBhZGRpbmcpIHtcclxuICAgICAgICAkKCcuZGF0ZS1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiA1LFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogMTBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMTVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmZpbmFuY2UubGVuZ3RoJykpIHtcclxuXHJcblx0XHQkKCcuZmluYW5jZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdHZhciBjdXJyZW50SXRlbSA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHQkKCcuZmluYW5jZScpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbCkge1xyXG5cclxuXHRcdFx0XHRcdGlmICgkKGVsKVswXSAhPT0gY3VycmVudEl0ZW1bMF0pIHtcclxuXHRcdFx0XHRcdFx0JChlbCkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5ob21lLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cclxuXHRcdFx0c2V0SGVpZ2h0U2xpZGVyKCk7XHJcbiAgICAgICAgICAgIGhvbWVTbGlkZXIoMCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGhvbWVTbGlkZXIoMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuaG9tZS1zbGlkZXInKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgaG9tZVNsaWRlcigwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5ob21lLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBob21lU2xpZGVyKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRIZWlnaHRTbGlkZXIoKSB7XHJcblx0XHR2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cdFx0dmFyIHRvcEhlYWRlckhlaWdodCA9ICQoJy50b3AtaGVhZGVyJykuaGVpZ2h0KCk7XHJcblx0XHR2YXIgaGVhZGVySGVpZ2h0ID0gJCgnLmhlYWRlcicpLmhlaWdodCgpO1xyXG5cclxuXHRcdHZhciBzbGlkZXJIZWlnaHQgPSB3aW5kb3dIZWlnaHQgLSB0b3BIZWFkZXJIZWlnaHQgLSBoZWFkZXJIZWlnaHQ7XHJcblxyXG5cdFx0dmFyIHNsaWRlciA9ICQoJy5ob21lLXNsaWRlcicpO1xyXG5cdFx0dmFyIHNsaWRlckl0ZW0gPSAkKCcuaG9tZS1zbGlkZXJfaXRlbScpO1xyXG5cclxuXHRcdHNsaWRlci5jc3MoJ21heC1oZWlnaHQnLCBzbGlkZXJIZWlnaHQpO1xyXG5cdFx0c2xpZGVySXRlbS5jc3MoJ21heC1oZWlnaHQnLCBzbGlkZXJIZWlnaHQpO1xyXG5cdFx0XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBob21lU2xpZGVyKHN0YWdlUGFkZGluZykge1xyXG5cdFx0dmFyIG93bCA9ICQoJy5ob21lLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdlNwZWVkOiA0MDAsXHJcbiAgICAgICAgICAgIGF1dG9wbGF5OiB0cnVlLFxyXG5cdFx0XHRhdXRvcGxheVRpbWVvdXQ6NTAwMCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiAxLFxyXG4gICAgICAgICAgICAgICAgXHRkb3RzRGF0YTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmxvZ28tc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGxvZ29TbGlkZXIoMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsb2dvU2xpZGVyKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRsb2dvU2xpZGVyKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZ29TbGlkZXIoMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxvZ29TbGlkZXIoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmxvZ28tc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogNDUsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiA0XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBzbGlkZXJJbmRleDtcclxuXHJcbiAgICBpZiAoJCgnLm5vcy1iYW5xdWVzJykubGVuZ3RoKSB7XHJcbiAgICAgICAgaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJCgnLm5vcy1iYW5xdWVzIC5vd2wtY2Fyb3VzZWwnKS5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcbiAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYmFucXVlc1NsaWRlcigwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBiYW5xdWVzU2xpZGVyKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbW92ZUhhc2ggKCkgeyBcclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSgnJywgZG9jdW1lbnQudGl0bGUsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJhbnF1ZXNTbGlkZXIoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgdmFyIG93bCA9ICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIFVSTGhhc2hMaXN0ZW5lcjogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2U3BlZWQ6IDEwMDAsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvd2wub24oXCJkcmFnLm93bC5jYXJvdXNlbFwiLCBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2ZW50LnJlbGF0ZWRUYXJnZXRbJ19kcmFnJ11bJ2RpcmVjdGlvbiddKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4QmVmb3JlQ2hhbmdlID0gZXZlbnQucGFnZS5pbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICBzbGlkZXJJbmRleCA9IGluZGV4QmVmb3JlQ2hhbmdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvd2wub24oXCJkcmFnZ2VkLm93bC5jYXJvdXNlbFwiLCBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGluZGV4QWZ0ZXJDaGFuZ2UgPSBldmVudC5wYWdlLmluZGV4O1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2ZW50LnJlbGF0ZWRUYXJnZXRbJ19kcmFnJ11bJ2RpcmVjdGlvbiddKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4QWZ0ZXJDaGFuZ2UgIT09IHNsaWRlckluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnJlbGF0ZWRUYXJnZXRbJ19kcmFnJ11bJ2RpcmVjdGlvbiddID09PSBcImxlZnRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5vd2wtbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5vd2wtcHJldicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBwcmV2KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50SXRlbSA9ICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbS5hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50SXRlbS5pcygnOmxhc3QtY2hpbGQnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtOmZpcnN0LWNoaWxkJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZW0ubmV4dCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJldigpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRJdGVtID0gJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtLmFjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgY3VycmVudEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRJdGVtLmlzKCc6Zmlyc3QtY2hpbGQnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtOmxhc3QtY2hpbGQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS5wcmV2KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVFdmVudExpc3RlbmVycygpIHtcclxuXHJcbiAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtOmZpcnN0LWNoaWxkJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBjbGlja2VkSXRlbSA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNsaWNrZWRJdGVtLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGNsaWNrZWRJdGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdCQoJ3NlbGVjdC5uaWNlLXNlbGVjdCcpLm5pY2VTZWxlY3QoKTtcclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLnN3aXBlYm94JykubGVuZ3RoKSB7XHJcblx0XHQkKCcuc3dpcGVib3gnKS5zd2lwZWJveCgpO1xyXG5cdH1cclxuXHRcclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnLnRvcC1oZWFkZXJfbGlzdCAubGlzdCwgLnRvcC1oZWFkZXJfbGlzdCAubGFuZycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICQodGhpcykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnKicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmNvbnRhaW5zKCQoJy50b3AtaGVhZGVyX2xpc3QnKVswXSwgJChlLnRhcmdldClbMF0pICYmIFxyXG4gICAgICAgICAgICAoJCgnLmxhbmcnKS5oYXNDbGFzcygnb3BlbicpIHx8XHJcbiAgICAgICAgICAgICQoJy5saXN0JykuaGFzQ2xhc3MoJ29wZW4nKSkgKSB7XHJcblxyXG4gICAgICAgICAgICBjbG9zZURyb3Bkb3ducygpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlRHJvcGRvd25zKCkge1xyXG4gICAgICAgIGlmICgkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0JykuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0JykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgJCgnLnRvcC1oZWFkZXJfbGlzdCAubGlzdCcpLmZpbmQoJy5kcm9wZG93bicpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKCcudG9wLWhlYWRlcl9saXN0IC5sYW5nJykuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5sYW5nJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgJCgnLnRvcC1oZWFkZXJfbGlzdCAubGFuZycpLmZpbmQoJy5kcm9wZG93bicpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=
