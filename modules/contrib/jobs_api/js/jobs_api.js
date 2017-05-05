/**
 * @file
 * Contains js the jobs api json feed.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.jobs_api = {};
  Drupal.behaviors.jobs_api = {
    attach: function (context, settings) {
      //Drupal.jobs_api.focusTarget(regionVar);
    }
  };

  /**
   * Get URL parameter
   *
   * @assume properly encoded URL parameters
   * @param parameter
   * @return the value of parameter or false of not found
   */
  Drupal.jobs_api.url_param = function(parameter){
    // Params, with ? trimmed off; doesn't pickup hash at end (if any)
    var searchString = window.location.search.substring(1);

    var params = searchString.split("&"); // params must be properly encoded

    for (var i = params.length - 1; i >= 0; i--) {

      var keyValuePair = params[i].split("=");

      if(keyValuePair[0] === parameter){ // ==
        return keyValuePair[1];
      }
    }
    return false;
  };

  /**
   * Ease to target
   */
  Drupal.jobs_api.easeToTarget = function(target, callback){

    callback = typeof callback !== "undefined" ? callback : null;

    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1050, "easeInOutCubic", callback);
    }
    return false;
  };


  /**
   * Scroll to and focus target content.
   *
   * Tab panes implemented. Implement others as needed.
   */
  Drupal.jobs_api.focusTarget = function(target, callback,regionVar){

    // Target
    var target = Drupal.jobs_api.url_param("section");

    if(!target){
      return false;
    }
    //$("#tabs li a").each(function(index, element){
    var link = $(".form-search");
    $(link).once("init").each(function(index, element){ // Play nice with ajax so use .once()
      var open = $(this).data("drupal-selector");

      if(open.substring(0) === target){
        console.log("true: "+open.substring(0));

        Drupal.jobs_api.feed(function(){
          //regionVar.trigger("click");
        });

      } else {
        console.log("false: '"+open.substring(0));
      }
    });
  };

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

    //console.log(regionVar);

    //$(".json-content").once(function (){
      $.ajax({
        url: $clean_url,
        type: "GET",
        headers: {
          "Authorization-Key": $authKey,
          "Content-Type": "application/json"
        },
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
          $('html, body').animate({
            // Grab the offset (position relative to document)
            scrollTop: $("ul.json-content").offset().top
          }, 'slow');
        }
      //});
    });
  };

})(jQuery,Drupal);
