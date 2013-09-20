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
          <div class='col-lg-5 col-md-5 col-sm-5'>
            <div class="phone-slider">

            </div>
          </div><!-- end page col -->
          <div class='col-lg-7 col-md-7 col-sm-7'>
            <!--start the loop-->
            <div class="double-margin-top home-content triple-margin-bottom">
              <div class="row">
                <div class='col-lg-10 col-md-10 col-sm-10'>
                  <?php if (have_posts()) : ?>
                  <?php while (have_posts()) : the_post(); ?>
                      <?php the_content(); ?> 
                  <!--end the loop-->
                  <?php endwhile; ?>
                  <?php endif; ?>
                </div>
                <div class='col-lg-2 col-md-2 col-sm-2'>
                </div>
              </div>
            </div>
            <div class="trees">
              <img src="<?php bloginfo('template_url'); ?>/images/trees.png">
            </div>
          </div><!-- end page col -->
        </div>
      </div>
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