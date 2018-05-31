(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _index = require('../../components/select-filter/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../components/top-header/index.js');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('../../components/header/index.js');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('../../components/footer/index.js');

var _index8 = _interopRequireDefault(_index7);

var _cardSlider = require('../../components/card/card-slider.js');

var _cardSlider2 = _interopRequireDefault(_cardSlider);

var _dateSlider = require('../../components/date-slider/date-slider.js');

var _dateSlider2 = _interopRequireDefault(_dateSlider);

var _index9 = require('../../components/logo-slider/index.js');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('../../components/finance/index.js');

var _index12 = _interopRequireDefault(_index11);

var _index13 = require('../../components/nos-banques/index.js');

var _index14 = _interopRequireDefault(_index13);

var _index15 = require('../../components/home-slider/index.js');

var _index16 = _interopRequireDefault(_index15);

var _index17 = require('../../components/besoin-aide/index.js');

var _index18 = _interopRequireDefault(_index17);

var _index19 = require('../../components/swipebox/index.js');

var _index20 = _interopRequireDefault(_index19);

var _index21 = require('../../components/date-filter/index.js');

var _index22 = _interopRequireDefault(_index21);

var _index23 = require('../../components/article-slider/index.js');

var _index24 = _interopRequireDefault(_index23);

var _cardRapport = require('../../components/card/card-rapport.js');

var _cardRapport2 = _interopRequireDefault(_cardRapport);

var _index25 = require('../../components/popup-search/index.js');

var _index26 = _interopRequireDefault(_index25);

var _index27 = require('../../components/popup-video/index.js');

var _index28 = _interopRequireDefault(_index27);

var _index29 = require('../../components/actualite-slider/index.js');

var _index30 = _interopRequireDefault(_index29);

var _index31 = require('../../components/pub-slider/index.js');

var _index32 = _interopRequireDefault(_index31);

var _formValidation = require('../../components/form/form-validation.js');

var _formValidation2 = _interopRequireDefault(_formValidation);

var _formUpload = require('../../components/form/form-upload.js');

var _formUpload2 = _interopRequireDefault(_formUpload);

var _cardActualites = require('../../components/card/card-actualites.js');

var _cardActualites2 = _interopRequireDefault(_cardActualites);

var _cardHistoire = require('../../components/card/card-histoire.js');

var _cardHistoire2 = _interopRequireDefault(_cardHistoire);

var _index33 = require('../../components/map/index.js');

var _index34 = _interopRequireDefault(_index33);

var _index35 = require('../../components/map-control/index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
		(0, _index2.default)();
		(0, _index4.default)();
		(0, _index6.default)();
		(0, _index8.default)();
		(0, _cardSlider2.default)();
		(0, _dateSlider2.default)();
		(0, _index10.default)();
		(0, _index12.default)();
		(0, _index14.default)();
		(0, _index16.default)();
		(0, _index18.default)();
		(0, _index20.default)();
		(0, _index22.default)();
		(0, _index24.default)();
		(0, _cardRapport2.default)();
		(0, _index26.default)();
		(0, _index28.default)();
		(0, _index30.default)();
		(0, _index32.default)();
		(0, _formValidation2.default)();
		(0, _formUpload2.default)();
		(0, _cardActualites2.default)();
		(0, _cardHistoire2.default)();
		(0, _index34.default)();
		(0, _index35.mapControl)();
		(0, _index35.toggleControl)();
});

},{"../../components/actualite-slider/index.js":2,"../../components/article-slider/index.js":3,"../../components/besoin-aide/index.js":4,"../../components/card/card-actualites.js":5,"../../components/card/card-histoire.js":6,"../../components/card/card-rapport.js":7,"../../components/card/card-slider.js":8,"../../components/date-filter/index.js":9,"../../components/date-slider/date-slider.js":10,"../../components/finance/index.js":11,"../../components/footer/index.js":12,"../../components/form/form-upload.js":13,"../../components/form/form-validation.js":14,"../../components/header/index.js":15,"../../components/home-slider/index.js":16,"../../components/logo-slider/index.js":17,"../../components/map-control/index.js":18,"../../components/map/index.js":19,"../../components/nos-banques/index.js":20,"../../components/popup-search/index.js":21,"../../components/popup-video/index.js":22,"../../components/pub-slider/index.js":23,"../../components/select-filter/index.js":24,"../../components/swipebox/index.js":25,"../../components/top-header/index.js":26}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.actualite-slider').length) {
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
    $('.actualite-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 18,
      dots: true,
      nav: true,
      merge: true,
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    if ($('.card-actualites-slider').length) {

        var rtl = $('html').attr('dir') == 'rtl';

        if ($(window).width() <= 991) {

            cardActuSlider(48, rtl);
        } else {

            $('.card-actualites-slider').owlCarousel('destroy');
        }

        $(window).on('resize', function () {
            if ($(window).width() <= 991) {

                $('.card-actualites-slider').owlCarousel('destroy');
                cardActuSlider(48, rtl);
            } else {

                $('.card-actualites-slider').owlCarousel('destroy');
            }
        });
    }

    function cardActuSlider(stagePadding, rtl) {
        $('.card-actualites-slider.owl-carousel').owlCarousel({
            stagePadding: stagePadding,
            margin: 16,
            dots: true,
            nav: false,
            rtl: rtl,
            responsive: {
                0: {
                    items: 1
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

	if ($('.card-histoire-slider').length) {

		var rtl = $('html').attr('dir') == 'rtl';

		if ($(window).width() <= 768) {

			cardHistoireSlider(48, rtl);
		} else {
			$('.card-histoire-slider').owlCarousel('destroy');
		}

		$(window).on('resize', function () {
			if ($(window).width() <= 768) {

				cardHistoireSlider(48, rtl);
			} else {
				$('.card-histoire-slider').owlCarousel('destroy');
			}
		});
	}

	function cardHistoireSlider(stagePadding, rtl) {
		$('.card-histoire-slider.owl-carousel').owlCarousel({
			stagePadding: stagePadding,
			margin: 5,
			dots: true,
			nav: false,
			rtl: rtl,
			responsive: {
				0: {
					items: 1
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.footer_title').length) {

		$('.footer_title').on('click', function () {
			if ($(this).next('ul').css('display') === 'none') {

				$('.footer_title + ul.open').css('display', 'none');
				$('.footer_title + ul.open').removeClass('open');

				$(this).next('ul').css('display', 'block');
				$(this).next('ul').addClass('open');
			} else {

				$(this).next('ul').css('display', 'none');
				$(this).next('ul').removeClass('open');
			}
		});

		$(window).on('resize', function () {
			if ($(window).width() > 768) {
				$('.footer_title + ul').css('display', 'block');
				$('.footer_title + ul.open').removeClass('open');
			} else {
				$('.footer_title + ul').css('display', 'none');
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

    /* Variables */

    var $form = $('.form-stage');
    var $formDrop = $('.form_drop');
    var $input = $form.find('input[type=file]');
    var droppedFiles = false;

    /* Functions */

    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return ('draggable' in div || 'ondragstart' in div && 'ondrop' in div) && 'FormData' in window && 'FileReader' in window;
    }();

    var addfileDom = function addfileDom(file) {
        console.log(file);

        var html = '<div class="col-12 col-md-6 mb-2">\n\t        \t\t\t<div class="form_file" id="' + (file.name + parseInt(file.size / 1024)) + '">\n\t\t\t                <div class="wrapper d-flex justify-content-between align-items-center">\n\t\t\t                    <div class="d-flex align-items-center">\n\t\t\t                        <span class="check d-none">\n\t\t\t                            <svg>\n\t\t\t                                <use xlink:href="#icon-check-file"></use>\n\t\t\t                            </svg>\n\t\t\t                        </span>\n\t\t\t                        <span class="pdf">\n\t\t\t                            <svg>\n\t\t\t                                <use xlink:href="#icon-pdf-file"></use>\n\t\t\t                            </svg>\n\t\t\t                        </span>\n\t\t\t                        <span>\n\t\t\t                            <p class="name">\n\t\t\t                                ' + file.name + '\n\t\t\t                            </p>\n\t\t\t                            <p class="size">\n\t\t\t                                ' + parseInt(file.size / 1024) + 'KB\n\t\t\t                            </p>\n\t\t\t                        </span>\n\t\t\t                    </div>\n\t\t\t                    <div class="d-flex align-items-center">\n\t\t\t                        <span class="remove d-none">\n\t\t\t                            <svg>\n\t\t\t                                <use xlink:href="#icon-remove-file"></use>\n\t\t\t                            </svg>\n\t\t\t                        </span>\n\t\t\t                        <span class="loading">\n\t\t\t                            Chargement en cours <span class="percentage"></span> %\n\t\t\t                        </span>\n\t\t\t                        <span class="cross">\n\t\t\t                            <svg>\n\t\t\t                                <use xlink:href="#icon-cross-file"></use>\n\t\t\t                            </svg>\n\t\t\t                        </span>\n\t\t\t                    </div>\n\t\t\t                </div>\n\t\t\t                <div class="progress-bar" style="width: 0%"></div>\n\t\t\t            </div>\n\t\t\t        </div>';

        $('.form_files').append(html);
    };

    var sendFiles = function sendFiles(files) {
        //console.log(files);

        var ajaxData = new FormData($form.get(0));

        $.each(droppedFiles, function (i, file) {

            var fileId = file.name + parseInt(file.size / 1024);
            ajaxData.append(fileId, file);

            addfileDom(file);

            $.ajax({
                xhr: function xhr() {

                    var xhr = new window.XMLHttpRequest();

                    xhr.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {

                            var percentComplete = evt.loaded / evt.total;
                            var fileId = file.name + parseInt(file.size / 1024);
                            var fileDom = $(document.getElementById(fileId));
                            var percentageDom = $(document.getElementById(fileId)).find('.percentage');
                            var progressBar = $(document.getElementById(fileId)).find('.progress-bar');

                            percentComplete = parseInt(percentComplete * 100);

                            percentageDom.append(percentComplete);
                            progressBar.css('width', percentComplete + '%');

                            //console.log(percentComplete);

                            if (percentComplete === 100) {
                                setTimeout(function () {

                                    fileDom.find('.progress-bar').toggleClass('d-none');
                                    fileDom.find('.loading').toggleClass('d-none');
                                    fileDom.find('.remove').toggleClass('d-none');
                                    fileDom.find('.cross').toggleClass('d-none');
                                }, 300);
                            }
                        }
                    }, false);

                    return xhr;
                },
                url: 'action/uploadfile',
                type: $form.attr('method'),
                data: ajaxData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                complete: function complete() {
                    $form.removeClass('is-uploading');
                },
                success: function success(data) {
                    $form.addClass(data.success == true ? 'is-success' : 'is-error');
                    if (!data.success) console.log('upload error');
                },
                error: function error() {
                    // Log the error, show an alert, whatever works for you
                }
            });

            $('.remove').on('click', function () {
                var removeId = $(this).closest('.form_file').attr('id');

                removeFile(removeId);
            });
        });
    };

    var removeFile = function removeFile(id) {
        var file = $(document.getElementById(id)).parent();
        file.remove();
    };

    /* Drag and drop Listener */

    if (isAdvancedUpload) {
        // Browser support Drag and Drop

        $formDrop.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        }).on('dragover dragenter', function () {
            $formDrop.addClass('is-dragover');
        }).on('dragleave dragend drop', function () {
            $formDrop.removeClass('is-dragover');
        }).on('drop', function (e) {
            droppedFiles = e.originalEvent.dataTransfer.files;
            sendFiles(droppedFiles);
        });

        $input.on('change', function (e) {
            droppedFiles = e.target.files;
            sendFiles(e.target.files);
        });
    } else {}

    //fallback for IE9- browsers


    /* Submit Listener */

    $form.on('submit', function (e) {
        if ($form.hasClass('is-uploading')) return false;

        $form.addClass('is-uploading').removeClass('is-error');

        if (isAdvancedUpload) {
            // ajax for modern browsers

            e.preventDefault();

            // Form Input Data
            var ajaxData = {};

            $.ajax({
                url: $form.attr('action'),
                type: $form.attr('method'),
                data: ajaxData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                complete: function complete() {},
                success: function success(data) {},
                error: function error() {
                    // Log the error, show an alert, whatever works for you
                }
            });
        } else {
            // ajax for IE9- browsers
        }
    });
};

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    $("form[name='form-stage']").validate({

        // Specify validation rules
        rules: {
            firstname: 'required',
            lastname: 'required',
            email: {
                required: true,
                email: true
            },
            tel: {
                required: true,
                digits: true
            },
            service: 'required',
            formation: 'required',
            stage: {
                required: true
            },
            'type-formation': {
                required: true
            }
        },
        // Specify validation error messages
        messages: {
            firstname: 'Veuillez entrer votre prénom',
            lastname: 'Veuillez entrer votre nom',
            email: 'Veuillez entrer un email valide',
            tel: 'Veuillez entrer un numéro de téléphone valide (10 caractères min)',
            'type-formation': 'Veuillez entrer un type de formation',
            'conditions': 'Veuillez acceptez les conditions générales d\'utilisation',
            'service': 'Veuillez choisir un service',
            'formation': 'Veuillez choisir une formation',
            'stage': 'Veuillez choisir un type de stage'
        },
        errorPlacement: function errorPlacement(error, element) {
            if ((element.attr('type') == 'radio' || element.attr('type') == 'checkbox') && element.attr('name') != 'conditions') {
                error.insertAfter(element.parent().parent());
            } else if (element.attr('name') == 'conditions') {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },

        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function submitHandler(form) {
            form.submit();
        }
    });
};

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.header_mobile-menu').length) {
		$('.header_mobile-menu').on('click', function () {
			if ($('.header_menu').css('display') == 'block') {
				$('.header_menu').css('display', 'none');
			} else {
				$('.header_menu').css('display', 'block');
			}
		});
	}

	$(window).on('resize', function () {
		if ($(window).width() > 991) {
			if ($('.header_menu').css('display') == 'none') {
				$('.header_menu').css('display', 'block');
			}
		}
	});
};

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    if ($('.home-slider').length) {

        var rtl = $('html').attr('dir') == 'rtl';

        if ($(window).width() > 768) {

            setHeightSlider();
            homeSlider(0, rtl);
        } else {
            homeSlider(0, rtl);
        }

        $(window).on('resize', function () {

            if ($(window).width() > 768) {
                $('.home-slider').owlCarousel('destroy');
                homeSlider(0, rtl);
            } else {
                $('.home-slider').owlCarousel('destroy');
                homeSlider(0, rtl);
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

    function homeSlider(stagePadding, rtl) {
        var owl = $('.home-slider.owl-carousel').owlCarousel({
            stagePadding: stagePadding,
            margin: 0,
            dots: true,
            nav: false,
            loop: true,
            navSpeed: 400,
            //autoplay: true,
            autoplayTimeout: 5000,
            rtl: rtl,
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

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.logo-slider').length) {

    var rtl = $('html').attr('dir') == 'rtl';

    if ($(window).width() > 768) {
      logoSlider(0, rtl);
    } else {
      logoSlider(0, rtl);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 768) {
        logoSlider(0, rtl);
      } else {
        logoSlider(0, rtl);
      }
    });
  }

  function logoSlider(stagePadding, rtl) {
    $('.logo-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 45,
      dots: false,
      nav: true,
      loop: true,
      rtl: rtl,
      responsive: {
        0: {
          items: 2.5
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

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mapControl = exports.mapControl = function mapControl() {
  var data = [{
    name: 'Agence FAR',
    address: '48 AV des forces armee royales',
    city: 'casablanca',
    type: 'agence'
  }, {
    name: 'Agence SEIZE (16) NOVEMBRE',
    address: '3 Place du 16 novembre',
    city: 'casablanca',
    type: 'agence'
  }, {
    name: 'Agence FAR',
    address: 'Agence ZERKTOUNI',
    city: 'casablanca',
    type: 'centres-affaires'
  }, {
    name: 'Agence ROMANDIE',
    address: '3 et 4,Imm Romandie II boulvard Bir anzarane',
    city: 'casablanca',
    type: 'agence'
  }, {
    name: 'Agence HAJ OMAR ABDELJALIL',
    address: 'KM 7, 3 Route de Rabat Ain sbaa',
    city: 'casablanca',
    type: 'reseau-etranger'
  }, {
    name: 'Agence PORTE D’ANFA',
    address: 'N° 4 ANG BD D’anfa et rue moulay rachid BP 245',
    city: 'casablanca',
    type: 'agence'
  }, {
    name: 'Agence Omar',
    address: '3 et 4,Imm Romandie II boulvard Bir anzarane',
    city: 'casablanca',
    type: 'gab'
  }, {
    name: 'Agence HAJ OMAR ',
    address: 'KM 7, 3 Route de Rabat Ain sbaa',
    city: 'rabat',
    type: 'gab'
  }, {
    name: 'Agence PORTE Rabat',
    address: 'N° 4 ANG BD D’anfa et rue moulay rachid BP 245',
    city: 'tanger',
    type: 'centres-affaires'
  }];

  var inputedSearch = $('#inputed-search');
  var searchResult = $('#search-result');
  var suggestionHolder = $('#suggestions-holder');
  var searchInput = $('#search-input');
  var suggestionsContainer = $('#suggestions-container');
  var mapControlContainer = $('.mapcontrol_container');
  var filters = $('.mapcontrol_options > .btn');

  var state = {
    userInput: '',
    filters: [],
    filtredData: []
  };

  var checkSuggestionsStatus = function checkSuggestionsStatus() {
    if (state.filtredData.length <= 0) {
      mapControlContainer.css('height', '186px');
      suggestionsContainer.hide();
    } else {
      mapControlContainer.css('height', '245px');
      suggestionsContainer.show();
    }
  };

  var applyFilters = function applyFilters() {
    // update inputed search
    inputedSearch.text(state.userInput);

    // filter data by user input
    state.filtredData = data.filter(function (element) {
      return (element.name.toLocaleLowerCase().includes(state.userInput) || element.address.toLocaleLowerCase().includes(state.userInputt) || element.city.toLocaleLowerCase().includes(state.userInput)) && state.userInput != '';
    });

    // Filter data by type
    state.filters.forEach(function (filter) {
      state.filtredData = state.filtredData.filter(function (element) {
        return element.type === filter;
      });
    });

    // update search Result
    searchResult.text('( ' + state.filtredData.length + ' agences trouv\xE9es )');

    // Check wether to display suggestions of not
    checkSuggestionsStatus();
    // render filtred data
    render();
  };

  var filterChanges = function filterChanges() {
    $(this).toggleClass('active'); // change the style of the tag
    state.filters = [];

    filters.each(function () {
      if ($(this).hasClass('active')) {
        state.filters.push($(this).data('value'));
      }
    });

    applyFilters();
  };

  var inputChanges = function inputChanges(e) {
    state.userInput = e.target.value.toLocaleLowerCase();
    applyFilters();
  };

  var render = function render() {
    var content = state.filtredData.map(function (element) {
      return '<div class="suggestions_element">\n                  <h3>' + element.name + '</h3>\n                  <span>' + element.address + '</span>\n                </div>';
    }).join('');

    suggestionHolder.html(content);
  };

  searchInput.on('input', inputChanges);

  filters.on('click', filterChanges);
};

var toggleControl = exports.toggleControl = function toggleControl() {
  $('.mapcontrol_toggle').click(function () {
    $('.mapcontrol').toggleClass('mapcontrol--hide');
  });
};

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDCWD_q5NoEyVblC1mtS2bl08kukrnzDQs&region=MA', function () {
    var mapHolder = document.getElementById('map');
    if (mapHolder) {
      // Define the height of the map
      var topHeaderHeight = 51;
      var mapHeight = $(window).height();
      mapHolder.style.height = mapHeight - topHeaderHeight + 'px';

      var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.120850),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 5,
        disableDefaultUI: true
      };
      var map = new google.maps.Map(mapHolder, mapProp);
    }
  });
};

},{}],20:[function(require,module,exports){
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

        var rtl = $('html').attr('dir') == 'rtl';

        if ($(window).width() > 768) {
            $('.nos-banques .owl-carousel').owlCarousel('destroy');
            banquesSlider(0, rtl);
        } else {
            $('.nos-banques .owl-carousel').owlCarousel('destroy');
            banquesSlider(0, rtl);
        }

        $(window).on('resize', function () {

            if ($(window).width() > 768) {
                $('.nos-banques .owl-carousel').owlCarousel('destroy');
                banquesSlider(0, rtl);
            } else {
                $('.nos-banques .owl-carousel').owlCarousel('destroy');
                banquesSlider(0, rtl);
            }
        });
    }

    function removeHash() {
        history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    function banquesSlider(stagePadding, rtl) {
        var owl = $('.nos-banques .owl-carousel').owlCarousel({
            stagePadding: stagePadding,
            margin: 0,
            dots: true,
            nav: true,
            loop: true,
            URLhashListener: true,
            navSpeed: 1000,
            rtl: rtl,
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

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.header_search').length) {
		addEventListeners();
	}

	function addEventListeners() {
		$('.header_search, .header_mobile-search').on('click', function () {
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

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.swipebox--video').length) {
		addEventListeners();
	}

	function addEventListeners() {
		$('.swipebox--video').on('click', function () {
			$('.page-content').addClass('d-none');
			$('.popup-video').removeClass('d-none');
		});

		$('.close-wrapper').on('click', function () {
			$('.page-content').removeClass('d-none');
			$('.popup-video_section iframe').remove();
			$('.popup-video').addClass('d-none');
		});

		$('.swipebox--video').on('click', function (e) {
			var ytbId = $(this).attr('href');

			e.preventDefault();
			playVideo(ytbId);
		});

		$('.popup-video_slider .swipebox--video').on('click', function (e) {
			var ytbId = $(this).attr('href');

			e.preventDefault();
			playVideo(ytbId);
		});
	}

	function playVideo(ytbId) {

		var html = '<iframe  width="100%" height="400" \n\t\t\t\t\t\tsrc="https://www.youtube.com/embed/' + ytbId + '?autoplay=1" \n\t\t\t\t\t\tframeborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';

		$('.popup-video_section iframe').remove();

		$('.popup-video_section').prepend(html);
	}

	// carousel video
	if ($('.popup-video_slider').length) {

		var rtl = $('html').attr('dir') == 'rtl';

		if ($(window).width() > 768) {
			popupVideoSlider(0, rtl);
		} else {
			popupVideoSlider(20, rtl);
		}

		$(window).on('resize', function () {
			if ($(window).width() > 768) {
				popupVideoSlider(0, rtl);
			} else {
				popupVideoSlider(20, rtl);
			}
		});
	}

	function popupVideoSlider(stagePadding, rtl) {
		$('.popup-video_slider.owl-carousel').owlCarousel({
			stagePadding: stagePadding,
			margin: 10,
			dots: false,
			nav: false,
			loop: false,
			rtl: rtl,
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 5
				}
			}
		});
	}
};

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.pub-slider').length) {
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
    $('.pub-slider.owl-carousel').owlCarousel({
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
          items: 1
        }
      }
    });
  }
};

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	$('select.nice-select').niceSelect();
};

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.swipebox').length) {
		//$('.swipebox').swipebox();
	}
};

},{}],26:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2pzL21haW4uanMiLCJzcmMvY29tcG9uZW50cy9hY3R1YWxpdGUtc2xpZGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvYXJ0aWNsZS1zbGlkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9iZXNvaW4tYWlkZS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2NhcmQvY2FyZC1hY3R1YWxpdGVzLmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLWhpc3RvaXJlLmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLXJhcHBvcnQuanMiLCJzcmMvY29tcG9uZW50cy9jYXJkL2NhcmQtc2xpZGVyLmpzIiwic3JjL2NvbXBvbmVudHMvZGF0ZS1maWx0ZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9kYXRlLXNsaWRlci9kYXRlLXNsaWRlci5qcyIsInNyYy9jb21wb25lbnRzL2ZpbmFuY2UvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9mb290ZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9mb3JtL2Zvcm0tdXBsb2FkLmpzIiwic3JjL2NvbXBvbmVudHMvZm9ybS9mb3JtLXZhbGlkYXRpb24uanMiLCJzcmMvY29tcG9uZW50cy9oZWFkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9ob21lLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2xvZ28tc2xpZGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvbWFwLWNvbnRyb2wvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9tYXAvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9ub3MtYmFucXVlcy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3BvcHVwLXNlYXJjaC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3BvcHVwLXZpZGVvL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvcHViLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3NlbGVjdC1maWx0ZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9zd2lwZWJveC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3RvcC1oZWFkZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBTUEsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFXO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxDQTNCRDs7Ozs7Ozs7O2tCQzlCZSxZQUFZO0FBQ3pCLE1BQUksRUFBRSxtQkFBRixFQUF1QixNQUEzQixFQUFtQztBQUNqQyxRQUFJLEVBQUUsTUFBRixFQUFVLEtBQVYsS0FBb0IsR0FBeEIsRUFBNkI7QUFDM0Isb0JBQWMsQ0FBZDtBQUNELEtBRkQsTUFFTztBQUNMLG9CQUFjLENBQWQ7QUFDRDs7QUFFRCxNQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixZQUFZO0FBQ2pDLFVBQUksRUFBRSxNQUFGLEVBQVUsS0FBVixLQUFvQixHQUF4QixFQUE2QjtBQUMzQixzQkFBYyxDQUFkO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsc0JBQWMsQ0FBZDtBQUNEO0FBQ0YsS0FORDtBQU9EOztBQUVELFdBQVMsYUFBVCxDQUF3QixZQUF4QixFQUFz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QUFnRSxVQUFTLENBQVQsRUFBWTtBQUN4RSxVQUFFLGNBQUY7QUFDQSxVQUFFLElBQUYsRUFBUSxXQUFSLENBQW9CLE1BQXBCO0FBQ0EsVUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLFdBQWIsRUFBMEIsV0FBMUIsQ0FBc0MsUUFBdEM7QUFDSCxLQUpEOztBQU1BLE1BQUUsR0FBRixFQUFPLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLFVBQVMsQ0FBVCxFQUFZOztBQUUzQixZQUFJLENBQUMsRUFBRSxRQUFGLENBQVcsRUFBRSxrQkFBRixFQUFzQixDQUF0QixDQUFYLEVBQXFDLEVBQUUsRUFBRSxNQUFKLEVBQVksQ0FBWixDQUFyQyxDQUFELEtBQ0MsRUFBRSxPQUFGLEVBQVcsUUFBWCxDQUFvQixNQUFwQixLQUNELEVBQUUsT0FBRixFQUFXLFFBQVgsQ0FBb0IsTUFBcEIsQ0FGQSxDQUFKLEVBRW1DOztBQUUvQjtBQUNIO0FBQ0osS0FSRDs7QUFVQSxhQUFTLGNBQVQsR0FBMEI7QUFDdEIsWUFBSSxFQUFFLHdCQUFGLEVBQTRCLFFBQTVCLENBQXFDLE1BQXJDLENBQUosRUFBa0Q7QUFDOUMsY0FBRSx3QkFBRixFQUE0QixXQUE1QixDQUF3QyxNQUF4QztBQUNBLGNBQUUsd0JBQUYsRUFBNEIsSUFBNUIsQ0FBaUMsV0FBakMsRUFBOEMsV0FBOUMsQ0FBMEQsUUFBMUQ7QUFDSDs7QUFFRCxZQUFJLEVBQUUsd0JBQUYsRUFBNEIsUUFBNUIsQ0FBcUMsTUFBckMsQ0FBSixFQUFrRDtBQUM5QyxjQUFFLHdCQUFGLEVBQTRCLFdBQTVCLENBQXdDLE1BQXhDO0FBQ0EsY0FBRSx3QkFBRixFQUE0QixJQUE1QixDQUFpQyxXQUFqQyxFQUE4QyxXQUE5QyxDQUEwRCxRQUExRDtBQUNIO0FBQ0o7QUFDSixDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgc2VsZWN0IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvc2VsZWN0LWZpbHRlci9pbmRleC5qcyc7XHJcbmltcG9ydCB0b3BIZWFkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy90b3AtaGVhZGVyL2luZGV4LmpzJztcclxuaW1wb3J0IGhlYWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2hlYWRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBmb290ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9mb290ZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgY2FyZFNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NhcmQvY2FyZC1zbGlkZXIuanMnO1xyXG5pbXBvcnQgZGF0ZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2RhdGUtc2xpZGVyL2RhdGUtc2xpZGVyLmpzJztcclxuaW1wb3J0IGxvZ29TbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9sb2dvLXNsaWRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBmaW5hbmNlIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZmluYW5jZS9pbmRleC5qcyc7XHJcbmltcG9ydCBiYW5xdWVzU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbm9zLWJhbnF1ZXMvaW5kZXguanMnO1xyXG5pbXBvcnQgaG9tZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2hvbWUtc2xpZGVyL2luZGV4LmpzJztcclxuaW1wb3J0IGJlc29pbkFpZGUgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9iZXNvaW4tYWlkZS9pbmRleC5qcyc7XHJcbmltcG9ydCBzd2lwZWJveCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3N3aXBlYm94L2luZGV4LmpzJztcclxuaW1wb3J0IGRhdGVmaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kYXRlLWZpbHRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBhcnRpY2xlU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYXJ0aWNsZS1zbGlkZXIvaW5kZXguanMnO1xyXG5pbXBvcnQgY2FyZFJhcHBvcnQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtcmFwcG9ydC5qcyc7XHJcbmltcG9ydCBwb3B1cFNlYXJjaCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3BvcHVwLXNlYXJjaC9pbmRleC5qcyc7XHJcbmltcG9ydCBwb3B1cFZpZGVvIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvcG9wdXAtdmlkZW8vaW5kZXguanMnO1xyXG5pbXBvcnQgYWN0dWFsaXRlU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYWN0dWFsaXRlLXNsaWRlci9pbmRleC5qcyc7XHJcbmltcG9ydCBwdWJTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9wdWItc2xpZGVyL2luZGV4LmpzJztcclxuaW1wb3J0IGZvcm1WYWxpZGF0aW9uIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZm9ybS9mb3JtLXZhbGlkYXRpb24uanMnO1xyXG5pbXBvcnQgZm9ybVVwbG9hZCBmcm9tICcuLi8uLi9jb21wb25lbnRzL2Zvcm0vZm9ybS11cGxvYWQuanMnO1xyXG5pbXBvcnQgY2FyZEFjdHVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtYWN0dWFsaXRlcy5qcyc7XHJcbmltcG9ydCBjYXJkSGlzdG9pcmVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtaGlzdG9pcmUuanMnO1xyXG5pbXBvcnQgbWFwIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbWFwL2luZGV4LmpzJztcclxuaW1wb3J0IHtcclxuICBtYXBDb250cm9sLFxyXG4gIHRvZ2dsZUNvbnRyb2xcclxufSBmcm9tICcuLi8uLi9jb21wb25lbnRzL21hcC1jb250cm9sL2luZGV4LmpzJztcclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHRzZWxlY3QoKTtcclxuXHR0b3BIZWFkZXIoKTtcclxuXHRoZWFkZXIoKTtcclxuXHRmb290ZXIoKTtcclxuXHRjYXJkU2xpZGVyKCk7XHJcblx0ZGF0ZVNsaWRlcigpO1xyXG5cdGxvZ29TbGlkZXIoKTtcclxuXHRmaW5hbmNlKCk7XHJcblx0YmFucXVlc1NsaWRlcigpO1xyXG5cdGhvbWVTbGlkZXIoKTtcclxuXHRiZXNvaW5BaWRlKCk7XHJcblx0c3dpcGVib3goKTtcclxuXHRkYXRlZmlsdGVyKCk7XHJcblx0YXJ0aWNsZVNsaWRlcigpO1xyXG5cdGNhcmRSYXBwb3J0KCk7XHJcblx0cG9wdXBTZWFyY2goKTtcclxuXHRwb3B1cFZpZGVvKCk7XHJcblx0YWN0dWFsaXRlU2xpZGVyKCk7XHJcbiAgcHViU2xpZGVyKCk7XHJcbiAgZm9ybVZhbGlkYXRpb24oKTtcclxuICBmb3JtVXBsb2FkKCk7XHJcbiAgY2FyZEFjdHVTbGlkZXIoKTtcclxuICBjYXJkSGlzdG9pcmVTbGlkZXIoKTtcclxuICBtYXAoKTtcclxuICBtYXBDb250cm9sKCk7XHJcbiAgdG9nZ2xlQ29udHJvbCgpO1xyXG59KTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCQoJy5hY3R1YWxpdGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgfVxyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuICAgICAgICBhcnRpY2xlU2xpZGVyKDApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXJ0aWNsZVNsaWRlciAoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAkKCcuYWN0dWFsaXRlLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICBtYXJnaW46IDE4LFxyXG4gICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICBuYXY6IHRydWUsXHJcbiAgICAgIG1lcmdlOiB0cnVlLFxyXG4gICAgICBsb29wOiB0cnVlLFxyXG4gICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgMDoge1xyXG4gICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICB9LFxyXG4gICAgICAgIDk5Mjoge1xyXG4gICAgICAgICAgaXRlbXM6IDNcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG5cdGlmICgkKCcuYXJ0aWNsZS1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuXHRcdFx0YXJ0aWNsZVNsaWRlcigwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFydGljbGVTbGlkZXIoMzIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuXHRcdFx0XHRhcnRpY2xlU2xpZGVyKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFydGljbGVTbGlkZXIoMzIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhcnRpY2xlU2xpZGVyKHN0YWdlUGFkZGluZykge1xyXG4gICAgICAgICQoJy5hcnRpY2xlLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDEwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmJlc29pbi1haWRlJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0JCgnLmJlc29pbi1haWRlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcucXVlc3Rpb25zJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRpZiAoJCgnLmNhcmQtYWN0dWFsaXRlcy1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gOTkxKSB7XHJcbiAgICAgICAgICAgIFxyXG5cdFx0XHRjYXJkQWN0dVNsaWRlcig0OCwgcnRsKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgJCgnLmNhcmQtYWN0dWFsaXRlcy1zbGlkZXInKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA8PSA5OTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcuY2FyZC1hY3R1YWxpdGVzLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcblx0XHRcdFx0Y2FyZEFjdHVTbGlkZXIoNDgsIHJ0bCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICQoJy5jYXJkLWFjdHVhbGl0ZXMtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjYXJkQWN0dVNsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgICAgICQoJy5jYXJkLWFjdHVhbGl0ZXMtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTYsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgIHJ0bDogcnRsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0aWYgKCQoJy5jYXJkLWhpc3RvaXJlLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgdmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gNzY4KSB7XHJcblxyXG5cdFx0XHRjYXJkSGlzdG9pcmVTbGlkZXIoNDgsIHJ0bCk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmNhcmQtaGlzdG9pcmUtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpIDw9IDc2OCkge1xyXG5cclxuXHRcdFx0XHRjYXJkSGlzdG9pcmVTbGlkZXIoNDgsIHJ0bCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJy5jYXJkLWhpc3RvaXJlLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2FyZEhpc3RvaXJlU2xpZGVyKHN0YWdlUGFkZGluZywgcnRsKSB7XHJcbiAgICAgICAgJCgnLmNhcmQtaGlzdG9pcmUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogNSxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgcnRsOiBydGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCcpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRyYXBwb3J0U2xpZGVyKDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmFwcG9ydFNsaWRlcigwKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0cmFwcG9ydFNsaWRlcigwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyYXBwb3J0U2xpZGVyKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByYXBwb3J0U2xpZGVyKHN0YWdlUGFkZGluZykge1xyXG4gICAgICAgIHZhciBvd2wgPSAkKCcuY2FyZC0tcmFwcG9ydC1yaWdodC5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLmNhcmQtLXJhcHBvcnQtcmlnaHQgLndyYXBwZXJfYnRuIC5uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHQgICAgb3dsLnRyaWdnZXIoJ25leHQub3dsLmNhcm91c2VsJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBHbyB0byB0aGUgcHJldmlvdXMgaXRlbVxyXG5cdFx0JCgnLmNhcmQtLXJhcHBvcnQtcmlnaHQgLndyYXBwZXJfYnRuIC5wcmV2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHQgICAgLy8gV2l0aCBvcHRpb25hbCBzcGVlZCBwYXJhbWV0ZXJcclxuXHRcdCAgICAvLyBQYXJhbWV0ZXJzIGhhcyB0byBiZSBpbiBzcXVhcmUgYnJhY2tldCAnW10nXHJcblx0XHQgICAgb3dsLnRyaWdnZXIoJ3ByZXYub3dsLmNhcm91c2VsJyk7XHJcblx0XHR9KTtcclxuXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGlmICgkKCcuY2FyZC1zbGlkZXItd3JhcHBlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRjYXJkU2xpZGVyUGFnZSgxNik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjYXJkU2xpZGVyUGFnZSgwKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0Y2FyZFNsaWRlclBhZ2UoMTYpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNhcmRTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNhcmRTbGlkZXJQYWdlKHN0YWdlUGFkZGluZykge1xyXG4gICAgICAgICQoJy5jYXJkLXNsaWRlci13cmFwcGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTYsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiAyXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmRhdGUtZmlsdGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0JCgnLnN0YXJ0IC5kYXRlLWZpbHRlcl9hcnJvd3MgYTpmaXJzdC1jaGlsZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKCQoJy5zdGFydCAuZGF0ZS1maWx0ZXJfbW9udGggaW5wdXQnKS52YWwoKSk7XHJcblx0XHRcdFxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5zdGFydCAuZGF0ZS1maWx0ZXJfYXJyb3dzIGE6bGFzdC1jaGlsZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5kYXRlLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRkYXRlU2xpZGVyUGFnZSgwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRkYXRlU2xpZGVyUGFnZSgwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkYXRlU2xpZGVyUGFnZSgwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZGF0ZVNsaWRlclBhZ2Uoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmRhdGUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogNSxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDEwXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDE1XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5maW5hbmNlLmxlbmd0aCcpKSB7XHJcblxyXG5cdFx0JCgnLmZpbmFuY2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHR2YXIgY3VycmVudEl0ZW0gPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0JCgnLmZpbmFuY2UnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWwpIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoJChlbClbMF0gIT09IGN1cnJlbnRJdGVtWzBdKSB7XHJcblx0XHRcdFx0XHRcdCQoZWwpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuZm9vdGVyX3RpdGxlJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0JCgnLmZvb3Rlcl90aXRsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQodGhpcykubmV4dCgndWwnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnKSB7XHJcblxyXG5cdFx0XHRcdCQoJy5mb290ZXJfdGl0bGUgKyB1bC5vcGVuJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHRcdFx0XHQkKCcuZm9vdGVyX3RpdGxlICsgdWwub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0XHRcdCQodGhpcykubmV4dCgndWwnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHRcdFx0XHQkKHRoaXMpLm5leHQoJ3VsJykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdCQodGhpcykubmV4dCgndWwnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cdFx0XHRcdCQodGhpcykubmV4dCgndWwnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCAkKHdpbmRvdykud2lkdGgoKSA+IDc2OCApIHtcclxuXHRcdFx0XHQkKCcuZm9vdGVyX3RpdGxlICsgdWwnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHRcdFx0XHQkKCcuZm9vdGVyX3RpdGxlICsgdWwub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCgnLmZvb3Rlcl90aXRsZSArIHVsJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcblxyXG5cdC8qIFZhcmlhYmxlcyAqL1xyXG5cclxuICAgIHZhciAkZm9ybSA9ICQoJy5mb3JtLXN0YWdlJyk7XHJcbiAgICB2YXIgJGZvcm1Ecm9wID0gJCgnLmZvcm1fZHJvcCcpO1xyXG4gICAgdmFyICRpbnB1dCA9ICRmb3JtLmZpbmQoJ2lucHV0W3R5cGU9ZmlsZV0nKTtcclxuICAgIHZhciBkcm9wcGVkRmlsZXMgPSBmYWxzZTtcclxuXHJcblxyXG4gICAgLyogRnVuY3Rpb25zICovXHJcblxyXG4gICAgdmFyIGlzQWR2YW5jZWRVcGxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcmV0dXJuICgoJ2RyYWdnYWJsZScgaW4gZGl2KSB8fCAoJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2KSkgJiYgJ0Zvcm1EYXRhJyBpbiB3aW5kb3cgJiYgJ0ZpbGVSZWFkZXInIGluIHdpbmRvdztcclxuICAgIH0oKTtcclxuXHJcbiAgICB2YXIgYWRkZmlsZURvbSA9IGZ1bmN0aW9uKGZpbGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhmaWxlKTtcclxuXHJcbiAgICAgICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbWQtNiBtYi0yXCI+XHJcblx0ICAgICAgICBcdFx0XHQ8ZGl2IGNsYXNzPVwiZm9ybV9maWxlXCIgaWQ9XCIke2ZpbGUubmFtZSArIHBhcnNlSW50KGZpbGUuc2l6ZSAvIDEwMjQpfVwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndyYXBwZXIgZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hlY2sgZC1ub25lXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWNoZWNrLWZpbGVcIj48L3VzZT5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGRmXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXBkZi1maWxlXCI+PC91c2U+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibmFtZVwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZmlsZS5uYW1lfVxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJzaXplXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtwYXJzZUludChmaWxlLnNpemUgLyAxMDI0KX1LQlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJyZW1vdmUgZC1ub25lXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXJlbW92ZS1maWxlXCI+PC91c2U+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxvYWRpbmdcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYXJnZW1lbnQgZW4gY291cnMgPHNwYW4gY2xhc3M9XCJwZXJjZW50YWdlXCI+PC9zcGFuPiAlXHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjcm9zc1wiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2Zz5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1jcm9zcy1maWxlXCI+PC91c2U+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgc3R5bGU9XCJ3aWR0aDogMCVcIj48L2Rpdj5cclxuXHRcdFx0ICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICAgICAgPC9kaXY+YDtcclxuXHJcblx0XHQkKCcuZm9ybV9maWxlcycpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBzZW5kRmlsZXMgPSBmdW5jdGlvbihmaWxlcykge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZmlsZXMpO1xyXG5cclxuICAgICAgICB2YXIgYWpheERhdGEgPSBuZXcgRm9ybURhdGEoJGZvcm0uZ2V0KDApKTtcclxuXHJcbiAgICAgICAgJC5lYWNoKGRyb3BwZWRGaWxlcywgZnVuY3Rpb24oaSwgZmlsZSkge1xyXG5cclxuICAgICAgICBcdHZhciBmaWxlSWQgPSBmaWxlLm5hbWUgKyBwYXJzZUludChmaWxlLnNpemUgLyAxMDI0KTtcclxuICAgICAgICAgICAgYWpheERhdGEuYXBwZW5kKGZpbGVJZCwgZmlsZSk7XHJcblxyXG4gICAgICAgICAgICBhZGRmaWxlRG9tKGZpbGUpO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHhocjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcInByb2dyZXNzXCIsIGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0gZXZ0LmxvYWRlZCAvIGV2dC50b3RhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlSWQgPSBmaWxlLm5hbWUgKyBwYXJzZUludChmaWxlLnNpemUgLyAxMDI0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlRG9tID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWxlSWQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZXJjZW50YWdlRG9tID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWxlSWQpKS5maW5kKCcucGVyY2VudGFnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb2dyZXNzQmFyID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWxlSWQpKS5maW5kKCcucHJvZ3Jlc3MtYmFyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQocGVyY2VudENvbXBsZXRlICogMTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50YWdlRG9tLmFwcGVuZChwZXJjZW50Q29tcGxldGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuY3NzKCd3aWR0aCcsIHBlcmNlbnRDb21wbGV0ZSArICclJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocGVyY2VudENvbXBsZXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVyY2VudENvbXBsZXRlID09PSAxMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdFx0ZmlsZURvbS5maW5kKCcucHJvZ3Jlc3MtYmFyJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdGZpbGVEb20uZmluZCgnLmxvYWRpbmcnKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx0ZmlsZURvbS5maW5kKCcucmVtb3ZlJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdGZpbGVEb20uZmluZCgnLmNyb3NzJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx0fSwgMzAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geGhyO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FjdGlvbi91cGxvYWRmaWxlJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICRmb3JtLmF0dHIoJ21ldGhvZCcpLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogYWpheERhdGEsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdpcy11cGxvYWRpbmcnKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYWRkQ2xhc3MoZGF0YS5zdWNjZXNzID09IHRydWUgPyAnaXMtc3VjY2VzcycgOiAnaXMtZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGEuc3VjY2VzcykgY29uc29sZS5sb2coJ3VwbG9hZCBlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBMb2cgdGhlIGVycm9yLCBzaG93IGFuIGFsZXJ0LCB3aGF0ZXZlciB3b3JrcyBmb3IgeW91XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnLnJlbW92ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdCAgICBcdHZhciByZW1vdmVJZCA9ICQodGhpcykuY2xvc2VzdCgnLmZvcm1fZmlsZScpLmF0dHIoJ2lkJyk7XHJcblxyXG5cdFx0ICAgIFx0cmVtb3ZlRmlsZShyZW1vdmVJZCk7XHJcblx0XHQgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciByZW1vdmVGaWxlID0gZnVuY3Rpb24oaWQpIHtcclxuICAgIFx0dmFyIGZpbGUgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkucGFyZW50KCk7XHJcbiAgICBcdGZpbGUucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG5cdC8qIERyYWcgYW5kIGRyb3AgTGlzdGVuZXIgKi9cclxuXHJcbiAgICBpZiAoaXNBZHZhbmNlZFVwbG9hZCkge1xyXG4gICAgICAgIC8vIEJyb3dzZXIgc3VwcG9ydCBEcmFnIGFuZCBEcm9wXHJcblxyXG4gICAgICAgICRmb3JtRHJvcC5vbignZHJhZyBkcmFnc3RhcnQgZHJhZ2VuZCBkcmFnb3ZlciBkcmFnZW50ZXIgZHJhZ2xlYXZlIGRyb3AnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ2RyYWdvdmVyIGRyYWdlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJGZvcm1Ecm9wLmFkZENsYXNzKCdpcy1kcmFnb3ZlcicpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ2RyYWdsZWF2ZSBkcmFnZW5kIGRyb3AnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICRmb3JtRHJvcC5yZW1vdmVDbGFzcygnaXMtZHJhZ292ZXInKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdkcm9wJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZHJvcHBlZEZpbGVzID0gZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcztcclxuICAgICAgICAgICAgICAgIHNlbmRGaWxlcyhkcm9wcGVkRmlsZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJGlucHV0Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgXHRkcm9wcGVkRmlsZXMgPSBlLnRhcmdldC5maWxlcztcclxuICAgICAgICAgICAgc2VuZEZpbGVzKGUudGFyZ2V0LmZpbGVzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvL2ZhbGxiYWNrIGZvciBJRTktIGJyb3dzZXJzXHJcbiAgICB9XHJcblxyXG4gICAgLyogU3VibWl0IExpc3RlbmVyICovXHJcblxyXG4gICAgJGZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoJGZvcm0uaGFzQ2xhc3MoJ2lzLXVwbG9hZGluZycpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdpcy11cGxvYWRpbmcnKS5yZW1vdmVDbGFzcygnaXMtZXJyb3InKTtcclxuXHJcbiAgICAgICAgaWYgKGlzQWR2YW5jZWRVcGxvYWQpIHtcclxuICAgICAgICAgICAgLy8gYWpheCBmb3IgbW9kZXJuIGJyb3dzZXJzXHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBGb3JtIElucHV0IERhdGFcclxuICAgICAgICAgICAgdmFyIGFqYXhEYXRhID0ge307XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAkZm9ybS5hdHRyKCdhY3Rpb24nKSxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICRmb3JtLmF0dHIoJ21ldGhvZCcpLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogYWpheERhdGEsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBMb2cgdGhlIGVycm9yLCBzaG93IGFuIGFsZXJ0LCB3aGF0ZXZlciB3b3JrcyBmb3IgeW91XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBhamF4IGZvciBJRTktIGJyb3dzZXJzXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgICAkKFwiZm9ybVtuYW1lPSdmb3JtLXN0YWdlJ11cIikudmFsaWRhdGUoe1xyXG5cclxuICAgICAgICAvLyBTcGVjaWZ5IHZhbGlkYXRpb24gcnVsZXNcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBmaXJzdG5hbWU6ICdyZXF1aXJlZCcsXHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiAncmVxdWlyZWQnLFxyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZGlnaXRzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcnZpY2U6ICdyZXF1aXJlZCcsXHJcbiAgICAgICAgICAgIGZvcm1hdGlvbjogJ3JlcXVpcmVkJyxcclxuICAgICAgICAgICAgc3RhZ2U6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAndHlwZS1mb3JtYXRpb24nOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBTcGVjaWZ5IHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXNcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBmaXJzdG5hbWU6ICdWZXVpbGxleiBlbnRyZXIgdm90cmUgcHLDqW5vbScsXHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiAnVmV1aWxsZXogZW50cmVyIHZvdHJlIG5vbScsXHJcbiAgICAgICAgICAgIGVtYWlsOiAnVmV1aWxsZXogZW50cmVyIHVuIGVtYWlsIHZhbGlkZScsXHJcbiAgICAgICAgICAgIHRlbDogJ1ZldWlsbGV6IGVudHJlciB1biBudW3DqXJvIGRlIHTDqWzDqXBob25lIHZhbGlkZSAoMTAgY2FyYWN0w6hyZXMgbWluKScsXHJcbiAgICAgICAgICAgICd0eXBlLWZvcm1hdGlvbic6ICdWZXVpbGxleiBlbnRyZXIgdW4gdHlwZSBkZSBmb3JtYXRpb24nLFxyXG4gICAgICAgICAgICAnY29uZGl0aW9ucyc6ICdWZXVpbGxleiBhY2NlcHRleiBsZXMgY29uZGl0aW9ucyBnw6luw6lyYWxlcyBkXFwndXRpbGlzYXRpb24nLFxyXG4gICAgICAgICAgICAnc2VydmljZSc6ICdWZXVpbGxleiBjaG9pc2lyIHVuIHNlcnZpY2UnLFxyXG4gICAgICAgICAgICAnZm9ybWF0aW9uJzogJ1ZldWlsbGV6IGNob2lzaXIgdW5lIGZvcm1hdGlvbicsXHJcbiAgICAgICAgICAgICdzdGFnZSc6ICdWZXVpbGxleiBjaG9pc2lyIHVuIHR5cGUgZGUgc3RhZ2UnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PSAncmFkaW8nIHx8IGVsZW1lbnQuYXR0cigndHlwZScpID09ICdjaGVja2JveCcpICYmIGVsZW1lbnQuYXR0cignbmFtZScpICE9ICdjb25kaXRpb25zJykge1xyXG4gICAgICAgICAgICBcdGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQucGFyZW50KCkucGFyZW50KCkpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmKGVsZW1lbnQuYXR0cignbmFtZScpID09ICdjb25kaXRpb25zJyl7XHJcbiAgICAgICAgICAgIFx0ZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudC5wYXJlbnQoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgZm9ybSBpcyBzdWJtaXR0ZWQgdG8gdGhlIGRlc3RpbmF0aW9uIGRlZmluZWRcclxuICAgICAgICAvLyBpbiB0aGUgXCJhY3Rpb25cIiBhdHRyaWJ1dGUgb2YgdGhlIGZvcm0gd2hlbiB2YWxpZFxyXG4gICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uKGZvcm0pIHtcclxuICAgICAgICAgICAgZm9ybS5zdWJtaXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmhlYWRlcl9tb2JpbGUtbWVudScpLmxlbmd0aCkge1xyXG5cdFx0JCgnLmhlYWRlcl9tb2JpbGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQoJy5oZWFkZXJfbWVudScpLmNzcygnZGlzcGxheScpID09ICdibG9jaycpIHtcclxuXHRcdFx0XHQkKCcuaGVhZGVyX21lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJy5oZWFkZXJfbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcblx0XHRcdGlmICgkKCcuaGVhZGVyX21lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PSAnbm9uZScpIHtcclxuXHRcdFx0XHQkKCcuaGVhZGVyX21lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuaG9tZS1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHJcblx0XHRcdHNldEhlaWdodFNsaWRlcigpO1xyXG4gICAgICAgICAgICBob21lU2xpZGVyKDAsIHJ0bCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGhvbWVTbGlkZXIoMCwgcnRsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ob21lLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBob21lU2xpZGVyKDAsIHJ0bCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuaG9tZS1zbGlkZXInKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgaG9tZVNsaWRlcigwLCBydGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRIZWlnaHRTbGlkZXIoKSB7XHJcblx0XHR2YXIgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cdFx0dmFyIHRvcEhlYWRlckhlaWdodCA9ICQoJy50b3AtaGVhZGVyJykuaGVpZ2h0KCk7XHJcblx0XHR2YXIgaGVhZGVySGVpZ2h0ID0gJCgnLmhlYWRlcicpLmhlaWdodCgpO1xyXG5cclxuXHRcdHZhciBzbGlkZXJIZWlnaHQgPSB3aW5kb3dIZWlnaHQgLSB0b3BIZWFkZXJIZWlnaHQgLSBoZWFkZXJIZWlnaHQ7XHJcblxyXG5cdFx0dmFyIHNsaWRlciA9ICQoJy5ob21lLXNsaWRlcicpO1xyXG5cdFx0dmFyIHNsaWRlckl0ZW0gPSAkKCcuaG9tZS1zbGlkZXJfaXRlbScpO1xyXG5cclxuXHRcdHNsaWRlci5jc3MoJ21heC1oZWlnaHQnLCBzbGlkZXJIZWlnaHQpO1xyXG5cdFx0c2xpZGVySXRlbS5jc3MoJ21heC1oZWlnaHQnLCBzbGlkZXJIZWlnaHQpO1xyXG5cdFx0XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBob21lU2xpZGVyKHN0YWdlUGFkZGluZywgcnRsKSB7XHJcblx0XHR2YXIgb3dsID0gJCgnLmhvbWUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMCxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2U3BlZWQ6IDQwMCxcclxuICAgICAgICAgICAgLy9hdXRvcGxheTogdHJ1ZSxcclxuXHRcdFx0YXV0b3BsYXlUaW1lb3V0OjUwMDAsXHJcbiAgICAgICAgICAgIHJ0bDogcnRsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDEsXHJcbiAgICAgICAgICAgICAgICBcdGRvdHNEYXRhOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcubG9nby1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0bG9nb1NsaWRlcigwLCBydGwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bG9nb1NsaWRlcigwLCBydGwpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRsb2dvU2xpZGVyKDAsIHJ0bCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bG9nb1NsaWRlcigwLCBydGwpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBsb2dvU2xpZGVyKHN0YWdlUGFkZGluZywgcnRsKSB7XHJcbiAgICAgICAgJCgnLmxvZ28tc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogNDUsXHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIHJ0bDogcnRsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDIuNVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDk5Mjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiA1XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgbGV0IG1hcENvbnRyb2wgPSBmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3QgZGF0YSA9IFtcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0FnZW5jZSBGQVInLFxyXG4gICAgICBhZGRyZXNzOiAnNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzJyxcclxuICAgICAgY2l0eTogJ2Nhc2FibGFuY2EnLFxyXG4gICAgICB0eXBlOiAnYWdlbmNlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0FnZW5jZSBTRUlaRSAoMTYpIE5PVkVNQlJFJyxcclxuICAgICAgYWRkcmVzczogJzMgUGxhY2UgZHUgMTYgbm92ZW1icmUnLFxyXG4gICAgICBjaXR5OiAnY2FzYWJsYW5jYScsXHJcbiAgICAgIHR5cGU6ICdhZ2VuY2UnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnQWdlbmNlIEZBUicsXHJcbiAgICAgIGFkZHJlc3M6ICdBZ2VuY2UgWkVSS1RPVU5JJyxcclxuICAgICAgY2l0eTogJ2Nhc2FibGFuY2EnLFxyXG4gICAgICB0eXBlOiAnY2VudHJlcy1hZmZhaXJlcydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdBZ2VuY2UgUk9NQU5ESUUnLFxyXG4gICAgICBhZGRyZXNzOiAnMyBldCA0LEltbSBSb21hbmRpZSBJSSBib3VsdmFyZCBCaXIgYW56YXJhbmUnLFxyXG4gICAgICBjaXR5OiAnY2FzYWJsYW5jYScsXHJcbiAgICAgIHR5cGU6ICdhZ2VuY2UnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnQWdlbmNlIEhBSiBPTUFSIEFCREVMSkFMSUwnLFxyXG4gICAgICBhZGRyZXNzOiAnS00gNywgMyBSb3V0ZSBkZSBSYWJhdCBBaW4gc2JhYScsXHJcbiAgICAgIGNpdHk6ICdjYXNhYmxhbmNhJyxcclxuICAgICAgdHlwZTogJ3Jlc2VhdS1ldHJhbmdlcidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdBZ2VuY2UgUE9SVEUgROKAmUFORkEnLFxyXG4gICAgICBhZGRyZXNzOiAnTsKwIDQgQU5HIEJEIETigJlhbmZhIGV0IHJ1ZSBtb3VsYXkgcmFjaGlkIEJQIDI0NScsXHJcbiAgICAgIGNpdHk6ICdjYXNhYmxhbmNhJyxcclxuICAgICAgdHlwZTogJ2FnZW5jZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdBZ2VuY2UgT21hcicsXHJcbiAgICAgIGFkZHJlc3M6ICczIGV0IDQsSW1tIFJvbWFuZGllIElJIGJvdWx2YXJkIEJpciBhbnphcmFuZScsXHJcbiAgICAgIGNpdHk6ICdjYXNhYmxhbmNhJyxcclxuICAgICAgdHlwZTogJ2dhYidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdBZ2VuY2UgSEFKIE9NQVIgJyxcclxuICAgICAgYWRkcmVzczogJ0tNIDcsIDMgUm91dGUgZGUgUmFiYXQgQWluIHNiYWEnLFxyXG4gICAgICBjaXR5OiAncmFiYXQnLFxyXG4gICAgICB0eXBlOiAnZ2FiJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0FnZW5jZSBQT1JURSBSYWJhdCcsXHJcbiAgICAgIGFkZHJlc3M6ICdOwrAgNCBBTkcgQkQgROKAmWFuZmEgZXQgcnVlIG1vdWxheSByYWNoaWQgQlAgMjQ1JyxcclxuICAgICAgY2l0eTogJ3RhbmdlcicsXHJcbiAgICAgIHR5cGU6ICdjZW50cmVzLWFmZmFpcmVzJ1xyXG4gICAgfVxyXG4gIF1cclxuXHJcbiAgbGV0IGlucHV0ZWRTZWFyY2ggPSAkKCcjaW5wdXRlZC1zZWFyY2gnKVxyXG4gIGxldCBzZWFyY2hSZXN1bHQgPSAkKCcjc2VhcmNoLXJlc3VsdCcpXHJcbiAgbGV0IHN1Z2dlc3Rpb25Ib2xkZXIgPSAkKCcjc3VnZ2VzdGlvbnMtaG9sZGVyJylcclxuICBsZXQgc2VhcmNoSW5wdXQgPSAkKCcjc2VhcmNoLWlucHV0JylcclxuICBsZXQgc3VnZ2VzdGlvbnNDb250YWluZXIgPSAkKCcjc3VnZ2VzdGlvbnMtY29udGFpbmVyJylcclxuICBsZXQgbWFwQ29udHJvbENvbnRhaW5lciA9ICQoJy5tYXBjb250cm9sX2NvbnRhaW5lcicpXHJcbiAgbGV0IGZpbHRlcnMgPSAkKCcubWFwY29udHJvbF9vcHRpb25zID4gLmJ0bicpXHJcblxyXG4gIGxldCBzdGF0ZSA9IHtcclxuICAgIHVzZXJJbnB1dDogJycsXHJcbiAgICBmaWx0ZXJzOiBbXSxcclxuICAgIGZpbHRyZWREYXRhOiBbXVxyXG4gIH1cclxuXHJcbiAgbGV0IGNoZWNrU3VnZ2VzdGlvbnNTdGF0dXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoc3RhdGUuZmlsdHJlZERhdGEubGVuZ3RoIDw9IDApIHtcclxuICAgICAgbWFwQ29udHJvbENvbnRhaW5lci5jc3MoJ2hlaWdodCcsICcxODZweCcpXHJcbiAgICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLmhpZGUoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbWFwQ29udHJvbENvbnRhaW5lci5jc3MoJ2hlaWdodCcsICcyNDVweCcpXHJcbiAgICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLnNob3coKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGV0IGFwcGx5RmlsdGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIHVwZGF0ZSBpbnB1dGVkIHNlYXJjaFxyXG4gICAgaW5wdXRlZFNlYXJjaC50ZXh0KHN0YXRlLnVzZXJJbnB1dClcclxuXHJcbiAgICAvLyBmaWx0ZXIgZGF0YSBieSB1c2VyIGlucHV0XHJcbiAgICBzdGF0ZS5maWx0cmVkRGF0YSA9IGRhdGEuZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIChlbGVtZW50Lm5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmNsdWRlcyhzdGF0ZS51c2VySW5wdXQpIHx8XHJcbiAgICAgICAgICBlbGVtZW50LmFkZHJlc3MudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmNsdWRlcyhzdGF0ZS51c2VySW5wdXR0KSB8fFxyXG4gICAgICAgICAgZWxlbWVudC5jaXR5LnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3RhdGUudXNlcklucHV0KSkgJiZcclxuICAgICAgICBzdGF0ZS51c2VySW5wdXQgIT0gJydcclxuICAgICAgKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBGaWx0ZXIgZGF0YSBieSB0eXBlXHJcbiAgICBzdGF0ZS5maWx0ZXJzLmZvckVhY2goZmlsdGVyID0+IHtcclxuICAgICAgc3RhdGUuZmlsdHJlZERhdGEgPSBzdGF0ZS5maWx0cmVkRGF0YS5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQudHlwZSA9PT0gZmlsdGVyXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIHVwZGF0ZSBzZWFyY2ggUmVzdWx0XHJcbiAgICBzZWFyY2hSZXN1bHQudGV4dChgKCAke3N0YXRlLmZpbHRyZWREYXRhLmxlbmd0aH0gYWdlbmNlcyB0cm91dsOpZXMgKWApXHJcblxyXG4gICAgLy8gQ2hlY2sgd2V0aGVyIHRvIGRpc3BsYXkgc3VnZ2VzdGlvbnMgb2Ygbm90XHJcbiAgICBjaGVja1N1Z2dlc3Rpb25zU3RhdHVzKClcclxuICAgIC8vIHJlbmRlciBmaWx0cmVkIGRhdGFcclxuICAgIHJlbmRlcigpXHJcbiAgfVxyXG5cclxuICBsZXQgZmlsdGVyQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpIC8vIGNoYW5nZSB0aGUgc3R5bGUgb2YgdGhlIHRhZ1xyXG4gICAgc3RhdGUuZmlsdGVycyA9IFtdXHJcblxyXG4gICAgZmlsdGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgc3RhdGUuZmlsdGVycy5wdXNoKCQodGhpcykuZGF0YSgndmFsdWUnKSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH1cclxuXHJcbiAgbGV0IGlucHV0Q2hhbmdlcyA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBzdGF0ZS51c2VySW5wdXQgPSBlLnRhcmdldC52YWx1ZS50b0xvY2FsZUxvd2VyQ2FzZSgpXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH1cclxuXHJcbiAgbGV0IHJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjb250ZW50ID0gc3RhdGUuZmlsdHJlZERhdGFcclxuICAgICAgLm1hcChlbGVtZW50ID0+IHtcclxuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJzdWdnZXN0aW9uc19lbGVtZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxoMz4ke2VsZW1lbnQubmFtZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj4ke2VsZW1lbnQuYWRkcmVzc308L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gXHJcbiAgICAgIH0pXHJcbiAgICAgIC5qb2luKCcnKVxyXG5cclxuICAgIHN1Z2dlc3Rpb25Ib2xkZXIuaHRtbChjb250ZW50KVxyXG4gIH1cclxuXHJcbiAgc2VhcmNoSW5wdXQub24oJ2lucHV0JywgaW5wdXRDaGFuZ2VzKVxyXG5cclxuICBmaWx0ZXJzLm9uKCdjbGljaycsIGZpbHRlckNoYW5nZXMpXHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgdG9nZ2xlQ29udHJvbCA9IGZ1bmN0aW9uICgpIHtcclxuICAkKCcubWFwY29udHJvbF90b2dnbGUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCcubWFwY29udHJvbCcpLnRvZ2dsZUNsYXNzKCdtYXBjb250cm9sLS1oaWRlJylcclxuICB9KVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICAkLmdldFNjcmlwdChcclxuICAgICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvanM/a2V5PUFJemFTeURDV0RfcTVOb0V5VmJsQzFtdFMyYmwwOGt1a3JuekRRcyZyZWdpb249TUEnLFxyXG4gICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgbWFwSG9sZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXHJcbiAgICAgIGlmIChtYXBIb2xkZXIpIHtcclxuICAgICAgICAvLyBEZWZpbmUgdGhlIGhlaWdodCBvZiB0aGUgbWFwXHJcbiAgICAgICAgY29uc3QgdG9wSGVhZGVySGVpZ2h0ID0gNTFcclxuICAgICAgICBsZXQgbWFwSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpXHJcbiAgICAgICAgbWFwSG9sZGVyLnN0eWxlLmhlaWdodCA9IGAke21hcEhlaWdodCAtIHRvcEhlYWRlckhlaWdodH1weGBcclxuXHJcbiAgICAgICAgdmFyIG1hcFByb3AgPSB7XHJcbiAgICAgICAgICBjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNTEuNTA4NzQyLCAtMC4xMjA4NTApLFxyXG4gICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcclxuICAgICAgICAgIHpvb206IDUsXHJcbiAgICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcEhvbGRlciwgbWFwUHJvcClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIClcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgc2xpZGVySW5kZXg7XHJcblxyXG4gICAgaWYgKCQoJy5ub3MtYmFucXVlcycpLmxlbmd0aCkge1xyXG4gICAgICAgIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgIHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG4gICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG4gICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCAscnRsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCwgcnRsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCwgcnRsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCwgcnRsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVIYXNoICgpIHsgXHJcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoJycsIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBiYW5xdWVzU2xpZGVyKHN0YWdlUGFkZGluZywgcnRsKSB7XHJcbiAgICAgICAgdmFyIG93bCA9ICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIFVSTGhhc2hMaXN0ZW5lcjogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2U3BlZWQ6IDEwMDAsXHJcbiAgICAgICAgICAgIHJ0bDogcnRsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb3dsLm9uKFwiZHJhZy5vd2wuY2Fyb3VzZWxcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0WydfZHJhZyddWydkaXJlY3Rpb24nXSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleEJlZm9yZUNoYW5nZSA9IGV2ZW50LnBhZ2UuaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kZXggPSBpbmRleEJlZm9yZUNoYW5nZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb3dsLm9uKFwiZHJhZ2dlZC5vd2wuY2Fyb3VzZWxcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbmRleEFmdGVyQ2hhbmdlID0gZXZlbnQucGFnZS5pbmRleDtcclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0WydfZHJhZyddWydkaXJlY3Rpb24nXSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleEFmdGVyQ2hhbmdlICE9PSBzbGlkZXJJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0WydfZHJhZyddWydkaXJlY3Rpb24nXSA9PT0gXCJsZWZ0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXYoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcub3dsLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcub3dsLXByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcHJldigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudEl0ZW0gPSAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW0uYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0uaXMoJzpsYXN0LWNoaWxkJykpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbTpmaXJzdC1jaGlsZCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLm5leHQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZXYoKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50SXRlbSA9ICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbS5hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50SXRlbS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbTpsYXN0LWNoaWxkJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZW0ucHJldigpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblxyXG4gICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbTpmaXJzdC1jaGlsZCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2xpY2tlZEl0ZW0gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjbGlja2VkSXRlbS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbS5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBjbGlja2VkSXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZigkKCcuaGVhZGVyX3NlYXJjaCcpLmxlbmd0aCkge1xyXG5cdFx0YWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzICgpIHtcclxuXHRcdCQoJy5oZWFkZXJfc2VhcmNoLCAuaGVhZGVyX21vYmlsZS1zZWFyY2gnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5wYWdlLWNvbnRlbnQnKS5hZGRDbGFzcygnZC1ub25lJyk7XHJcblx0XHRcdCQoJy5wb3B1cC1zZWFyY2gnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcuY2xvc2Utd3JhcHBlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLnBhZ2UtY29udGVudCcpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcclxuXHRcdFx0JCgnLnBvcHVwLXNlYXJjaCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5wb3B1cC1zZWFyY2ggLmJ0bi0tdGFnJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0aWYoJCh0aGlzKS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuXHRcdFx0XHQkKCcucG9wdXAtc2VhcmNoIC5idG4tLXRhZzpub3QoOmZpcnN0LWNoaWxkKScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcucG9wdXAtc2VhcmNoIC5idG4tLXRhZzpmaXJzdC1jaGlsZCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZigkKCcuc3dpcGVib3gtLXZpZGVvJykubGVuZ3RoKSB7XHJcblx0XHRhZGRFdmVudExpc3RlbmVycygpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMgKCkge1xyXG5cdFx0JCgnLnN3aXBlYm94LS12aWRlbycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLnBhZ2UtY29udGVudCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcclxuXHRcdFx0JCgnLnBvcHVwLXZpZGVvJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLmNsb3NlLXdyYXBwZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5wYWdlLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcblx0XHRcdCQoJy5wb3B1cC12aWRlb19zZWN0aW9uIGlmcmFtZScpLnJlbW92ZSgpO1xyXG5cdFx0XHQkKCcucG9wdXAtdmlkZW8nKS5hZGRDbGFzcygnZC1ub25lJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcuc3dpcGVib3gtLXZpZGVvJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0dmFyIHl0YklkID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblxyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHBsYXlWaWRlbyh5dGJJZCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcucG9wdXAtdmlkZW9fc2xpZGVyIC5zd2lwZWJveC0tdmlkZW8nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHR2YXIgeXRiSWQgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0cGxheVZpZGVvKHl0YklkKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHBsYXlWaWRlbyh5dGJJZCkge1xyXG5cdFx0XHJcblxyXG5cdFx0dmFyIGh0bWwgPSBgPGlmcmFtZSAgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiNDAwXCIgXHJcblx0XHRcdFx0XHRcdHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLyR7eXRiSWR9P2F1dG9wbGF5PTFcIiBcclxuXHRcdFx0XHRcdFx0ZnJhbWVib3JkZXI9XCIwXCIgYWxsb3c9XCJhdXRvcGxheTsgZW5jcnlwdGVkLW1lZGlhXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPmA7XHJcblxyXG5cdFx0JCgnLnBvcHVwLXZpZGVvX3NlY3Rpb24gaWZyYW1lJykucmVtb3ZlKCk7XHJcblxyXG5cdFx0JCgnLnBvcHVwLXZpZGVvX3NlY3Rpb24nKS5wcmVwZW5kKGh0bWwpO1xyXG5cdH1cclxuXHJcblx0Ly8gY2Fyb3VzZWwgdmlkZW9cclxuXHRpZigkKCcucG9wdXAtdmlkZW9fc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0dmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0cG9wdXBWaWRlb1NsaWRlcigwLCBydGwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cG9wdXBWaWRlb1NsaWRlcigyMCwgcnRsKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0cG9wdXBWaWRlb1NsaWRlcigwLCBydGwpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHBvcHVwVmlkZW9TbGlkZXIoMjAsIHJ0bCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcG9wdXBWaWRlb1NsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgICAgICQoJy5wb3B1cC12aWRlb19zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICBydGw6IHJ0bCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiA1XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCQoJy5wdWItc2xpZGVyJykubGVuZ3RoKSB7XHJcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgfVxyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuICAgICAgICBhcnRpY2xlU2xpZGVyKDApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXJ0aWNsZVNsaWRlciAoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAkKCcucHViLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICBtYXJnaW46IDE4LFxyXG4gICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICBuYXY6IHRydWUsXHJcbiAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAwOiB7XHJcbiAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdCQoJ3NlbGVjdC5uaWNlLXNlbGVjdCcpLm5pY2VTZWxlY3QoKTtcclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLnN3aXBlYm94JykubGVuZ3RoKSB7XHJcblx0XHQvLyQoJy5zd2lwZWJveCcpLnN3aXBlYm94KCk7XHJcblx0fVxyXG5cdFxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0LCAudG9wLWhlYWRlcl9saXN0IC5sYW5nJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuZHJvcGRvd24nKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcqJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICBpZiAoISQuY29udGFpbnMoJCgnLnRvcC1oZWFkZXJfbGlzdCcpWzBdLCAkKGUudGFyZ2V0KVswXSkgJiYgXHJcbiAgICAgICAgICAgICgkKCcubGFuZycpLmhhc0NsYXNzKCdvcGVuJykgfHxcclxuICAgICAgICAgICAgJCgnLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSApIHtcclxuXHJcbiAgICAgICAgICAgIGNsb3NlRHJvcGRvd25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0JykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5sYW5nJykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==
