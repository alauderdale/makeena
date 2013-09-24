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
                  <?php
                    $sliderLoop = new WP_Query( array( 'post_type' => 'slider-image') );
                  ?>
                  <?php while ( $sliderLoop->have_posts() ) : $sliderLoop->the_post(); ?>
                  <img src="<?php
                          $imgsrc3 = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), "Full");
                          echo $imgsrc3[0];
                          ?>">
                  <?php endwhile; ?>
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
    <div class='row margin-bottom'>
      <div class='col-lg-1'></div>
      <div class='col-lg-10'>
        <div class="user-info">
          <h4 class="text-center">Sign up for updates from makeena.</h4>
          <div class="user-form">
            <?php echo do_shortcode("[pdb_signup]"); ?>
          </div>
        </div>
      </div>
      <div class='col-lg-1'></div>
    </div>
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
            <p class="half-margin-bottom">
              <strong>
                <?php the_title(); ?>
              </strong>
            </p>
            <?php the_content(); ?> 
          </div>
        </div>
      </div>
      <?php endwhile; ?>
    </div>
  </div>
</section>

<?php get_footer(); ?>