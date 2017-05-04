/**
 * @file
 * Contains js the jobs api json feed.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.jobs_api = {};

  //
  // Main jobs feed ajax get request
  //
  Drupal.jobs_api.feed = function (states) {
    var $authKey      = "bLTvp99I05OBhwJAkVSpRv8QfCp9eN+FRqPi7DoIbT0=",
      $host           = "data.usajobs.gov",
      $userAgent      = "joseph.garrido@gsa.gov",
      $state_array    = states.join(";"),
      $q_location     = $state_array,
      $q_keyword      = "GSA",
      $q_organization = "GS",
      $url_request    = "https://data.usajobs.gov/api/search?Organization='"+$q_organization+"'&LocationName='" + $q_location +"'",
      $clean_url      = $url_request.replace(/'/g,"");

    console.log($clean_url);

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
          $(".json-content").empty();
          $(".error").hide();
          $.each(data.SearchResult.SearchResultItems, function(key,value){
            var value    = this.MatchedObjectDescriptor,
                title      = value.PositionTitle,
                positionid = value.PositionID,
                uri        = value.PositionURI,
                desc       = value.UserArea.Details.JobSummary,
                org        = value.OrganizationName;


              $(".json-content").append("<li>" +
                "<a target='_blank' href='"+ uri +"' data-position-id='" + positionid + "'>" + org + "</a> - <a target='_blank' href='"+ uri +"?PostingChannelID=RESTAPI'>Apply</a>" +
                "<ul><li><b>"+ title +"</b></li>"+
                "<li><div class='states'></div></li></ul>"
              );

            $.each(value.PositionLocation, function(location,name){
              var locations = name.CityName;
             // var combined  = locations.join(",");
              $(".states").append(locations+"<br />");
              //console.log("Located in: '"+combined+"'");
            });

            //console.log(this);
          });
        }, error: function(){

          $(".error").show();
          $(".json-content").empty();
        }, complete: function(){
          var results = $("ul.json-content li").length;
          if( results == 0 ){
            $(".error").show();
          } else {
            $(".error").hide();
          }
        }
      //});
    });
  };

})(jQuery,Drupal);
