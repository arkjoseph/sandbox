(function ($, Drupal) {
  Drupal.behaviors.jobs_api = {
    attach: function (context, settings) {
      Drupal.jobs_api.svg_config();
      Drupal.jobs_api.activate_click();
      Drupal.jobs_api.direct_link();

      var states = "";
      var regionStates = "";
      var regionNumber = "";
      var urlRegion = "";
    }
  };

  Drupal.jobs_api.activate_click = function () {

    $('#submit-state').on('click',function (e) {
      e.preventDefault();
      var regionSelected = $('#state-selection').val(),
          selected = Snap.select('g#' + regionSelected);
    });

    // ON SELECT
    var $button = $('#submit-state');
    $button.attr('disabled', 'disabled');

    $('#state-selection').on('change', function () {
      selectValue = $(this).val();
      if (selectValue == 'null') {
        $button.attr('disabled', 'disabled');
      } else {
        $button.removeAttr('disabled');
      }

      var activeRegion = Snap.select('#' + selectValue);
      activeRegion.unhover().animate({
        opacity: 1
      }, 300);

      var push = $('g#' + selectValue);
      for(var i=0; i<1; i++) {
        activeRegion.click();
        Snap.select('#terrioties-'+selectValue).attr({
          opacity: 1
        });
      }
    });
  };

  /*
   * Configure snapSVG
   */
  Drupal.jobs_api.svg_config = function () {
    var s = new Snap('#map-canvas');

    Snap.load('/modules/contrib/jobs_api/js/usaLow.svg', function (response, states,regionNumber) {
      var map = response;
      s.append(map);
      var shadow = s.filter(Snap.filter.shadow(0, 1, 2));
      $.getJSON('/modules/contrib/jobs_api/js/regions.json', function (data) {
        $.each(data.regions, function (i, item) {
          // Marker Position Helpers
          var markerNumberY = item.markerY + 9,
            markerDescriptionY = item.markerY,
            descriptionX = item.markerX + 25,
            regionNumber = item.number;

          //create a group and put all the states in it
          var regionVar = s.group();
          var states = item.states;
          $.each(states, function (state, abbr) {
            regionVar.append(map.select("#US-" + abbr));

          });
          // give the group some attributes and hover effects
          regionVar.attr({
            fill: item.colorOnMap,
            stroke: "white",
            class: 'region',
            id: 'r' + item.number,
            xlink: 'href'
          }).hover(function () {
            this.animate({
              fill: "#eeeadf",
              opacity: "1"
            }, 300);
            //other territories on hover
            if (item.otherTerritory != null) {
              terrs.animate({
                opacity: "1"
              }, 300);
            }
            //states on hover
            stateNames.animate({
              opacity: "1"
            }, 300);
          }, function () {
            this.animate({
              fill: item.colorOnMap,
              opacity: "1"
            }, 300);
            //animate the circle marker
            this.select('#marker-' + item.number).attr({
              fill: '#274b65'
            });
            //other territories on hover
            if (item.otherTerritory != null) {
              terrs.animate({
                opacity: 0
              }, 300);
            }
            // states on hover
            stateNames.animate({
              opacity: 0
            }, 300);
          });

          // REGION on click events
          regionVar.click(function () {

            var allRegions = Snap.selectAll('#r1,#r2,#r3,#r4,#r5,#r6,#r7,#r8,#r9,#r10,#r11');
            allRegions.forEach(function (elem, i) {

              if (elem != '#r' + item.number) {
                elem.unhover().animate({
                  opacity: 0.3
                }, 300);
              }
              if (item.otherTerritory != null && elem != '#terrioties-' + item.number) {
                terrs.animate({
                  opacity: 1
                }, 300);
              }

            });

            stateNames.animate({
              opacity: 1
            }, 300);

            Snap.select('#r' + item.number).unhover().animate({
              opacity: 1,
              fill: item.colorOnMap
            }, 300);

            if ($('.r' + item.number + '-link').length > 0) {
              return false;
            } else {
              //var regionStates = item.stateNames;
              //Drupal.jobs_api.feed(states,regionNumber,regionStates);
              if (item.otherTerritory != null && item.stateNames.length <= 2) {
                var regionStates = item.otherTerritory;
                Drupal.jobs_api.feed(states,regionNumber,regionStates);
              } else if (item.otherTerritory === null && item.stateNames.length > 1) {
                regionStates = item.stateNames;
                Drupal.jobs_api.feed(states,regionNumber,regionStates);
              } else if (item.number == '11'){
                regionStates = item.stateNames + "Washington DC Metro Area";
                Drupal.jobs_api.feed(states,regionNumber,regionStates);
              } else {
                regionStates = item.stateNames + ", " + item.otherTerritory;
                Drupal.jobs_api.feed(states,regionNumber,regionStates);
              }
            }
          });

          // Draw Markers
          var circle = s.circle(item.markerX, item.markerY, 5);
          circle.attr({
            fill: '#274b65',
            'pointer-events': "none",
            filter: shadow,
            stroke: 'none',
            id: 'marker-' + item.number
          }).animate({
            r: 13
          }, (i + 1) * 200);

          var number = s.text(item.markerX, markerNumberY, item.number);

          number.attr({
            fill: '#fff',
            'font-size': '23px',
            'text-anchor': 'middle',
            'font-weight': 'bold',
            'pointer-events': "none",
            opacity: 0,
            stroke: 'none'
          }).animate({
            opacity: 1
          }, (i + 1) * 200);
          var description;
          if (item.number == '2') { // REGION 2 ONLY
            description = s.multitext(descriptionX + 10, markerDescriptionY + 43, item.name);
            var line2 = s.line(descriptionX - 13, markerDescriptionY + 12, descriptionX + 10, markerDescriptionY + 30);
            line2.attr({
              stroke: '#333',
              strokeWidth: 3
            });
          } else if (item.number == '3') { // REGION 3 ONLY
            description = s.multitext(descriptionX + 10, markerDescriptionY + 43, item.name);
            var line2 = s.line(descriptionX - 13, markerDescriptionY + 12, descriptionX + 10, markerDescriptionY + 30);
            line2.attr({
              stroke: '#333',
              strokeWidth: 3
            });
          } else if (item.number == '11') {
            description = s.multitext(descriptionX + 25, markerDescriptionY + 32, 'Central Office &\nNational Capital Region');
            var line11 = s.line(1000, 410, 1030, 427);
            line11.attr({
              stroke: '#333',
              strokeWidth: 3
            });
            var hoverText = s.text(descriptionX + 25, markerDescriptionY + 32);

          } else {
            description = s.multitext(descriptionX, markerDescriptionY, item.name);
          }
          description.click(function () {
            if ($('.r' + item.number + '-link').length > 0) {
              var link = $('.r' + item.number + '-link').text();
              var sanitizedLink = link.replace(/ /g, '');
            }
          });
          description.attr({
            fill: '#333',
            'font-size': '16px',
            'font-weight': '600',
            opacity: 0,
            stroke: 'none',
          }).animate({
            opacity: 1
          }, 2000);
          var markerVar = s.group(circle, number, description);
          regionVar.append(markerVar);

          //States
          var descriptionBox = description.getBBox();
          var stateNames = s.multitext(descriptionBox.x, descriptionBox.y2 + 15, item.stateNames);
          stateNames.attr({
            'pointer-events': "none",
            opacity: 0,
            'font-size': '14px',
            id: 'stateNames-' + item.number
          });

          // terr
          if (item.otherTerritory != null) {
            var stateNamesBox = stateNames.getBBox();
            var terrs;
            if (item.number == 2 || item.number == 3) {
              terrs = s.multitext(stateNamesBox.x2 + 15, stateNamesBox.y + 13, item.otherTerritory);
              terrs.attr({
                'pointer-events': "none",
                'font-size': '14px',
                opacity: 0,
                //fill: '#333',
                id: 'terrioties-r' + item.number
              });
            } else if (item.number == 1) {
              terrs = s.multitext(stateNamesBox.x2 + 15, stateNamesBox.y + 13, item.otherTerritory);
              terrs.attr({
                'pointer-events': "none",
                'font-size': '14px',
                opacity: 0,
                //fill: '#333',
                id: 'terrioties-r' + item.number
              });
            } else {
              terrs = s.multitext(stateNamesBox.x, stateNamesBox.y2 + 15, item.otherTerritory);
              terrs.attr({
                'pointer-events': "none",
                'font-size': '14px',
                opacity: 0,
                //fill: '#333',
                id: 'terrioties-r' + item.number
              });
            }
          }
        });
      });
    });
  };

  Drupal.jobs_api.direct_link = function(urlRegion) {

    var getUrlParameter = function getUrlParameter(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
        }
      }
    };

    var urlRegion = getUrlParameter('region');

    if (window.location.search.indexOf('region=') > -1){
      window.setTimeout(function(){
        Drupal.jobs_api.region_url(urlRegion)
      }, 1500);
    } else {
      return false;
    }
  };

  Drupal.jobs_api.region_url = function(urlRegion){

    var activeRegion = Snap.select('#' + urlRegion);
    activeRegion.unhover().animate({
      opacity: 1
    }, 300);

    var push = $('g#' + urlRegion);
    for (var i = 0; i < 1; i++) {
      activeRegion.click();
      Snap.select('#terrioties-'+urlRegion).attr({
        opacity: 1
      });
    }

  };
})(jQuery,Drupal);