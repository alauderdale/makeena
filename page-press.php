<?php
/*
Template Name: Press
 */
?>


<?php get_header(); ?>

<!-- /hero -->

<section class='press'>
  <div class='container'>
    <div class='row'>
      <div class='col-lg-12'>
        <div class='row'>
          <div class='col-lg-12 col-md-12'>
            <?php
					        $pressLoop = new WP_Query( array( 'post_type' => 'press') );
					      ?>
					      <?php while ( $pressLoop->have_posts() ) : $pressLoop->the_post(); ?>
					  	<div class="person double-margin-bottom">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <h2>
                      <?php the_title(); ?> 
                    </h2>
                    <div class="margin-bottom">
                      <?php the_content(); ?> 
                    </div>
                    <a href="<?php echo get_post_meta($post->ID, 'link', true); ?>" class="btn btn-primary btn-lg" target="_blank">
                      Read Article
                    </a>
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