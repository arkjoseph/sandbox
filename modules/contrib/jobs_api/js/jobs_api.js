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
        dataType: "json",
        beforeSend: function () {
          $(".loading").removeClass("hidden");
        },
        success: function(data){
          $(".ajax-content,.region_area").empty();
          var locationsOffered = "";
          $.each(data.SearchResult.SearchResultItems, function(key,value){
            var value    = this.MatchedObjectDescriptor,
                title      = value.PositionTitle,
                positionid = value.PositionID,
                uri        = value.PositionURI,
                desc       = value.UserArea.Details.JobSummary,
                org        = value.OrganizationName,
                statesObj  = [];

            $.each(value.PositionLocation, function(key,value){
              var locationsOffered = this.CountrySubDivisionCode;
              if(!statesObj.includes(locationsOffered)) {
                statesObj.push(locationsOffered);
              }
            });

            $(".ajax-content").append("<ul><li>" +
              "<a target='_blank' href='"+ uri +"' data-position-id='" + positionid + "'>" + org + "</a>" +
              "<ul><li><b>Position Title:</b> "+ title +"</li><li><p><b>Job Locations: </b>"+ statesObj.join(", ") +"</p></li></ul>"
            ).fadeIn();

          });
        }, error: function(){
          $(".ajax-content").empty();
        }, complete: function(){
          $(".region_area").html('Region '+regionNumber+' Jobs').fadeIn();
          $(".loading").addClass("hidden");
          $('html, body').animate({
            // Grab the offset (position relative to document)
            scrollTop: $(".region_area").offset().top - 150
          }, 'slow');
          var results = $(".ajax-content ul li").length;
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
