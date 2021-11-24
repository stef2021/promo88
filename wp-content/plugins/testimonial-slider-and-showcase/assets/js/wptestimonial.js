(function ($) {
    'use strict';
    $('*').on('touchstart', function () {
        $(this).trigger('hover');
    }).on('touchend', function () {
        $(this).trigger('hover');
    });

    $(function () {
        preFunction();
        $(document).on('mouseover', '.tss-isotope-button-wrapper .rt-iso-button',
            function () {
                var self = $(this),
                    count = self.attr('data-filter-counter'),
                    id = self.parents('.tss-wrapper').attr('id');
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
            .on('mouseout', '.tss-isotope-buttons .rt-iso-button', function () {
                $('body > .tss-tooltip').remove();
            });
    });

    $(window).on('load resize', function () {
        preFunction();
    });

    function preFunction() {
        HeightResize();
        overlayIconResize();
    }

    $('.tss-wrapper').each(function () {
        var container = $(this);
        var str = $(this).attr("data-layout");
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
                    autoplay = caro.data('autoplay'),
                    autoPlayHoverPause = caro.data('autoplay-hover-pause'),
                    autoPlayTimeOut = caro.data('autoplay-timeout'),
                    autoHeight = caro.data('auto-height'),
                    lazyLoad = caro.data('lazy-load'),
                    rtl = caro.data('rtl'),
                    smartSpeed = caro.data('smart-speed');

                caro.imagesLoaded(function () {
                    if (str === 'carousel11' || str === 'carousel12') {
                        // console.log(autoPlayTimeOut);

                        var images = [];
                        caro.find('.tss-grid-item').each(function () {
                            var imgItem = $(this).find('.profile-img-wrapper').remove();
                            images.push(imgItem);
                        });
                        var caroThumbs = $("<div class='tss-carousel-thumb' />");
                        $.map(images, function (img) {
                            caroThumbs.append(img);
                        });
                        if (str === 'carousel11') {
                            caro.parent().prepend(caroThumbs);
                        } else {
                            caro.parent().append(caroThumbs);
                        }
                        caroThumbs.imagesLoaded(function () {

                            caro.slick({
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                arrows: !!nav,
                                prevArrow: '<span class="rt-slick-nav rt-prev"><i class="fa fa-chevron-left"></i></span>',
                                nextArrow: '<span class="rt-slick-nav rt-next"><i class="fa fa-chevron-right"></i></span>',
                                asNavFor: caroThumbs,
                                autoplay: !!autoplay,
                                autoplaySpeed: autoPlayTimeOut ? autoPlayTimeOut : 5000,
                                adaptiveHeight: !!autoHeight,
                                speed: smartSpeed ? smartSpeed : 300,
                                lazyLoad: lazyLoad ? 'progressive' : 'ondemand',
                                rtl: !!rtl,
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
                        $('.vc_tta-tabs-list li').on('click', function () {
                            setTimeout(function () {
                                caro.slick('setPosition');
                                caro.resize();
                                $('.tss-carousel').resize();
                            }, 100)
                        });
                    }
                    caro.parents('.rt-row').removeClass('tss-pre-loader');
                    caro.parents('.rt-row').find('.rt-loading-overlay, .rt-loading').remove();
                });
            } else if (Iso.length) {
                var IsoButton = container.find(".tss-isotope-button-wrapper");
                if (!buttonFilter) {
                    buttonFilter = IsoButton.find('.rt-iso-button.selected').data('filter');
                }
                var isotope = Iso.imagesLoaded(function () {
                    Iso.parents('.rt-row').removeClass('tss-pre-loader');
                    Iso.parents('.rt-row').find('.rt-loading-overlay, .rt-loading').remove();
                    preFunction();
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

                IsoButton.on('click', '.rt-iso-button', function (e) {
                    e.preventDefault();
                    buttonFilter = $(this).attr('data-filter');
                    isotope.isotope();
                    $(this).parent().find('.selected').removeClass('selected');
                    $(this).addClass('selected');
                });

                if (container.find('.tss-utility .tss-load-more').length) {
                    container.find(".tss-load-more").on('click', '.rt-button', function (e) {
                        e.preventDefault(e);
                        loadMoreButton($(this), isotope, container, 'isotope', IsoButton);
                    });
                }

                if (container.find('.tss-utility .tss-scroll-load-more').length) {
                    $(window).on('scroll', function () {
                        var $this = container.find('.tss-utility .tss-scroll-load-more');
                        scrollLoadMore($this, isotope, container, 'isotope', IsoButton);
                    });
                }
            } else if (container.find('.rt-row.tss-masonry').length) {
                var masonryTarget = container.find('.rt-row.tss-masonry');
                preFunction();
                var isotopeM = masonryTarget.imagesLoaded(function () {
                    isotopeM.isotope({
                        itemSelector: '.masonry-grid-item',
                        masonry: {columnWidth: '.masonry-grid-item'}
                    });
                });
                if (container.find('.tss-utility .tss-load-more').length) {
                    container.find(".tss-load-more").on('click', '.rt-button', function (e) {
                        e.preventDefault(e);
                        loadMoreButton($(this), isotopeM, container, 'mLayout');
                    });
                }
                if (container.find('.tss-utility .tss-scroll-load-more').length) {
                    $(window).on('scroll', function () {
                        var $this = container.find('.tss-utility .tss-scroll-load-more');
                        if ($this.attr('data-trigger') > 0) {
                            scrollLoadMore($this, isotopeM, container, 'mLayout');
                        }
                    });
                }

                if (container.find('.tss-utility .tss-pagination.tss-ajax').length) {
                    ajaxPagination(container, isotopeM);
                }
            } else {
                if (container.find(".tss-utility  .tss-load-more").length) {
                    container.find(".tss-load-more").on('click', '.rt-button', function (e) {
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
    });

    function isoFilterCounter(container, isotope) {
        var total = 0;
        container.find('.tss-isotope-button-wrapper .rt-iso-button').each(function () {
            var self = $(this),
                filter = self.data("filter"),
                itemTotal = isotope.find(filter).length;
            if (filter != "*") {
                self.attr("data-filter-counter", itemTotal);
                total = total + itemTotal
            }
        });
        container.find('.tss-isotope-button-wrapper .rt-iso-button[data-filter="*"]').attr("data-filter-counter", total);
    }


    function loadMoreButton($this, $isotope, container, layout, IsoButton) {
        var $thisText = $this.clone().children().remove().end().text(),
            noMorePostText = $this.data("no-more-post-text"),
            loadingText = $this.data("loading-text"),
            scID = $this.attr("data-sc-id"),
            paged = parseInt($this.attr("data-paged"), 10) + 1,
            totalPages = parseInt($this.data("total-pages"), 10),
            foundPosts = parseInt($this.data("found-posts"), 10),
            postsPerPage = parseInt($this.data("posts-per-page"), 10),
            data = "scID=" + scID + "&paged=" + paged,
            morePosts = foundPosts - (postsPerPage * paged);
        if (morePosts > 0) {
            $thisText = $thisText + " <span>(" + morePosts + ")</span>";
        } else {
            $thisText = noMorePostText;
        }
        data = data + "&action=tssLoadMore&" + tss.nonceId + "=" + tss.nonce;
        if (container.data("archive")) {
            data = data + "&archive=" + container.data("archive");
            if (container.data("archive-value")) {
                data = data + "&archive-value=" + container.data("archive-value");
            }
        }

        $.ajax({
            type: "post",
            url: tss.ajaxurl,
            data: data,
            beforeSend: function () {
                $this.html('<span class="more-loading">' + loadingText + '</span>');
            },
            success: function (data) {
                if (!data.error) {
                    $this.attr("data-paged", paged);
                    if (layout == "isotope") {
                        renderIsotope(container, $isotope, data.data, IsoButton);
                    } else if (layout == "mLayout") {
                        $isotope.append(data.data).isotope('appended', data.data).isotope('updateSortData').isotope('reloadItems');
                        $isotope.imagesLoaded(function () {
                            $isotope.isotope();
                        });
                    } else {
                        container.children(".rt-row").append(data.data);
                        container.children(".rt-row").imagesLoaded(function () {
                            preFunction();
                        });
                    }
                    $this.html($thisText);
                    if (totalPages <= paged) {
                        $this.attr('disabled', 'disabled');
                    }
                } else {
                    $this.text(data.msg);
                    $this.attr('disabled', 'disabled');
                    $this.parent().hide();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                container.find(".more-loading").remove();
                alert(textStatus + ' (' + errorThrown + ')');
            }
        });
        return false;
    }

    function renderIsotope(container, $isotope, data, IsoButton) {

        var qsRegexG, buttonFilter;
        if (!buttonFilter) {
            buttonFilter = IsoButton.find('.rt-iso-button.selected').data('filter');
        }

        $isotope.append(data)
            .isotope('appended', data)
            .isotope('reloadItems')
            .isotope('updateSortData');
        $isotope.imagesLoaded(function () {
            preFunction();
            $isotope.isotope();
        });

        $(IsoButton).on('click', '.rt-iso-button', function (e) {
            e.preventDefault();
            buttonFilter = $(this).attr('data-filter');
            $isotope.isotope();
            $(this).parent().find('.selected').removeClass('selected');
            $(this).addClass('selected');
        });
        var $quicksearch = container.find('.iso-search-input').keyup(debounce(function () {
            qsRegexG = new RegExp($quicksearch.val(), 'gi');
            $isotope.isotope();
        }));
        isoFilterCounter(container, $isotope);
    }

    function scrollLoadMore($this, $isotope, container, layout, IsoButton) {
        var viewportHeight = $(window).height();
        var scrollTop = $(window).scrollTop();
        var targetHeight = $this.offset().top + $this.outerHeight() - 50;
        var targetScroll = scrollTop + viewportHeight;

        if (targetScroll >= targetHeight) {
            var trigger = $this.attr("data-trigger");
            if (trigger == 1) {
                // $this.data('trigger', false);
                $this.attr("data-trigger", 0);
                var data,
                    scID = $this.attr("data-sc-id"),
                    paged = parseInt($this.attr("data-paged"), 10);
                data = "scID=" + scID + "&paged=" + paged;
                data = data + "&action=tssLoadMore&" + tss.nonceId + "=" + tss.nonce;

                if (container.data("archive")) {
                    data = data + "&archive=" + container.data("archive");
                    if (container.data("archive-value")) {
                        data = data + "&archive-value=" + container.data("archive-value");
                    }
                }
                $.ajax({
                    type: "post",
                    url: tss.ajaxurl,
                    data: data,
                    beforeSend: function () {
                        $this.html('<span class="more-loading">Loading ...</span>');
                    },
                    success: function (data) {
                        if (!data.error) {
                            $this.attr("data-paged", paged + 1);
                            if (layout == "isotope") {
                                renderIsotope(container, $isotope, data.data, IsoButton);
                            } else if (layout == "mLayout") {
                                $isotope.append(data.data).isotope('appended', data.data).isotope('updateSortData').isotope('reloadItems');
                                $isotope.imagesLoaded(function () {
                                    $isotope.isotope();
                                });
                            } else {
                                container.children(".rt-row").append(data.data);
                                container.children(".rt-row").imagesLoaded(function () {
                                    preFunction();
                                });
                            }
                            $this.html('');
                            $this.attr("data-trigger", 1);
                        } else {
                            $this.html('');
                            $this.attr("data-trigger", 0);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        container.find(".more-loading").remove();
                        alert(textStatus + ' (' + errorThrown + ')');
                    }
                });
            } // if trigger == 1

        }
    }

    function ajaxPagination(container, isotopeM) {
        container.find(".tss-pagination.tss-ajax ul li").on('click', 'a', function (e) {
            e.preventDefault();
            var data,
                $this = $(this),
                target = $this.parents("li"),
                parent = target.parents(".tss-pagination.tss-ajax"),
                activeLi = parent.find("li.active"),
                activeNumber = parseInt(activeLi.text(), 10),
                replaced = "<a data-paged='" + activeNumber + "' href='#'>" + activeNumber + "</a>",
                scID = parent.data("sc-id"),
                paged = $this.data("paged");
            activeLi.html(replaced);
            parent.find("li").removeClass("active");
            target.addClass("active");
            target.html("<span>" + paged + "</span>");
            data = "scID=" + scID + "&paged=" + paged;
            data = data + "&action=tssLoadMore&" + tss.nonceId + "=" + tss.nonce;

            if (container.data("archive")) {
                data = data + "&archive=" + container.data("archive");
                if (container.data("archive-value")) {
                    data = data + "&archive-value=" + container.data("archive-value");
                }
            }
            $.ajax({
                type: "post",
                url: tss.ajaxurl,
                data: data,
                beforeSend: function () {
                    parent.append('<div class="tss-loading-holder"><span class="more-loading">Loading ...</span></div>');
                },
                success: function (data) {
                    if (!data.error) {
                        if (typeof isotopeM === "undefined") {
                            container.children(".rt-row").animate({opacity: 0});
                            container.children(".rt-row").html(data.data);
                            container.children(".rt-row").imagesLoaded(function () {
                                preFunction();
                                container.children(".rt-row").animate({opacity: 1}, 1000);
                            });
                        } else {
                            container.children(".rt-row").find(".masonry-grid-item").remove();
                            isotopeM.append(data.data).isotope('appended', data.data).isotope('updateSortData').isotope('reloadItems');
                            isotopeM.imagesLoaded(function () {
                                preFunction();
                                isotopeM.isotope();
                            });
                        }
                    } else {
                        alert(data.msg);
                    }
                    container.find(".tss-loading-holder").remove();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    container.find(".tss-loading-holder").remove();
                    alert(textStatus + ' (' + errorThrown + ')');
                }
            });
        });
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


    function overlayIconResize() {
        $('.tlp-item').each(function () {
            var holder_height = $(this).height();
            var a_height = $(this).find('.tlp-overlay .link-icon').height();
            var h = (holder_height - a_height) / 2;
            $(this).find('.link-icon').css('margin-top', h + 'px');
        });
    }
})(jQuery);