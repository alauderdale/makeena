<?php
    
  //global options

  //thumbnails

  if ( function_exists( 'add_theme_support' ) ) {
    add_theme_support( 'post-thumbnails' );
  }
      
  //main nav
  
  register_nav_menu( 'main_nav', __( 'Main navigation menu', 'mytheme' ) );
  register_nav_menu( 'footer1', __( '1st navigation menu', 'mytheme' ) );
  register_nav_menu( 'footer2', __( '2nd navigation menu in footer', 'mytheme' ) );

      /*** Register our sidebars and widgetized areas.**/
    function wli_widgets_init() {

        register_sidebar( array(
            'name' => 'contact',
            'id' => 'contact',
            'before_widget' => '',
            'after_widget' => '',
            'before_title' => '',
            'after_title' => '',
            ) 
        );        
    }
    add_action( 'widgets_init', 'wli_widgets_init' ); 

  //create post types
    
    add_action( 'init', 'create_my_post_types' );
    
    function create_my_post_types() {
    
        register_post_type( 'testimonial',
            array(
                'labels' => array(
                    'name' => __( 'Testimonials' ),
                    'singular_name' => __( 'Testimonial' )
                ),
                'supports' => array( 'title', 'editor', 'excerpt', 'custom-fields', 'thumbnail' ),
                'public' => true,
            )
        );
        register_post_type( 'home-preview',
            array(
                'labels' => array(
                    'name' => __( 'home preview' ),
                    'singular_name' => __( 'home preview' )
                ),
                'supports' => array( 'title', 'editor', 'excerpt', 'custom-fields', 'thumbnail' ),
                'public' => true,
            )
        );
        register_post_type( 'about-point',
            array(
                'labels' => array(
                    'name' => __( 'about point' ),
                    'singular_name' => __( 'point' )
                ),
                'supports' => array( 'title', 'editor', 'excerpt', 'custom-fields', 'thumbnail' ),
                'public' => true,
            )
        );
        register_post_type( 'social-block',
            array(
                'labels' => array(
                    'name' => __( 'Social block' ),
                    'singular_name' => __( 'point' )
                ),
                'supports' => array( 'title', 'editor', 'excerpt', 'custom-fields', 'thumbnail' ),
                'public' => true,
            )
        );
    }


	function my_admin_scripts() {
	     wp_enqueue_script('media-upload');
	     wp_enqueue_script('thickbox');
	     wp_register_script('my-upload', get_bloginfo('template_url') . '/javascripts/functions-script.js', array('jquery','media-upload','thickbox'));
	     wp_enqueue_script('my-upload');
	 }
	 function my_admin_styles() {
	    wp_enqueue_style('thickbox');
	 }
	 add_action('admin_print_scripts', 'my_admin_scripts');
	 add_action('admin_print_styles', 'my_admin_styles');

	$prefix = 'wli';

	$meta_boxes = array(
	    ///page
	    array(
	        'id' => 'my-meta-box-1',
	        'title' => 'Page Options',
	        'pages' => array('page'), // multiple post types
	        'context' => 'normal',
	        'priority' => 'high',
	        'fields' => array(
	            array(
	                'name' => 'Hero Title',
	                'desc' => 'add text for the hero title',
	                'id' => 'hero_title',
	                'type' => 'text',
	                'std' => ''
	            ),
	            array(
	                'name' => 'Hero Sub Title',
	                'desc' => 'add text for the sub hero title',
	                'id' => 'hero_sub',
	                'type' => 'text',
	                'std' => ''
	            ),
	        )
	    ),
	    ///testimonials
	    array(
	        'id' => 'my-meta-box-2',
	        'title' => 'Testimonial Options',
	        'pages' => array('testimonial'), // multiple post types
	        'context' => 'normal',
	        'priority' => 'high',
	        'fields' => array(
	            array(
	                'name' => 'Quote',
	                'desc' => 'add the testimonial text',
	                'id' => 'testimonial',
	                'type' => 'textarea',
	                'std' => ''
	            ),
	            array(
	                'name' => 'Speaker title',
	                'desc' => 'add speakers title',
	                'id' => 'title',
	                'type' => 'text',
	                'std' => ''
	            )
	        )
	    ),
	    ///about points
	    array(
	        'id' => 'my-meta-box-3',
	        'title' => 'Options',
	        'pages' => array('about-point'), // multiple post types
	        'context' => 'normal',
	        'priority' => 'high',
	        'fields' => array(
	            array(
	                'name' => 'Icon Class',
	                'desc' => 'enter the <a target="_blank" href="http://fortawesome.github.io/Font-Awesome/icons/">font-awesome</a> icon class ex: icon-home',
	                'id' => 'class',
	                'type' => 'text',
	                'std' => ''
	            )
	        )
	    ),
	    ///post
	    array(
	        'id' => 'my-meta-box-4',
	        'title' => 'Homepage Featured Post Options',
	        'pages' => array('post'), // multiple post types
	        'context' => 'normal',
	        'priority' => 'high',
	        'fields' => array(
	            array(
	                'name' => 'Icon Class',
	                'desc' => 'enter the <a target="_blank" href="http://fortawesome.github.io/Font-Awesome/icons/">font-awesome</a> icon class ex: icon-home',
	                'id' => 'class',
	                'type' => 'text',
	                'std' => ''
	            ),
	            array(
	                'name' => 'Homepage Slider title',
	                'desc' => 'enter the text for the homepage slider',
	                'id' => 'slider_title',
	                'type' => 'text',
	                'std' => ''
	            ),
	            array(
	                'name' => 'Button Title',
	                'desc' => 'enter the text for the slider call to action',
	                'id' => 'slider_cta_title',
	                'type' => 'text',
	                'std' => ''
	            ),
	            array(
	                'name' => 'Custom Button Link',
	                'desc' => 'enter link for the slider call to action. If blank will link to the post',
	                'id' => 'slider_cta_link',
	                'type' => 'text',
	                'std' => ''
	            )
	        )
	    ),
			///home preview
	    array(
	        'id' => 'my-meta-box-5',
	        'title' => 'Homepage Featured Post Options',
	        'pages' => array('home-preview'), // multiple post types
	        'context' => 'normal',
	        'priority' => 'high',
	        'fields' => array(
	            array(
	                'name' => 'Link Title',
	                'desc' => 'enter the text for the slider call to action',
	                'id' => 'title',
	                'type' => 'text',
	                'std' => ''
	            ),
	            array(
	                'name' => 'Link URL',
	                'desc' => 'enter link for the post',
	                'id' => 'link',
	                'type' => 'text',
	                'std' => ''
	            )
	        )
	    ),
	    ///home preview
	    array(
	        'id' => 'my-meta-box-6',
	        'title' => 'Options',
	        'pages' => array('social-block'), // multiple post types
	        'context' => 'normal',
	        'priority' => 'high',
	        'fields' => array(
	            array(
	                'name' => 'Icon Class',
	                'desc' => 'enter the <a target="_blank" href="http://fortawesome.github.io/Font-Awesome/icons/">font-awesome</a> icon class ex: icon-home',
	                'id' => 'class',
	                'type' => 'text',
	                'std' => ''
	            ),
	            array(
	                'name' => 'Link URL',
	                'desc' => 'enter link for the post',
	                'id' => 'link',
	                'type' => 'text',
	                'std' => ''
	            )
	        )
	    )
	);

	add_action('admin_menu', 'mytheme_add_box');

	// Add meta box
	function mytheme_add_box() {
	    global $meta_box;

	    add_meta_box($meta_box['id'], $meta_box['title'], 'mytheme_show_box', $meta_box['page'], $meta_box['context'], $meta_box['priority']);
	}


	foreach ($meta_boxes as $meta_box) {
	    $my_box = new My_meta_box($meta_box);
	}

	class My_meta_box {
	 
	    protected $_meta_box;
	 
	    // create meta box based on given data
	    function __construct($meta_box) {
	        $this->_meta_box = $meta_box;
	        add_action('admin_menu', array(&$this, 'add'));
	 
	        add_action('save_post', array(&$this, 'save'));
	    }
	 
	    /// Add meta box for multiple post types
	    function add() {
	        foreach ($this->_meta_box['pages'] as $page) {
	            add_meta_box($this->_meta_box['id'], $this->_meta_box['title'], array(&$this, 'show'), $page, $this->_meta_box['context'], $this->_meta_box['priority']);
	        }
	    }
	 
	    // Callback function to show fields in meta box
	    function show() {
	        global $post;
	 
	        // Use nonce for verification
	        echo '<input type="hidden" name="mytheme_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';
	 
	        echo '<table class="form-table">';
	 
	        foreach ($this->_meta_box['fields'] as $field) {
	            // get current post meta data
	            $meta = get_post_meta($post->ID, $field['id'], true);
	 
	            echo '<tr>',
	                    '<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
	                    '<td>';
	            switch ($field['type']) {
	                case 'text':
	                    echo '<input type="text" name="', $field['id'], '" id="', $field['id'], '" value="', $meta ? $meta : $field['std'], '" size="30" style="width:97%" />',
	                        '<br />', $field['desc'];
	                    break;
	                case 'textarea':
	                    echo '<textarea name="', $field['id'], '" id="', $field['id'], '" cols="60" rows="4" style="width:97%">', $meta ? $meta : $field['std'], '</textarea>',
	                        '<br />', $field['desc'];
	                    break;
	                case 'select':
	                    echo '<select name="', $field['id'], '" id="', $field['id'], '">';
	                    foreach ($field['options'] as $option) {
	                        echo '<option', $meta == $option ? ' selected="selected"' : '', '>', $option, '</option>';
	                    }
	                    echo '</select>';
	                    break;
	                case 'radio':
	                    foreach ($field['options'] as $option) {
	                        echo '<input type="radio" name="', $field['id'], '" value="', $option['value'], '"', $meta == $option['value'] ? ' checked="checked"' : '', ' />', $option['name'];
	                    }
	                    break;
	                case 'button':
	                    echo '<input type="button" name="', $field['id'], '" id="', $field['id'], '"value="', $meta ? $meta : $field['std'], '" />';
	                    break;
	            }
	            echo     '<td>',
	                '</tr>';
	        }
	 
	        echo '</table>';
	    }
	 
	    // Save data from meta box
	    function save($post_id) {
	        // verify nonce
	        if (!wp_verify_nonce($_POST['mytheme_meta_box_nonce'], basename(__FILE__))) {
	            return $post_id;
	        }
	 
	        // check autosave
	        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
	            return $post_id;
	        }
	 
	        // check permissions
	        if ('page' == $_POST['post_type']) {
	            if (!current_user_can('edit_page', $post_id)) {
	                return $post_id;
	            }
	        } elseif (!current_user_can('edit_post', $post_id)) {
	            return $post_id;
	        }
	 
	        foreach ($this->_meta_box['fields'] as $field) {
	            $old = get_post_meta($post_id, $field['id'], true);
	            $new = $_POST[$field['id']];
	 
	            if ($new && $new != $old) {
	                update_post_meta($post_id, $field['id'], $new);
	            } elseif ('' == $new && $old) {
	                delete_post_meta($post_id, $field['id'], $old);
	            }
	        }
	    }
	}


	
?>