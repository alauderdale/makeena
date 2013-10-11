<?php
    
  //global options

  //thumbnails

  if ( function_exists( 'add_theme_support' ) ) {
    add_theme_support( 'post-thumbnails' );
  }
      
  //main nav
  
  register_nav_menu( 'main_nav', __( 'Main navigation menu', 'mytheme' ) );
  register_nav_menu( 'footer', __( 'footer navigation menu', 'mytheme' ) );

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
    
        register_post_type( 'person',
            array(
                'labels' => array(
                    'name' => __( 'People' ),
                    'singular_name' => __( 'Person' )
                ),
                'supports' => array( 'title', 'editor', 'excerpt', 'custom-fields', 'thumbnail' ),
                'public' => true,
            )
        );
        register_post_type( 'home-icon',
            array(
                'labels' => array(
                    'name' => __( 'Home Icon' ),
                    'singular_name' => __( 'icon' )
                ),
                'supports' => array( 'title', 'editor', 'excerpt', 'custom-fields', 'thumbnail' ),
                'public' => true,
            )
        );
        register_post_type( 'social-icon',
            array(
                'labels' => array(
                    'name' => __( 'Social Icon' ),
                    'singular_name' => __( 'icon' )
                ),
                'supports' => array( 'title', 'editor', 'excerpt', 'custom-fields', 'thumbnail' ),
                'public' => true,
            )
        );
        register_post_type( 'slider-image',
            array(
                'labels' => array(
                    'name' => __( 'Phone Slider image' ),
                    'singular_name' => __( 'icon' )
                ),
                'supports' => array( 'title', 'editor', 'excerpt', 'custom-fields', 'thumbnail' ),
                'public' => true,
            )
        );
        register_post_type( 'press',
            array(
                'labels' => array(
                    'name' => __( 'Press' ),
                    'singular_name' => __( 'Press' )
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
	    ///people
	    array(
	        'id' => 'my-meta-box-1',
	        'title' => 'Options',
	        'pages' => array('person'), // multiple post types
	        'context' => 'normal',
	        'priority' => 'high',
	        'fields' => array(
	            array(
	                'name' => 'Title',
	                'desc' => 'add text for the person\'s title',
	                'id' => 'title',
	                'type' => 'text',
	                'std' => ''
	            )
	        )
	    ),
	    ///people
	    array(
	        'id' => 'my-meta-box-2',
	        'title' => 'Options',
	        'pages' => array('social-icon'), // multiple post types
	        'context' => 'normal',
	        'priority' => 'high',
	        'fields' => array(
	            array(
	                'name' => 'icon letter',
	                'desc' => 'add the icon letter from this font http://fontfabric.com/social-media-icons-pack/',
	                'id' => 'class',
	                'type' => 'text',
	                'std' => ''
	            ),
	            array(
	                'name' => 'link',
	                'desc' => 'add the icon link',
	                'id' => 'link',
	                'type' => 'text',
	                'std' => ''
	            ),
	        )
	    ),
	    ///press
	    array(
	        'id' => 'my-meta-box-3',
	        'title' => 'Options',
	        'pages' => array('press'), // multiple post types
	        'context' => 'normal',
	        'priority' => 'high',
	        'fields' => array(
	            array(
	                'name' => 'link',
	                'desc' => 'add the press link',
	                'id' => 'link',
	                'type' => 'text',
	                'std' => ''
	            ),
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
<?php

$themename = "Makeena Options";
$shortname = "nt";

$categories = get_categories('hide_empty=0&orderby=name');
$wp_cats = array();
foreach ($categories as $category_list ) {
       $wp_cats[$category_list->cat_ID] = $category_list->cat_name;
}
array_unshift($wp_cats, "Choose a category"); 

$options = array (
 
array( "name" => $themename." Options",
	"type" => "title"),
 

array( "name" => "General",
	"type" => "section"),
array( "type" => "open"),
 
	
array( "name" => "Footer Text",
	"desc" => "Enter the copyright text for the footer",
	"id" => $shortname."_copyright",
	"type" => "text",
	"std" => ""),
	
	

array( "type" => "close")
 
);


function mytheme_add_admin() {
 
global $themename, $shortname, $options;
 
if ( $_GET['page'] == basename(__FILE__) ) {
 
	if ( 'save' == $_REQUEST['action'] ) {
 
		foreach ($options as $value) {
		update_option( $value['id'], $_REQUEST[ $value['id'] ] ); }
 
foreach ($options as $value) {
	if( isset( $_REQUEST[ $value['id'] ] ) ) { update_option( $value['id'], $_REQUEST[ $value['id'] ]  ); } else { delete_option( $value['id'] ); } }
 
	header("Location: admin.php?page=functions.php&saved=true");
die;
 
} 
else if( 'reset' == $_REQUEST['action'] ) {
 
	foreach ($options as $value) {
		delete_option( $value['id'] ); }
 
	header("Location: admin.php?page=functions.php&reset=true");
die;
 
}
}
 
add_menu_page($themename, $themename, 'administrator', basename(__FILE__), 'mytheme_admin');
}

function mytheme_add_init() {

$file_dir=get_bloginfo('template_directory');
wp_enqueue_style("functions", $file_dir."/functions/functions.css", false, "1.0", "all");
wp_enqueue_script("rm_script", $file_dir."/functions/rm_script.js", false, "1.0");

}
function mytheme_admin() {
 
global $themename, $shortname, $options;
$i=0;
 
if ( $_REQUEST['saved'] ) echo '<div id="message" class="updated fade"><p><strong>'.$themename.' settings saved.</strong></p></div>';
if ( $_REQUEST['reset'] ) echo '<div id="message" class="updated fade"><p><strong>'.$themename.' settings reset.</strong></p></div>';
 
?>
<div class="wrap rm_wrap">
<h2><?php echo $themename; ?> Settings</h2>
 
<div class="rm_opts">
<form method="post">
<?php foreach ($options as $value) {
switch ( $value['type'] ) {
 
case "open":
?>
 
<?php break;
 
case "close":
?>
 
</div>
</div>
<br />

 
<?php break;
 
case "title":
?>
<p>To easily use the <?php echo $themename;?>, you can use the menu below.</p>

 
<?php break;
 
case 'text':
?>

<div class="rm_input rm_text">
	<label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
 	<input name="<?php echo $value['id']; ?>" id="<?php echo $value['id']; ?>" type="<?php echo $value['type']; ?>" value="<?php if ( get_settings( $value['id'] ) != "") { echo stripslashes(get_settings( $value['id'])  ); } else { echo $value['std']; } ?>" />
 <small><?php echo $value['desc']; ?></small><div class="clearfix"></div>
 
 </div>
<?php
break;
 
case 'textarea':
?>

<div class="rm_input rm_textarea">
	<label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
 	<textarea name="<?php echo $value['id']; ?>" type="<?php echo $value['type']; ?>" cols="" rows=""><?php if ( get_settings( $value['id'] ) != "") { echo stripslashes(get_settings( $value['id']) ); } else { echo $value['std']; } ?></textarea>
 <small><?php echo $value['desc']; ?></small><div class="clearfix"></div>
 
 </div>
  
<?php
break;
 
case 'select':
?>

<div class="rm_input rm_select">
	<label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
	
<select name="<?php echo $value['id']; ?>" id="<?php echo $value['id']; ?>">
<?php foreach ($value['options'] as $option) { ?>
		<option <?php if (get_settings( $value['id'] ) == $option) { echo 'selected="selected"'; } ?>><?php echo $option; ?></option><?php } ?>
</select>

	<small><?php echo $value['desc']; ?></small><div class="clearfix"></div>
</div>
<?php
break;
 
case "checkbox":
?>

<div class="rm_input rm_checkbox">
	<label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
	
<?php if(get_option($value['id'])){ $checked = "checked=\"checked\""; }else{ $checked = "";} ?>
<input type="checkbox" name="<?php echo $value['id']; ?>" id="<?php echo $value['id']; ?>" value="true" <?php echo $checked; ?> />


	<small><?php echo $value['desc']; ?></small><div class="clearfix"></div>
 </div>
<?php break; 
case "section":

$i++;

?>

<div class="rm_section">
<div class="rm_title"><h3><img src="<?php bloginfo('template_directory')?>/functions/images/trans.gif" class="inactive" alt="""><?php echo $value['name']; ?></h3><span class="submit"><input name="save<?php echo $i; ?>" type="submit" value="Save changes" />
</span><div class="clearfix"></div></div>
<div class="rm_options">

 
<?php break;
 
}
}
?>
 
<input type="hidden" name="action" value="save" />
</form>
<form method="post">
<p class="submit">
<input name="reset" type="submit" value="Reset" />
<input type="hidden" name="action" value="reset" />
</p>
</form>

 </div> 
 

<?php
}
?>
<?php
add_action('admin_init', 'mytheme_add_init');
add_action('admin_menu', 'mytheme_add_admin');
?>