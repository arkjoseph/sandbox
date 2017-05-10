<?php

namespace Drupal\blog_feed\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Controller for blog_feed.
 *
 * @ingroup blog_feed
 */
class BlogFeedController extends ControllerBase {

  /**
   * @return array
   *   A renderable array.
   */
  public function getBlogFeedImplementation() {
    $title = t('Blog API');
    // Build using our theme. This gives us content, which is not a good
    // practice, but which allows us to demonstrate adding JavaScript here.
    $build['myelement'] = array(
      '#theme' => 'blog_feed',
      '#title' => $title,
    );
    // Add our script. It is tiny, but this demonstrates how to add it. We pass
    // our module name followed by the internal library name declared in
    // libraries yml file.
    $build['myelement']['#attached']['library'][] = 'blog_feed/blog_feed.api';
    // Return the renderable array.
    return $build;
  }

}
