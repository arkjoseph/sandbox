<?php

namespace Drupal\jobs_api\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Controller for jobs_api.
 *
 * @ingroup jobs_api
 */
class JobsApiController extends ControllerBase {

  /**
   * @return array
   *   A renderable array.
   */
  public function getJobsApiImplementation() {
    $title = t('Select filters');
    // Build using our theme. This gives us content, which is not a good
    // practice, but which allows us to demonstrate adding JavaScript here.
    $build['myelement'] = array(
      '#theme' => 'jobs_api',
      '#title' => $title,
    );
    // Add our script. It is tiny, but this demonstrates how to add it. We pass
    // our module name followed by the internal library name declared in
    // libraries yml file.
    $build['myelement']['#attached']['library'][] = 'jobs_api/jobs_api.api';
    // Return the renderable array.
    return $build;
  }

}
