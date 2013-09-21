<?php
/*
Template Name: People
 */
?>


<?php get_header(); ?>

<!-- /hero -->

<section class='people'>
  <div class='container'>
    <div class='row'>
      <div class='col-lg-12'>
        <div class='row'>
          <div class='col-lg-12 col-md-12'>
            <?php
					        $postLoop = new WP_Query( array( 'post_type' => 'person') );
					      ?>
					      <?php while ( $postLoop->have_posts() ) : $postLoop->the_post(); ?>
					  	<div class="person double-margin-bottom">
                <div class="row">
                  <div class="col-lg-2 col-md-2 col-sm-2 text-center">
                    <div class="person-avatar margin-bottom">
                      <?php  the_post_thumbnail('full', array('class' => 'img-circle full-width')); ?>
                    </div>
                  </div>
                  <div class="col-lg-10 col-md-10 col-sm-10">
                    <h2 class="media-heading">
                      <?php the_title(); ?> 
                    </h2>
                    <h4 class="half-margin-bottom">
                      <?php echo get_post_meta($post->ID, 'title', true); ?>
                    </h4>
                    <?php the_content(); ?> 
                  </div>
                </div>
					  	</div>
					  <?php endwhile; ?>
          </div><!-- end page col -->
        </div>
      </div>
    </div>
  </div>
</section>

<?php get_footer(); ?>