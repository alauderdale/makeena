<?php get_header(); ?>

<!-- /hero -->

<section class='page'>
  <div class='container'>
    <div class='row'>
      <div class='col-lg-12'>
        <div class='row'>
          <div class='col-lg-12 col-md-12'>
            <!--start the loop-->
            <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <?php the_content(); ?> 
            <!--end the loop-->
            <?php endwhile; ?>
            <?php endif; ?>
          </div><!-- end page col -->
        </div>
      </div>
    </div>
  </div>
</section>

<?php get_footer(); ?>