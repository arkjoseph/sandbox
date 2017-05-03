/**
 * @file
 * Contains js the jobs api json feed.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.jobs_api = {};

  Drupal.behaviors.jobs_api = {
    attach: function (context, settings) {
      Drupal.jobs_api.feed();
      //Drupal.jobs_api.agency();
      }
    };

  //
  // Main jobs feed ajax get request
  //
  Drupal.jobs_api.feed = function () {
    var $authKey      = "bLTvp99I05OBhwJAkVSpRv8QfCp9eN+FRqPi7DoIbT0=",
      $host           = "data.usajobs.gov",
      $userAgent      = "joseph.garrido@gsa.gov",
      $q_location     = "Washington,+DC",
      $q_keyword      = "GSA",
      $q_organization = "GS",
      $url_request    = "https://data.usajobs.gov/api/search?Organization='"+$q_organization+"'&LocationName='" + $q_location +"'",
      $clean_url      = $url_request.replace(/'/g,"");

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
          $.each(data.SearchResult.SearchResultItems, function(key,value){
            var value    = this.MatchedObjectDescriptor,
                title      = value.PositionTitle,
                positionid = value.PositionID,
                uri        = value.PositionURI,
                location   = value.PositionLocationDisplay,
                desc       = value.UserArea.Details.JobSummary,
                org        = value.DepartmentName;

            $(".json-content").append("<li>" +
              "<a target='_blank' href='"+ uri +"' data-position-id='" + positionid + "'>" + title + "</a> &mdash; '"+ location +"' " +
              "<ul>" +
                //"<li><p>"+ desc +"</p></li>" +
              "<li><b>"+ org +"</b><a target='_blank' href='"+ uri +"?PostingChannelID=RESTAPI'><b>Apply</b></a></li></ul>" +
              "</li>"
            );
            console.log(this);
          });
        }
      //});
    });
  };

  //
  // Custom Search - Agency Sub Elements
  //
  Drupal.jobs_api.agency = function () {
    var $authKey = "bLTvp99I05OBhwJAkVSpRv8QfCp9eN+FRqPi7DoIbT0=";
    $.ajax({
      url: "https://data.usajobs.gov/api/codelist/agencysubelements",
      type: "GET",
      headers: {
        "Authorization-Key": $authKey,
        "Content-Type": "application/json"
      },
      dataType: "json",
      success: function(data){
        console.log("success!");
      }
    });
  }
})(jQuery,Drupal);
