(function ($) {
    'use strict';

    $(function(){
        renderTssPreview();
        $("#rt_tss_sc_settings_meta").on('change', 'select,input', function () {
            renderTssPreview();
        });
        $("#rt_tss_sc_settings_meta").on("input propertychange", function () {
            renderTssPreview();
        });
        if ($("#sc-style .rt-color").length) {
            var cOptions = {
                defaultColor: false,
                change: function (event, ui) {
                    renderTssPreview();
                },
                clear: function () {
                    renderTssPreview();
                },
                hide: true,
                palettes: true
            };
            $("#sc-style .rt-color").wpColorPicker(cOptions);
        }


        $(document).on('mouseover', '.tss-isotope-button-wrapper button',
            function () {
                var self = $(this),
                    count = self.attr('data-filter-counter'),
                    id = self.parents('.tss-wrapper').attr('id');
                console.log(count);
                $tooltip = '<div class="tss-tooltip" id="tss-tooltip-' + id + '">' +
                    '<div class="tss-tooltip-content">' + count + '</div>' +
                    '<div class="tss-tooltip-bottom"></div>' +
                    '</div>';
                $('body').append($tooltip);
                var $tooltip = $('body > .tss-tooltip');
                var tHeight = $tooltip.outerHeight();
                var tBottomHeight = $tooltip.find('.tss-tooltip-bottom').outerHeight();
                var tWidth = $tooltip.outerWidth();
                var tHolderWidth = self.outerWidth();
                var top = self.offset().top - (tHeight + tBottomHeight);
                var left = self.offset().left;
                $tooltip.css({
                    'top': top + 'px',
                    'left': left + 'px',
                    'opacity': 1
                }).show();
                if (tWidth <= tHolderWidth) {
                    var itemLeft = (tHolderWidth - tWidth) / 2;
                    left = left + itemLeft;
                    $tooltip.css('left', left + 'px');
                } else {
                    var itemLeft = (tWidth - tHolderWidth) / 2;
                    left = left - itemLeft;
                    if (left < 0) {
                        left = 0;
                    }
                    $tooltip.css('left', left + 'px');
                }
            })
            .on('mouseout', '.tss-isotope-buttons button', function () {
                $('body > .tss-tooltip').remove();
            });
    });

    $(document).on("click", "span.rtAddImage", function (e) {
        var file_frame, image_data;
        var $this = $(this).parents('.rt-image-holder');
        if (undefined !== file_frame) {
            file_frame.open();
            return;
        }
        file_frame = wp.media.frames.file_frame = wp.media({
            title: 'Select or Upload Media For your profile gallery',
            button: {
                text: 'Use this media'
            },
            multiple: false
        });
        file_frame.on('select', function () {
            var attachment = file_frame.state().get('selection').first().toJSON();
            var imgId = attachment.id;
            var imgUrl = (typeof attachment.sizes.thumbnail === "undefined") ? attachment.url : attachment.sizes.thumbnail.url;
            $this.find('.hidden-image-id').val(imgId);
            $this.find('.rtRemoveImage').show();
            $this.find('img').remove();
            $this.find('.rt-image-preview').append("<img src='" + imgUrl + "' />");
            renderTssPreview();
        });
        // Now display the actual file_frame
        file_frame.open();
    });

    $(document).on("click", "span.rtRemoveImage", function (e) {
        e.preventDefault();
        if (confirm("Are you sure?")) {
            var $this = $(this).parents('.rt-image-holder');
            $this.find('.hidden-image-id').val('');
            $this.find('.rtRemoveImage').hide();
            $this.find('img').remove();
            renderTssPreview();
        }
    });


    function renderTssPreview() {
        if ($("#rt_tss_sc_settings_meta").length) {
            var data = $("#rt_tss_sc_settings_meta").find('input[name],select[name],textarea[name]').serialize();
            tssPreviewAjaxCall(null, 'tssPreviewAjaxCall', data, function (data) {
                if (!data.error) {
                    $("#tss-preview-container").html(data.data);
                    renderLayout();
                }
            });
        }
    }

    function renderLayout() {
        var container = $('.tss-wrapper');
        if(container.length) {
            var str = container.attr("data-layout");
            // console.log(str);
            if (str) {
                var qsRegex,
                    buttonFilter,
                    Iso = container.find(".tss-isotope"),
                    caro = container.find('.tss-carousel'),
                    html_loading = '<div class="rt-loading-overlay"></div><div class="rt-loading rt-ball-clip-rotate"><div></div></div>',
                    preLoader = container.find('.tss-pre-loader');
                if (preLoader.find('.rt-loading-overlay').length == 0) {
                    preLoader.append(html_loading);
                }
                if (caro.length) {
                    var items = caro.data('items-desktop'),
                        tItems = caro.data('items-tab'),
                        mItems = caro.data('items-mobile'),
                        loop = caro.data('loop'),
                        nav = caro.data('nav'),
                        dots = caro.data('dots'),
                        autoplay = false,
                        autoPlayHoverPause = caro.data('autoplay-hover-pause'),
                        autoPlayTimeOut = caro.data('autoplay-timeout'),
                        autoHeight = caro.data('auto-height'),
                        lazyLoad = caro.data('lazy-load'),
                        rtl = caro.data('rtl'),
                        smartSpeed = caro.data('smart-speed');
                    caro.imagesLoaded(function () {
                        if (str === 'carousel7' || str === 'carousel8') {
                            var images = [];
                            caro.find('.tss-grid-item').each(function () {
                                var imgItem = $(this).find('.profile-img-wrapper').remove();
                                images.push(imgItem);
                            });
                            var caroThumbs = $("<div class='tss-carousel-thumb' />");
                            $.map(images, function (img) {
                                caroThumbs.append(img);
                            });
                            if (str === 'carousel7') {
                                caro.parent().prepend(caroThumbs);
                            } else {
                                caro.parent().append(caroThumbs);
                            }
                            caroThumbs.imagesLoaded(function () {

                                caro.slick({
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    arrows: true,
                                    autoplay: false,
                                    prevArrow: '<span class="rt-slick-nav rt-prev"><i class="fa fa-chevron-left"></i></span>',
                                    nextArrow: '<span class="rt-slick-nav rt-next"><i class="fa fa-chevron-right"></i></span>',
                                    asNavFor: caroThumbs
                                });

                                caroThumbs.slick({
                                    slidesToShow: items ? items : 3,
                                    slidesToScroll: 1,
                                    asNavFor: caro,
                                    dots: false,
                                    arrows: false,
                                    centerMode: true,
                                    centerPadding: '0px',
                                    focusOnSelect: true,
                                    responsive: [
                                        {
                                            breakpoint: 767,
                                            settings: {
                                                slidesToShow: tItems ? tItems : 2,
                                                slidesToScroll: 1
                                            }
                                        },
                                        {
                                            breakpoint: 480,
                                            settings: {
                                                slidesToShow: mItems ? mItems : 1,
                                                slidesToScroll: 1
                                            }
                                        }
                                    ]
                                });
                            });
                            // caroThumbs
                        } else {
                            caro.slick({
                                slidesToShow: items ? items : 3,
                                slidesToScroll: items ? items : 3,
                                infinite: !!loop,
                                arrows: !!nav,
                                prevArrow: '<span class="rt-slick-nav rt-prev"><i class="fa fa-chevron-left"></i></span>',
                                nextArrow: '<span class="rt-slick-nav rt-next"><i class="fa fa-chevron-right"></i></span>',
                                dots: !!dots,
                                autoplay: !!autoplay,
                                autoplaySpeed: autoPlayTimeOut ? autoPlayTimeOut : 5000,
                                adaptiveHeight: !!autoHeight,
                                pauseOnHover: !!autoPlayHoverPause,
                                speed: smartSpeed ? smartSpeed : 300,
                                lazyLoad: lazyLoad ? 'progressive' : 'ondemand',
                                rtl: !!rtl,
                                responsive: [
                                    {
                                        breakpoint: 767,
                                        settings: {
                                            slidesToShow: tItems ? tItems : 2,
                                            slidesToScroll: tItems ? tItems : 2
                                        }
                                    },
                                    {
                                        breakpoint: 480,
                                        settings: {
                                            slidesToShow: mItems ? mItems : 1,
                                            slidesToScroll: mItems ? mItems : 1
                                        }
                                    }
                                ]
                            });
                        }
                        caro.parents('.rt-row').removeClass('tss-pre-loader');
                        caro.parents('.rt-row').find('.rt-loading-overlay, .rt-loading').remove();
                    });
                }

                if (Iso.length) {
                    var IsoButton = container.find(".tss-isotope-button-wrapper");
                    if (!buttonFilter) {
                        buttonFilter = IsoButton.find('button.selected').data('filter');
                    }
                    var isotope = Iso.imagesLoaded(function () {
                        preFunction();
                        Iso.parents('.rt-row').removeClass('tss-pre-loader');
                        Iso.parents('.rt-row').find('.rt-loading-overlay, .rt-loading').remove();
                        isotope.isotope({
                            itemSelector: '.isotope-item',
                            masonry: {columnWidth: '.isotope-item'},
                            filter: function () {
                                var $this = $(this);
                                var searchResult = qsRegex ? $this.text().match(qsRegex) : true;
                                var buttonResult = buttonFilter ? $this.is(buttonFilter) : true;
                                return searchResult && buttonResult;
                            }
                        });
                        isoFilterCounter(container, isotope);
                    });
                    // use value of search field to filter
                    var $quicksearch = container.find('.iso-search-input').keyup(debounce(function () {
                        qsRegex = new RegExp($quicksearch.val(), 'gi');
                        isotope.isotope();
                    }));

                    IsoButton.on('click', 'button', function (e) {
                        e.preventDefault();
                        buttonFilter = $(this).attr('data-filter');
                        isotope.isotope();
                        $(this).parent().find('.selected').removeClass('selected');
                        $(this).addClass('selected');
                    });

                    if (container.find('.tss-utility .tss-load-more').length) {
                        container.find(".tss-load-more").on('click', 'button', function (e) {
                            e.preventDefault(e);
                            alert("This feature not available at preview");
                        });
                    }

                    if (container.find('.tss-utility .tss-scroll-load-more').length) {

                    }
                } else if (container.find('.tss-row.tss-masonry').length) {
                    var masonryTarget = container.find('.tss-row.tss-masonry');
                    preFunction();
                    var isotopeM = masonryTarget.imagesLoaded(function () {
                        isotopeM.isotope({
                            itemSelector: '.masonry-grid-item',
                            masonry: {columnWidth: '.masonry-grid-item'}
                        });
                    });
                    if (container.find('.tss-utility .tss-load-more').length) {
                        container.find(".tss-load-more").on('click', 'button', function (e) {
                            e.preventDefault(e);
                            alert("This feature not available at preview");
                        });
                    }
                    if (container.find('.tss-utility .tss-scroll-load-more').length) {

                    }

                    if (container.find('.tss-utility .tss-pagination.tss-ajax').length) {
                        ajaxPagination(container, isotopeM);
                    }
                } else {
                    if (container.find(".tss-utility  .tss-load-more").length) {
                        container.find(".tss-load-more").on('click', 'button', function (e) {
                            e.preventDefault(e);
                            loadMoreButton($(this), isotopeM, container, 'eLayout');
                        });
                    }
                    if (container.find('.tss-utility .tss-scroll-load-more').length) {
                        $(window).on('scroll', function () {
                            var $this = container.find('.tss-utility .tss-scroll-load-more');
                            if ($this.attr('data-trigger') > 0) {
                                scrollLoadMore($this, isotopeM, container, 'eLayout');
                            }
                        });
                    }
                    if (container.find('.tss-utility .tss-pagination.tss-ajax').length) {
                        ajaxPagination(container);
                    }
                }
            }
        }
    }

    function isoFilterCounter(container, isotope) {
        var total = 0;
        container.find('.tss-isotope-button-wrapper button').each(function () {
            var self = $(this),
                filter = self.data("filter"),
                itemTotal = isotope.find(filter).length;
            if (filter != "*") {
                self.attr("data-filter-counter", itemTotal);
                total = total + itemTotal
            }
        });
        container.find('.tss-isotope-button-wrapper button[data-filter="*"]').attr("data-filter-counter", total);
    }


    function ajaxPagination(container, isotopeM) {
        $(".tss-pagination.tss-ajax ul li").on('click', 'a', function (e) {
            e.preventDefault();
            alert("This feature not available at preview");
        });
    }

    function preFunction() {
        HeightResize();
    }

    function HeightResize() {
        var wWidth = $(window).width();
        $(".tss-wrapper").each(function () {
            var self = $(this),
                dCol = self.data('desktop-col'),
                tCol = self.data('tab-col'),
                mCol = self.data('mobile-col'),
                target = $(this).find('.rt-row.tss-even');
            if ((wWidth >= 992 && dCol > 1) || (wWidth >= 768 && tCol > 1) || (wWidth < 768 && mCol > 1)) {
                target.imagesLoaded(function () {
                    var tlpMaxH = 0;
                    target.find('.even-grid-item').height('auto');
                    target.find('.even-grid-item').each(function () {
                        var $thisH = $(this).outerHeight();
                        if ($thisH > tlpMaxH) {
                            tlpMaxH = $thisH;
                        }
                    });
                    target.find('.even-grid-item').height(tlpMaxH + "px");

                    var isoMaxH = 0;
                    target.find('.tss-portfolio-isotope').children('.even-grid-item').height("auto");
                    target.find('.tss-portfolio-isotope').children('.even-grid-item').each(function () {
                        var $thisH = $(this).outerHeight();
                        // console.log($thisH);
                        if ($thisH > isoMaxH) {
                            isoMaxH = $thisH;
                        }
                    });
                    target.find('.tss-portfolio-isotope').children('.even-grid-item').height(isoMaxH + "px");
                });
            } else {
                target.find('.even-grid-item').height('auto');
                target.find('.tss-portfolio-isotope').children('.even-grid-item').height('auto');
            }

        });
    }

    // debounce so filtering doesn't happen every millisecond
    function debounce(fn, threshold) {
        var timeout;
        return function debounced() {
            if (timeout) {
                clearTimeout(timeout);
            }
            function delayed() {
                fn();
                timeout = null;
            }

            setTimeout(delayed, threshold || 100);
        };
    }

    function tssPreviewAjaxCall(element, action, arg, handle) {
        var data;
        if (action) data = "action=" + action;
        if (arg)    data = arg + "&action=" + action;
        if (arg && !action) data = arg;

        var n = data.search(tss.nonceId);
        if (n < 0) {
            data = data + "&" + tss.nonceId + "=" + tss.nonce;
        }
        $.ajax({
            type: "post",
            url: tss.ajaxurl,
            data: data,
            beforeSend: function () {
                $('#tss_sc_preview_meta').addClass('loading');
                $('.tss-response .spinner').addClass('is-active');
            },
            success: function (data) {
                $('#tss_sc_preview_meta').removeClass('loading');
                $('.tss-response .spinner').removeClass('is-active');
                handle(data);
            }
        });
    }

})(jQuery);