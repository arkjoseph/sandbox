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
        success: function(data){
          $(".json-content,.region_area").empty();
          $(".error").hide();
          $.each(data.SearchResult.SearchResultItems, function(key,value){
            var value    = this.MatchedObjectDescriptor,
                title      = value.PositionTitle,
                positionid = value.PositionID,
                uri        = value.PositionURI,
                desc       = value.UserArea.Details.JobSummary,
                org        = value.OrganizationName;
            var $states    = states.join(", ");

              $(".json-content").append("<li>" +
                "<b>Department: </b><a target='_blank' href='"+ uri +"' data-position-id='" + positionid + "'>" + org + "</a> - <a target='_blank' href='"+ uri +"?PostingChannelID=RESTAPI'>Apply</a>" +
                "<ul><li><b>Position Title:</b> "+ title +"</li>"+
                "<li><b>Openings within: </b><span class='states'>'" + $states + "'</span></li></ul>"
              ).fadeIn();


            console.log(this);
          });
        }, error: function(){
          $(".error").show();
          $(".json-content").empty();
        }, complete: function(){
          $(".region_area").html('Region '+regionNumber).fadeIn();
          var results = $("ul.json-content li").length;
          if( results == 0 ){
            $(".error").show();
          } else {
            $(".error").hide();
          }
          $('html, body').animate({
            // Grab the offset (position relative to document)
            scrollTop: $("ul.json-content").offset().top
          }, 'slow');
        }
      //});
    });
  };

})(jQuery,Drupal);
