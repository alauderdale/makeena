<!doctype html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta content='width=device-width,initial-scale=1, user-scalable=no' name='viewport'>
    <meta content='IE=edge,chrome=1' http-equiv='X-UA-Compatible'>
    <title>
      <?php wp_title(''); ?> <?php bloginfo('name'); ?>
    </title>
    <link href="<?php bloginfo('template_url'); ?>/stylesheets/bootstrap.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="<?php bloginfo('template_url'); ?>/stylesheets/font-awesome.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="<?php bloginfo('template_url'); ?>/stylesheets/royalslider.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="<?php bloginfo('template_url'); ?>/stylesheets/rs-default-inverted.css" rel="stylesheet">
    <link href="<?php bloginfo('template_url'); ?>/stylesheets/style.css" media="screen" rel="stylesheet" type="text/css" />
    <?php wp_head(); ?>
  </head>

  <body>
  <nav class='navbar navbar-default navbar-fixed-top main-nav ' role='navigation'>
    <div class='container'>
      <div class='navbar-header'>
        <button class='navbar-toggle' data-target='.navbar-ex1-collapse' data-toggle='collapse' type='button'>
          <span class='sr-only'>Toggle navigation</span>
          <span class='icon-bar'></span>
          <span class='icon-bar'></span>
          <span class='icon-bar'></span>
        </button>
        <a class='navbar-brand logo double-margin-right' href='<?php echo get_option('home'); ?>'>
            
        </a>
      </div>
      <div class='collapse navbar-collapse navbar-ex1-collapse'>
<!--         main menu -->
        <?php wp_nav_menu( array('menu' => 'Main', 'container' => '', 'items_wrap' => '<ul class="nav navbar-nav navbar-right">%3$s</ul>' )); ?>
      </div>
    </div>
  </nav>