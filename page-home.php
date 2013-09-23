<?php
/*
Template Name: Home
 */
?>

<?php get_header(); ?>

<section class='home-hero'>
  <div class='container'>
    <div class='row'>
      <div class='col-lg-12'>
        <div class='row'>
          <div class='col-lg-4 col-md-4 col-sm-4'>
            <div class="full-width inline-block">
              <div class="laptopBg">
                <img src="<?php bloginfo('template_url'); ?>/images/iphone.png" class="imgBg" width="260" height="541">
                <div id="slider-in-laptop" class="royalSlider rsDefaultInv">
                  <img src="<?php bloginfo('template_url'); ?>/images/slider.png">
                  <img src="<?php bloginfo('template_url'); ?>/images/slider.png">
                  <img src="<?php bloginfo('template_url'); ?>/images/slider.png">
                  <img src="<?php bloginfo('template_url'); ?>/images/slider.png">
                </div>
              </div>
            </div>
          </div><!-- end page col -->
          <div class='col-lg-6 col-md-6 col-sm-6'>
            <!--start the loop-->
            <div class="double-margin-top home-content triple-margin-bottom">
              <?php if (have_posts()) : ?>
              <?php while (have_posts()) : the_post(); ?>
                  <?php the_content(); ?> 
              <!--end the loop-->
              <?php endwhile; ?>
              <?php endif; ?>
            </div>
            <div class="trees">
              <img src="<?php bloginfo('template_url'); ?>/images/trees.png">
            </div>
          </div><!-- end page col -->
          <div class='col-lg-2 col-md-2 col-sm-2'></div>
        </div>
      </div><!-- end col main -->
    </div>
  </div>
</section>
<section class='home-icons'>
  <div class='container'>
    <div class='row'>
      <?php
        $postLoop = new WP_Query( array( 'post_type' => 'home-icon') );
      ?>
      <?php while ( $postLoop->have_posts() ) : $postLoop->the_post(); ?>
      <div class='col-lg-4 col-md-4 col-sm-4 text-center'>
        <div class="home-icon">
          <img class="margin-bottom" src="<?php
                          $imgsrc2 = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), "Full");
                          echo $imgsrc2[0];
                          ?>">
          <div>
            <?php the_content(); ?> 
          </div>
        </div>
      </div>
      <?php endwhile; ?>
    </div>
  </div>
</section>

<?php get_footer(); ?>