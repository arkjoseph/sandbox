/**
 * @file
 * Contains js the jobs api json feed.
 */



(function ($, Drupal) {
  Drupal.behaviors.usaJobs = {
    attach: function (context, settings) {
      'use strict';
      var $authKey = "bLTvp99I05OBhwJAkVSpRv8QfCp9eN+FRqPi7DoIbT0=";

      $.ajax({
        url: "https://data.usajobs.gov/api/search?K=GSA&l=United+States&ResultsPerPage=5",
        type: "GET",
        headers: {
          "Authorization-Key": $authKey,
          "Content-Type": "application/json"
        },
        //async: true,
        //cache: true,
        dataType: "json",
        success: function(data){
          $.each(data.SearchResult.SearchResultItems, function(key,value){
            var value      = this.MatchedObjectDescriptor,
              title      = value.PositionTitle,
              positionid = value.PositionID,
              uri        = value.PositionURI,
              local      = value.PositionLocationDisplay,
              desc       = value.UserArea.Details.JobSummary;

            $(".json-content").append("<li>" +
              "<a target='_blank' href='"+ uri +"' data-position-id='" + positionid + "'>" + title + "</a> &mdash; '"+ local +"' " +
              "<ul><li><p>"+ desc +"</p></li>" +
              "<li><a target='_blank' href='"+ uri +"?PostingChannelID=RESTAPI'><b>Apply</b></a></li></ul>" +
              "</li>"
            );
          });
        }
      });
    }
  };


})(jQuery,Drupal);
