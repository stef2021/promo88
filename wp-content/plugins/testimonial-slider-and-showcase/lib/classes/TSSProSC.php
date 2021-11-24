<?php
if ( ! class_exists( 'TSSProSC' ) ):
	/**
	 *
	 */
	class TSSProSC {
		private $scA = array();

		function __construct() {
			add_shortcode( 'rt-testimonial', array( $this, 'testimonial_shortcode' ) );
		}

		function register_scripts() {
			$caro   = false;
			$iso    = false;
			$script = array();
			$style  = array();
			array_push( $script, 'jquery' );

			foreach ( $this->scA as $sc ) {
				if ( isset( $sc ) && is_array( $sc ) ) {
					if ( $sc['isCarousel'] ) {
						$caro = true;
					}
					if ( $sc['isIsotope'] ) {
						$iso = true;
					}
				}
			}

			if ( count( $this->scA ) ) {
				array_push( $script, 'tss-image-load' );
				if ( $caro ) {
					array_push( $style, 'tss-slick' );
					array_push( $style, 'tss-slick-theme' );
					array_push( $script, 'tss-slick' );
				}

				if ( $iso ) {
					array_push( $script, 'tss-isotope' );
				}

				array_push( $style, 'tss-fontawsome' );
				array_push( $style, 'dashicons' );
				array_push( $script, 'tss' );

				wp_enqueue_style( $style );
				wp_enqueue_script( $script );
				$ajaxurl = '';
				if( in_array('sitepress-multilingual-cms/sitepress.php', get_option('active_plugins')) ){
					$ajaxurl .= admin_url( 'admin-ajax.php?lang=' . ICL_LANGUAGE_CODE );
				} else{
					$ajaxurl .= admin_url( 'admin-ajax.php');
				}
				wp_localize_script( 'tss', 'tss',
					array(
						'ajaxurl' => $ajaxurl,
						'nonce'   => wp_create_nonce( TSSPro()->nonceText() ),
						'nonceId' => TSSPro()->nonceId(),
					) 
				);
			}

		}

		function testimonial_shortcode( $atts ) {
			$rand     = mt_rand();
			$layoutID = "tss-container-" . $rand;
			$html     = null;
			$arg      = array();
			$atts     = shortcode_atts( array(
				'id' => null
			), $atts, 'rt-testimonial' );
			$scID     = $atts['id'];
			if ( $scID && ! is_null( get_post( $scID ) ) ) {
                $scMeta = get_post_meta( $scID );
                $arg['scMeta'] = $scMeta;
                $layout = ( ! empty( $scMeta['tss_layout'][0] ) ? esc_attr( $scMeta['tss_layout'][0] ) : 'layout1' ); 
				$dCol = ( isset( $scMeta['tss_desktop_column'][0] ) && $scMeta['tss_desktop_column'][0] != '' ? absint( $scMeta['tss_desktop_column'][0] ) : 3 );
				$tCol = ( isset( $scMeta['tss_tab_column'][0] ) && $scMeta['tss_tab_column'][0] != '' ? absint( $scMeta['tss_tab_column'][0] ) : 2 );
				$mCol = ( isset( $scMeta['tss_mobile_column'][0] ) && $scMeta['tss_mobile_column'][0] != '' ? absint( $scMeta['tss_mobile_column'][0] ) : 1 ); 
				if ( ! in_array( $dCol, array_keys( TSSPro()->scColumns() ) ) ) {
					$dCol = 3;
				}
				if ( ! in_array( $tCol, array_keys( TSSPro()->scColumns() ) ) ) {
					$tCol = 2;
				}
				if ( ! in_array( $dCol, array_keys( TSSPro()->scColumns() ) ) ) {
					$mCol = 1;
				}
				$dColItems = $dCol;
				$tColItems = $tCol;
				$mColItems = $mCol;

				$customImgSize = get_post_meta( $scID, 'tss_custom_image_size', true );
				$defaultImgId  = ( ! empty( $scMeta['default_preview_image'][0] ) ? absint( $scMeta['default_preview_image'][0] ) : null );
				$imgSize       = ( ! empty( $scMeta['tss_image_size'][0] ) ? sanitize_text_field( $scMeta['tss_image_size'][0] ) : "medium" );
				$excerpt_limit = ( ! empty( $scMeta['tss_excerpt_limit'][0] ) ? absint( $scMeta['tss_excerpt_limit'][0] ) : 0 );

				$isIsotope  = preg_match( '/isotope/', $layout );
				$isCarousel = preg_match( '/carousel/', $layout );
				$isVideo    = preg_match( '/video/', $layout );

				/* Argument create */
				$containerDataAttr = false;
				$args              = array();
				$args['post_type'] = TSSPro()->post_type;
				// Common filter
				/* post__in */
				$post__in = ( isset( $scMeta['tss_post__in'][0] ) ? sanitize_text_field( $scMeta['tss_post__in'][0] ) : null );
				if ( $post__in ) {
					$post__in         = explode( ',', $post__in );
					$args['post__in'] = $post__in;
				}
				/* post__not_in */
				$post__not_in = ( isset( $scMeta['tss_post__not_in'][0] ) ? sanitize_text_field( $scMeta['tss_post__not_in'][0] ) : null );
				if ( $post__not_in ) {
					$post__not_in         = explode( ',', $post__not_in );
					$args['post__not_in'] = $post__not_in;
				}
				/* LIMIT */
				$limit                  = ( ( empty( $scMeta['tss_limit'][0] ) || $scMeta['tss_limit'][0] === '-1' ) ? 10000000 : (int) $scMeta['tss_limit'][0] );
				$args['posts_per_page'] = $limit;
				$pagination             = ( ! empty( $scMeta['tss_pagination'][0] ) ? true : false );
				$posts_loading_type     = ( ! empty( $scMeta['tss_pagination_type'][0] ) ? esc_attr($scMeta['tss_pagination_type'][0]) : "pagination" );
				if ( $pagination ) {
					$posts_per_page = ( isset( $scMeta['tss_posts_per_page'][0] ) ? intval( $scMeta['tss_posts_per_page'][0] ) : $limit );
					if ( $posts_per_page > $limit ) {
						$posts_per_page = $limit;
					}
					// Set 'posts_per_page' parameter
					$args['posts_per_page'] = $posts_per_page;

					$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;

					$offset        = $posts_per_page * ( (int) $paged - 1 );
					$args['paged'] = $paged;

					// Update posts_per_page
					if ( intval( $args['posts_per_page'] ) > $limit - $offset ) {
						$args['posts_per_page'] = $limit - $offset;
					}

				}
				if ( $isCarousel ) {
					$args['posts_per_page'] = $limit;
				}

				// Taxonomy
				$cats = ( isset( $scMeta['tss_categories'] ) ? array_filter( $scMeta['tss_categories'] ) : array() );
				$tags = ( isset( $scMeta['tss_tags'] ) ? array_filter( $scMeta['tss_tags'] ) : array() );
				$taxQ = array();
				if ( is_array( $cats ) && ! empty( $cats ) ) {
					$taxQ[] = array(
						'taxonomy' => TSSPro()->taxonomies['category'],
						'field'    => 'term_id',
						'terms'    => $cats,
					);
				}
				if ( is_array( $tags ) && ! empty( $tags ) ) {
					$taxQ[] = array(
						'taxonomy' => TSSPro()->taxonomies['tag'],
						'field'    => 'term_id',
						'terms'    => $tags,
					);
				}
				if ( ! empty( $taxQ ) ) {
					$args['tax_query'] = $taxQ;
					if ( count( $taxQ ) > 1 ) {
						$taxQ['relation'] = ! empty( $scFMeta['tss_taxonomy_relation'][0] ) ? esc_attr($scFMeta['tss_taxonomy_relation'][0]) : "AND";
					}
				}


				// Order
				$order_by = ( isset( $scMeta['tss_order_by'][0] ) ? esc_attr($scMeta['tss_order_by'][0]) : null );
				$order    = ( isset( $scMeta['tss_order'][0] ) ? esc_attr($scMeta['tss_order'][0]) : null );
				if ( $order ) {
					$args['order'] = $order;
				}
				if ( $order_by ) {
					$args['orderby'] = $order_by;
				}

				$testi_limit = ! empty( $scMeta['tss_testimonial_limit'][0] ) ? absint( $scMeta['tss_testimonial_limit'][0] ) : null;
				// Validation
				$containerDataAttr .= " data-layout='{$layout}' data-desktop-col='{$dCol}'  data-tab-col='{$tCol}'  data-mobile-col='{$mCol}'";
				
				$dCol              = $dCol == 5 ? '24' : round( 12 / $dCol );
				$tCol              = $tCol == 5 ? '24' : round( 12 / $tCol );
				$mCol              = $mCol == 5 ? '24' : round( 12 / $mCol );
				if ( $isCarousel ) {
					$dCol = $tCol = $mCol = 12;
				}
				$arg['grid']      = "rt-col-md-{$dCol} rt-col-sm-{$tCol} rt-col-xs-{$mCol}";
				$gridType         = ! empty( $scMeta['tss_grid_style'][0] ) ? esc_attr($scMeta['tss_grid_style'][0]) : 'even';
				$arg['read_more'] = ! empty( $scMeta['tss_read_more_button_text'][0] ) ? esc_attr( $scMeta['tss_read_more_button_text'][0] ) : null;
				$arg['class']     = $gridType . "-grid-item";
				$arg['class']     .= " tss-grid-item";
				$preLoader        = null;
				if ( $isIsotope ) {
					$arg['class'] .= ' isotope-item';
					$preLoader    = 'tss-pre-loader';
				}
				if ( $isCarousel ) {
					$arg['class'] .= ' carousel-item';
					$preLoader    = 'tss-pre-loader';
				}
				$masonryG = null;
				if ( $gridType == "even" ) {
					$masonryG     = " tss-even";
					$arg['class'] .= ' even-grid-item';
				} else if ( $gridType == "masonry" && ! $isIsotope && ! $isCarousel ) {
					$masonryG     = " tss-masonry";
					$arg['class'] .= ' masonry-grid-item';
				}
				$margin = ! empty( $scMeta['tss_margin'][0] ) ? esc_attr($scMeta['tss_margin'][0]) : 'default';
				if ( $margin == 'no' ) {
					$arg['class'] .= ' no-margin';
				} else {
					$arg['class'] .= ' default-margin';
				}

				$image_type = ! empty( $scMeta['tss_image_type'][0] ) ? esc_attr( $scMeta['tss_image_type'][0] ) : 'normal';
				if ( $image_type == 'circle' ) {
					$arg['class'] .= ' tss-img-circle';
				}

				$arg['items']       = ! empty( $scMeta['tss_item_fields'] ) ? array_map('sanitize_text_field', $scMeta['tss_item_fields']) : array();
				$arg['anchorClass'] = null;
				$link               = ! empty( $scMeta['tss_detail_page_link'][0] ) ? true : false;
				$arg['link']        = $link ? true : false;
				$parentClass        = ( ! empty( $scMeta['tss_parent_class'][0] ) ? trim( $scMeta['tss_parent_class'][0] ) : null );

				// Start layout
				$html .= TSSPro()->layoutStyle( $layoutID, $scMeta, $scID );
				$html .= "<div class='rt-container-fluid tss-wrapper {$parentClass}' id='{$layoutID}' {$containerDataAttr}>";
				$html .= "<div data-title='" . esc_html__( "Loading ...",
						'testimonial-slider-showcase' ) . "' class='rt-row tss-{$layout}{$masonryG} {$preLoader}'>";

				$tssQuery = new WP_Query( $args );
				if ( $tssQuery->have_posts() ) {
					if ( $isIsotope ) {
						$terms = get_terms( array(
							'taxonomy'   => TSSPro()->taxonomies['category'],
							'hide_empty' => false,
							'orderby'    => 'meta_value_num',
							'order'      => 'ASC',
							'meta_key'   => '_order'
						) );

						$html           .= '<div class="tss-iso-filter"><div id="iso-button-' . $rand . '" class="tss-isotope-button-wrapper filter-button-group">';
						$htmlButton     = null;
						$fSelectTrigger = false;
						if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
							foreach ( $terms as $term ) {
								$tItem   = ! empty( $scMeta['tss_isotope_selected_filter'][0] ) ? absint($scMeta['tss_isotope_selected_filter'][0]) : null;
								$fSelect = null;
								if ( $tItem == $term->term_id ) {
									$fSelect        = ' selected';
									$fSelectTrigger = true;
								}
								$htmlButton .= "<span class='rt-iso-button {$fSelect}' data-filter-counter='' data-filter='.iso_{$term->term_id}' {$fSelect}>" . $term->name . "</span>";
							}
						}
						if ( empty( $scMeta['tss_isotope_filter_show_all'][0] ) ) {
							$fSelect = ( $fSelectTrigger ? null : ' selected' );
							$html    .= "<span class='rt-iso-button{$fSelect}' data-filter-counter='' data-filter='*'>" . esc_html__( 'Show all',
									'testimonial-slider-showcase' ) . "</span>";
						}
						$html .= $htmlButton;
						$html .= '</div>';
						if ( ! empty( $scMeta['tss_isotope_search_filtering'][0] ) ) {
							$html .= "<div class='iso-search'><input type='text' class='iso-search-input' placeholder='" . esc_html__( 'Search',
									'testimonial-slider-showcase' ) . "' /></div>";
						}
						$html .= '</div>';

						$html .= '<div class="tss-isotope" id="tss-isotope-' . $rand . '">';
					} elseif ( $isCarousel ) {
						$smartSpeed         = ! empty( $scMeta['tss_carousel_speed'][0] ) ? absint( $scMeta['tss_carousel_speed'][0] ) : 250;
						$autoplayTimeout    = ! empty( $scMeta['tss_carousel_autoplay_timeout'][0] ) ? absint( $scMeta['tss_carousel_autoplay_timeout'][0] ) : 5000;
						$cOpt               = ! empty( $scMeta['tss_carousel_options'] ) ? array_filter($scMeta['tss_carousel_options']) : array();
						$autoPlay           = ( in_array( 'autoplay', $cOpt ) ? 'true' : 'false' );
						$autoPlayHoverPause = ( in_array( 'autoplayHoverPause', $cOpt ) ? 'true' : 'false' );
						$nav                = ( in_array( 'nav', $cOpt ) ? 'true' : 'false' );
						$dots               = ( in_array( 'dots', $cOpt ) ? 'true' : 'false' );
						$loop               = ( in_array( 'loop', $cOpt ) ? 'true' : 'false' );
						$lazyLoad           = ( in_array( 'lazyLoad', $cOpt ) ? 'true' : 'false' );
						$autoHeight         = ( in_array( 'autoHeight', $cOpt ) ? 'true' : 'false' );
						$rtl                = ( in_array( 'rtl', $cOpt ) ? 'true' : 'false' );

						$html .= "<div class='tss-carousel' 
										data-loop='{$loop}'
			                            data-items-desktop='{$dColItems}'
			                            data-items-tab='{$tColItems}'
			                            data-items-mobile='{$mColItems}'
			                            data-autoplay='{$autoPlay}'
			                            data-autoplay-timeout='{$autoplayTimeout}'
			                            data-autoplay-hover-pause='{$autoPlayHoverPause}'
			                            data-dots='{$dots}'
			                            data-nav='{$nav}'
			                            data-lazy-load='{$lazyLoad}'
			                            data-auto-height='{$autoHeight}'
			                            data-rtl='{$rtl}'
			                            data-smart-speed='{$smartSpeed}'
										>";
					}

					while ( $tssQuery->have_posts() ) : $tssQuery->the_post();
						$iID                 = get_the_ID();
						$arg['iID']          = $iID;
						$arg['author']       = get_the_title();
						$arg['designation']  = get_post_meta( $iID, 'tss_designation', true );
						$arg['company']      = get_post_meta( $iID, 'tss_company', true );
						$arg['location']     = get_post_meta( $iID, 'tss_location', true );
						$arg['rating']       = get_post_meta( $iID, 'tss_rating', true );
						$arg['video']        = get_post_meta( $iID, 'tss_video', true );
						$arg['social_media'] = get_post_meta( $iID, 'tss_social_media', true );
						$arg['pLink']        = get_permalink();
						$aHtml               = null;
						if ( in_array( 'read_more', $arg['items'] ) && function_exists('rttsp') ) {
							$aHtml = "<a class='rt-read-more' href='" . esc_url( $arg['pLink'] ) . "'>{$arg['read_more']}</a>";
						}
						if($testi_limit){
							$arg['testimonial'] = TSSPro()->strip_tags_content( get_the_content(), $testi_limit, $aHtml );
						}else{
							$arg['testimonial'] = get_the_content();
						}
						$arg['video_url'] = get_post_meta( $iID, 'tss_video', true );
						if ( $isIsotope && taxonomy_exists( TSSPro()->taxonomies['category'] ) ) { 
							$termAs    = wp_get_post_terms( $iID, TSSPro()->taxonomies['category'],
								array( "fields" => "all" ) );
							$isoFilter = null;
							if ( ! empty( $termAs ) ) {
								foreach ( $termAs as $term ) {
									$isoFilter .= " " . "iso_" . $term->term_id;
									$isoFilter .= " " . $term->slug;
								}
							}
							$arg['isoFilter'] = $isoFilter;
						}
						$arg['img'] = TSSPro()->getFeatureImage( $iID, $imgSize, $customImgSize, $defaultImgId );  
						$html       .= TSSPro()->render( 'layouts/' . $layout, $arg );

					endwhile;

					if ( $isIsotope || $isCarousel ) {
						$html .= '</div>'; // End isotope / Carousel item holder
					}
				} else {
					$html .= "<p>" . esc_html__( "No testimonial found", 'testimonial-slider-showcase' ) . "</p>";
				}
				if ( $isIsotope || $isCarousel ) {
					$html .= '<div class="rt-loading-overlay"></div><div class="rt-loading rt-ball-clip-rotate"><div></div></div>';
				}
				$html .= "</div>"; // End row

				if ( $pagination && ! $isCarousel ) {
					$htmlUtility = null;
					if ( $posts_loading_type == "pagination" ) {
						$htmlUtility .= TSSPro()->pagination( $tssQuery->max_num_pages, $args['posts_per_page'] );
					} elseif ( $posts_loading_type == "pagination_ajax" && ! $isIsotope ) {
						$htmlUtility .= TSSPro()->pagination( $tssQuery->max_num_pages, $args['posts_per_page'], true,
							$scID );
					} elseif ( $posts_loading_type == "load_more" ) {
						$postPp         = $tssQuery->query_vars['posts_per_page'];
						$page           = $tssQuery->query_vars['paged'];
						$foundPosts     = $tssQuery->found_posts;
						$totalPage      = $tssQuery->max_num_pages;
						$morePosts      = $foundPosts - ( $postPp * $page );
						$noMorePostText = esc_html__( "No More Post to load", 'testimonial-slider-showcase' );
						$loadMoreText   = esc_html__( 'Load More', 'testimonial-slider-showcase' );
						$loadingText    = esc_html__( 'Loading ...', 'testimonial-slider-showcase' );
						$htmlUtility    .= "<div class='tss-load-more'>
                                        <span class='rt-button' data-sc-id='{$scID}' data-total-pages='{$totalPage}' data-posts-per-page='{$postPp}' data-found-posts='{$foundPosts}' data-paged='1'
                                        data-no-more-post-text='{$noMorePostText}' data-loading-text='{$loadingText}'>{$loadMoreText} <span>({$morePosts})</span></span>
                                    </div>";
					} elseif ( $posts_loading_type == "load_on_scroll" ) {
						$htmlUtility .= "<div class='tss-scroll-load-more' data-trigger='1' data-sc-id='{$scID}' data-paged='2'></div>";
					}

					if ( $htmlUtility ) {
						$html .= "<div class='tss-utility'>" . $htmlUtility . "</div>";
					}

				}
				$html .= "</div>"; // tss-container pfp
				wp_reset_postdata();
				$scriptGenerator               = array();
				$scriptGenerator['layout']     = $layoutID;
				$scriptGenerator['rand']       = $rand;
				$scriptGenerator['scMeta']     = $scMeta;
				$scriptGenerator['isIsotope']  = ( $isIsotope || $gridType == "masonry" ? true : false );
				$scriptGenerator['isCarousel'] = $isCarousel;
				$this->scA[]                   = $scriptGenerator;
				add_action( 'wp_footer', array( $this, 'register_scripts' ) );
			} else {
				$html .= "<p>" . esc_html__( "No shortCode found", 'testimonial-slider-showcase' ) . "</p>";
			}

			return $html;
		}

		private function getItemsId( $itemIds ) {
			$html = null;
			if ( ! empty( $itemIds ) && is_array( $itemIds ) ) {
				$html .= "<span class='tlp-port-item-count'>";
				foreach ( $itemIds as $item ) {
					$html .= "<span>{$item}</span>";
				}
				$html .= "</span>";
			}

			return $html;
		}
	}
endif;
