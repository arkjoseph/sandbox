/**
 *
 * @file
 * Contains js the blog_feed xml/rss feed.
 * Yahoo YQL is preparing the data for XHR distribution
 * https://developer.yahoo.com/yql/
 *
 */

(function ($, Drupal) {
  'use strict';

  Drupal.blog_feed = {};
  Drupal.behaviors.blog_feed = {
    attach: function (context, settings) {
      Drupal.blog_feed.feed();
    }
  };

  //
  // Main jobs feed ajax get request
  //

  Drupal.blog_feed.feed = function () {
    var feed = "https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20xml%20WHERE%20url%3D%22https%3A%2F%2Fgsablogs.gsa.gov%2Finnovation%2Ffeed%3Fformat%3Dxml%22&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

    $.ajax(feed, {
      accepts:{
        xml:"application/rss+xml"
      },
      dataType:"xml",
      beforeSend: function () {
        $(".loading").removeClass("hidden");
      },
      success:function(data) {
        $(data).find("item").each(function () {
          var value       = $(this),
              title       = value.find("title").text(),
              link        = value.find("link").text(),
              description = value.find("description").text();

         $("#innovationFeed ul").append("<li><p>'"+title+"'<br><a target='_blank' href='"+link+"'>Learn More</a></p></li>").fadeIn();

        });
      },complete: function(){
        $(".loading").addClass("hidden");
      }
    });
  };


})(jQuery,Drupal);
