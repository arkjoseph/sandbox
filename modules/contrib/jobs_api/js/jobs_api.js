/**
 * @file
 * Contains js the jobs api json feed.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.jobs_api = {};
  Drupal.behaviors.jobs_api = {
    attach: function (context, settings) {

    }
  };

  //
  // Main jobs feed ajax get request
  //
  Drupal.jobs_api.feed = function (states,regionNumber) {
    var $authKey      = "bLTvp99I05OBhwJAkVSpRv8QfCp9eN+FRqPi7DoIbT0=",
      $host           = "data.usajobs.gov",
      $userAgent      = "joseph.garrido@gsa.gov",
      $state_array    = states.join(";"),
      $q_location     = $state_array,
      $q_keyword      = "GSA",
      $q_organization = "GS",
      $url_request    = "https://data.usajobs.gov/api/search?Organization='"+$q_organization+"'&LocationName='" + $q_location +"'",
      $clean_url      = $url_request.replace(/'/g,"");

    console.log($state_array);

    //$(".json-content").once(function (){
      $.ajax({
        url: $clean_url,
        type: "GET",
        headers: {
          "Authorization-Key": $authKey,
          "Content-Type": "application/json"
        },
        //async: true,
        //cache: true,
        dataType: "json",
        beforeSend: function () {
          $(".loading").removeClass("hidden");
        },
        success: function(data){
          $(".json-content,.region_area").empty();
          $.each(data.SearchResult.SearchResultItems, function(key,value){
            var value    = this.MatchedObjectDescriptor,
                title      = value.PositionTitle,
                positionid = value.PositionID,
                uri        = value.PositionURI,
                desc       = value.UserArea.Details.JobSummary,
                org        = value.OrganizationName;
            var $states    = states.join(", ");

              $(".json-content").append("<ul><li>" +
                "<a target='_blank' href='"+ uri +"' data-position-id='" + positionid + "'>" + org + "</a>" +
                "<ul><li><b>Position Title:</b> "+ title +"</li>"+
                "<li><b>Openings within: </b><span class='states'>'" + $states + "'</span></li></ul></ul>"
              ).fadeIn();

            console.log(this);
          });
        }, error: function(){
          $(".json-content").empty();
        }, complete: function(){
          $(".region_area").html('Region '+regionNumber+' Jobs').fadeIn();
          $(".loading").addClass("hidden");
          $('html, body').animate({
            // Grab the offset (position relative to document)
            scrollTop: $(".region_area").offset().top - 150
          }, 'slow');
          var results = $(".json-content ul li").length;
          if( results == 0 ){
            $(".error").removeClass("hidden");
          } else {
            $(".error").addClass("hidden");
          }
        }
      //});
    });
  };

})(jQuery,Drupal);
