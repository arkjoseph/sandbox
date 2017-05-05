

//$(function() {
//    $('#submit-state').click(function(e) {
//	e.preventDefault();
//        var regionSelected = $('#state-selection').val();
//        window.location.href = '/' + regionSelected;
//    });
//
//});
// SNAP
var states = "";
var regionVar = "";
(function ($, Drupal) {
  var s = new Snap('#map-canvas');

  Snap.load('/modules/contrib/jobs_api/js/usaLow.svg', function (response,states) {
      var map = response;
      s.append(map);
      var shadow = s.filter(Snap.filter.shadow(0, 1, 2));
    $.getJSON('/modules/contrib/jobs_api/js/regions.json', function (data) {
          $.each(data.regions, function (i, item) {
              // Marker Position Helpers
              var markerNumberY = item.markerY + 9,
                  markerDescriptionY = item.markerY,
                  descriptionX = item.markerX + 25;

              //create a group and put all the states in it
              var regionVar = s.group();
              var states = item.states;
              $.each(states, function (state, abbr) {
                  regionVar.append(map.select("#US-"+abbr));

              });
              // give the group some attributes and hover effects
              regionVar.attr({
                  fill: item.colorOnMap,
                  stroke : "white",
                  class : 'region',
                  id :  'r'+item.number
              }).hover(function() {
                  this.animate({
                    fill: "#eeeadf",
                    opacity: "1"
                  },300);
                  //animate the circle marker
                  this.select('#marker-'+item.number).attr({
                      fill: '#ed5155'
                  });
                  //other territories on hover
                  if(item.otherTerritory != null) {
                      terrs.animate({
                          opacity: "1"
                      },300);
                  }
                  //states on hover
                  stateNames.animate({
                      opacity: "1"
                  },300);
              },function() {
                  this.animate({
                      fill: item.colorOnMap,
                      opacity: "1"
                  },300);
                  //animate the circle marker
                  this.select('#marker-'+item.number).attr({
                      fill: '#274b65'
                  });
                  //other territories on hover
                  if(item.otherTerritory != null) {
                      terrs.animate({
                          opacity: 0
                      },300);
                  }
                 // states on hover
                  stateNames.animate({
                      opacity: 0
                  },300);
              });

              // REGION on click events
              regionVar.click(function() {

                var allRegions = Snap.selectAll('#r1,#r2,#r3,#r4,#r5,#r6,#r7,#r8,#r9,#r10,#r11');
                allRegions.forEach( function(elem,i) {

                    if( elem != '#r'+item.number) {
                        elem.unhover().animate({
                          opacity: 0.3
                        }, 300);
                    }
                });

                stateNames.animate({
                  opacity: 1
                },300);

                Snap.select('#r'+item.number).unhover().animate({
                  opacity:1,
                  fill: item.colorOnMap
                },300);

                if($('.r'+item.number+'-link').length > 0) {

                } else {
                  Drupal.jobs_api.feed(states,regionVar);
                }
              });

              // Draw Markers
              var circle = s.circle(item.markerX,item.markerY,5);
              circle.attr({
                  fill: '#274b65',
                  'pointer-events' : "none",
                  filter: shadow,
                  stroke: 'none',
                  id : 'marker-'+item.number
              }).animate({
                  r: 13
              }, (i+1)*200);
              var number = s.text(item.markerX,markerNumberY,item.number)
              number.attr({
                  fill: '#fff',
                  'font-size': '23px',
                  'text-anchor': 'middle',
                  'font-weight': 'bold',
                  'pointer-events' : "none",
                  opacity: 0,
                  stroke: 'none'
              }).animate({
                  opacity: 1
              }, (i+1)*200);
        var description;
        if(item.number == '2') { // REGION 2 ONLY
          description = s.multitext(descriptionX+10,markerDescriptionY+43,item.name);
          var line2 = s.line(descriptionX-13, markerDescriptionY+12, descriptionX+10,markerDescriptionY+30);
          line2.attr({
            stroke: '#333',
            strokeWidth: 3
          });
        } else if(item.number == '3') { // REGION 3 ONLY
          description = s.multitext(descriptionX+10,markerDescriptionY+43,item.name);
          var line2 = s.line(descriptionX-13, markerDescriptionY+12, descriptionX+10,markerDescriptionY+30);
          line2.attr({
            stroke: '#333',
            strokeWidth: 3
          });
        } else {
          description = s.multitext(descriptionX,markerDescriptionY,item.name);
        }
        description.click(function() {
          if($('.r'+item.number+'-link').length > 0) {
              var link = $('.r'+item.number+'-link').text();
              var sanitizedLink = link.replace(/\//g,'?');
              //window.location.href = sanitizedLink;
              //console.log(link);
            } else {
              //window.location.href = 'http://gsa.gov'+item.link;
              console.log(sanitizedLink);
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
              var markerVar = s.group(circle,number,description);
              regionVar.append(markerVar);

              //States
              var descriptionBox = description.getBBox();
              var stateNames = s.multitext(descriptionBox.x, descriptionBox.y2 + 15, item.stateNames);
              stateNames.attr({
                  'pointer-events': "none",
                  opacity: 0,
                  'font-size' : '14px',
                  id: 'stateNames-'+item.number
              });

              // terr
              if (item.otherTerritory != null) {
                  var stateNamesBox = stateNames.getBBox();
                  var terrs;
                  if(item.number == 2 || item.number == 3) {
                      terrs = s.multitext(stateNamesBox.x2 + 15, stateNamesBox.y + 13, item.otherTerritory);
                      terrs.attr({
                          'pointer-events': "none",
          'font-size' : '13px',
                          opacity: 0,
                          fill : '#333',
                          id: 'terrioties-'+item.number
                      });
                  } else if(item.number == 1) {
                      terrs = s.multitext(stateNamesBox.x2 + 15, stateNamesBox.y + 13, item.otherTerritory);
                      terrs.attr({
                          'pointer-events': "none",
          'font-size' : '13px',
                          opacity: 0,
                          fill : '#333',
                          id: 'terrioties-'+item.number
                      });
                  }else {
                      terrs = s.multitext(stateNamesBox.x, stateNamesBox.y2 + 15, item.otherTerritory);
                      terrs.attr({
                          'pointer-events': "none",
                          'font-size' : '13px',
                          opacity: 0,
                          fill : '#333',
                          id: 'terrioties-'+item.number
                      });
                  }
              };


          });
          // REGION 11 ONLY
          var hoverDescription = s.text(1035, 456, 'Washington DC Metro Area');
          hoverDescription.attr({
              'pointer-events': "none",
              opacity: 0,
    'font-size' : '13px',
              fill : '#333'
          });
          var circle11 = s.path("M 985.000 400.000 L 994.405 404.944 L 992.608 394.472 L 1000.217 387.056 L 989.702 385.528 L 985.000 376.000 L 980.298 385.528 L 969.783 387.056 L 977.392 394.472 L 975.595 404.944 L 985.000 400.000");
          circle11.attr({
              fill: '#274b65',
              filter: shadow,
              stroke: 'none',
              id: 'region11'
          });
      circle11.hover(function(){
              this.attr({
                  fill: '#ed5155'
              });
              hoverDescription.attr({
                  opacity: 1
              })
          },function(){
              this.attr({
                  fill: '#274b65'
              });
              hoverDescription.attr({
                  opacity: 0
              })
          });
          var number11 = s.text(985,400,'11')
          number11.attr({
              fill: '#fff',
              'font-size': '18px',
              'text-anchor': 'middle',
              'font-weight': 'bold',
              'pointer-events' : "none",
              opacity: 0,
              stroke: 'none'
          }).animate({
              opacity: 1
          }, 600);
          var description11 = s.multitext(1035,440,'National Capital Region');
          description11.attr({
              fill: '#333',
              'font-size': '16px',
              'font-weight': '600',
              opacity: 0,
              stroke: 'none'
          }).animate({
              opacity: 1
          }, 2000);
          var line11 = s.line(998, 400, 1030,427);
          line11.attr({
              stroke: '#333',
              strokeWidth: 3
          })
          var region11Var = s.group(line11,description11,circle11,number11,hoverDescription);
          region11Var.attr({
              class: 'region',
              id: 'r11'
          });
      region11Var.click(function() {
        if($('.r11-link').length > 0) {
            var link = $('.r11-link').text();
            var sanitizedLink = link.replace(/ /g,'')
            //window.location.href = sanitizedLink;
        } else {
          //window.location.href = '/r11';
        }
      });
      description11.hover(function(){
        var thisRegion = Snap.select('#region11');
        thisRegion.attr({
                  fill: '#ed5155'
              });
              hoverDescription.attr({
                  opacity: 1
              })
          },function(){
      var theRegion = Snap.select('#region11');
              theRegion.attr({
                  fill: '#274b65'
              });
              hoverDescription.attr({
                  opacity: 0
              })
          });
      });

      // ON SELECT
    var $button = $('#submit-state');
    $button.attr('disabled', 'disabled');

      $('#state-selection').on('change', function () {
      selectValue = $(this).val();
      if(selectValue == 'null') {
        $button.attr('disabled', 'disabled');
      } else {
        $button.removeAttr('disabled');
      }

          var allRegions = Snap.selectAll('#r1,#r2,#r3,#r4,#r5,#r6,#r7,#r8,#r9,#r10,#r11');
          allRegions.forEach( function(elem,i) {
              if( elem != '#'+selectValue) {
                  elem.unhover().animate({opacity: 0.3}, 300);
              }
          });

         var activeRegion = Snap.select('#'+selectValue);
          activeRegion.unhover().animate({
              opacity:1,
          },300);
      });
  });
})(jQuery,Drupal);