    <footer>
    	<section>
    		  <div class='container'>
				    <div class='row'>
				      <div class='col-lg-4 col-md-4 col-sm-4 text-center'>
				      	©makeena, inc. - all rights reserved. 
				      </div>
				      <div class='col-lg-4 col-md-4 col-sm-4 text-center'>
				      	<?php wp_nav_menu( array('theme_location' => 'footer' , 'container' => '', 'items_wrap' => '<ul class="list-inline">%3$s</ul>' )); ?>
				      </div>
				      <div class='col-lg-4 col-md-4 col-sm-4 text-center'>
				      	<ul class="list-inline footer-social social-font-name">
				      	<?php
					        $postLoop = new WP_Query( array( 'post_type' => 'social-icon') );
					      ?>
					      <?php while ( $postLoop->have_posts() ) : $postLoop->the_post(); ?>
					      <li>
					      	<a href="#">
					      		b
					      	</a>
					      <?php endwhile; ?>
				      </div>
				    </div>
				  </div>
    	</section>
    </footer>
  </body>
<?php wp_footer(); ?>
</html>