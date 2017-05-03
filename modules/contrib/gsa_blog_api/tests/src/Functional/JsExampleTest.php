<?php

namespace Drupal\Tests\jobs_api\Functional;
use Drupal\Tests\examples\Functional\ExamplesBrowserTestBase;

/**
 * Functional tests for the js_example module.
 *
 * @ingroup js_example
 *
 * @group js_example
 * @group examples
 */
class JobsApi extends ExamplesBrowserTestBase {

  /**
   * Modules to install.
   *
   * @var array
   */
  public static $modules = array('jobs_api', 'node');

  /**
   * Test all the paths defined by our module.
   */
  public function testJsExample() {
    $assert = $this->assertSession();

    $paths = [
      'examples/js-example',
      'examples/js-example/weights',
      'examples/js-example/accordion',
    ];
    foreach ($paths as $path) {
      $this->drupalGet($path);
      $assert->statusCodeEquals(200);
    }
  }

}
