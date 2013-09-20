<?php
/*
Template Name: People
 */
?>


<?php get_header(); ?>

<!-- /hero -->

<section class='page'>
  <div class='container'>
    <div class='row'>
      <div class='col-lg-12'>
        <div class='row'>
          <div class='col-lg-12 col-md-12'>
            <?php
					        $postLoop = new WP_Query( array( 'post_type' => 'person') );
					      ?>
					      <?php while ( $postLoop->have_posts() ) : $postLoop->the_post(); ?>
					  	<div class="person">
					  		<h2>
					  			<?php the_title(); ?> 
					  		</h2>
					  		<?php the_content(); ?> 
					  	</div>
					  <?php endwhile; ?>
          </div><!-- end page col -->
        </div>
      </div>
    </div>
  </div>
</section>

<?php get_footer(); ?>