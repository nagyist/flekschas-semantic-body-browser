angular
  .module( 'sbb.home' )
  .directive( 'horizontalSlider', ['$', 'news',
  function($, news) {
    // Horizontal Slider for the search results
    return {
      restrict: 'AE',
      transclude: true,
      templateUrl: 'home/directives/horizontalSlider.html',
      scope: {
        data: '=',
        numVisibleItems: '@'
      },
      link: function (scope, element, attrs) {
        var $el = $(element),
            hSlider = {
              'currentPos'    : 1,
              'numEntries'    : 0,
              'totalWidth'    : 0,
              'itemWidth'     : 0,
              'button'        : $el.find('div.button'),
              'ul'            : $el.find('ul'),
              'disabled'      : true
            };

        // Give 'margin-left' a value
        hSlider.ul.css('margin-left', '0%');

        news.setSliderWidth($el.width());

        scope.$on('sliderHeight', function(e, h) {
          hSlider.button.css('line-height', h + 'px');
        });

        // Watch for the number of search results and adjust the container
        // widths accordingly
        scope.$watch(function() {
            return scope.data;
        }, function(data) {
            if (typeof data === 'object') {
              // Update properties
              hSlider.numEntries = 0;
              for (var prop in data) {
                  if (data.hasOwnProperty(prop)) {
                      ++hSlider.numEntries;
                  }
              }

              scope.$on('ngRepeatFinished', function() {
                hSlider.li = $el.find('li');

                // Set UL width to ceil(number of items / numVisibleItems)
                // Set LI width to UL-Width / numVisibleItems
                if (hSlider.numEntries > scope.numVisibleItems) {
                    hSlider.button.removeClass('disabled');
                    hSlider.disabled = false;
                    hSlider
                      .ul
                      .css(
                        'width',
                        ((hSlider.numEntries /
                           scope.numVisibleItems) * 100) + '%'
                      );
                    hSlider.li.css('width', (100 / hSlider.numEntries) + '%');
                } else {
                    hSlider.button.addClass('disabled');
                    hSlider.disabled = true;
                    hSlider.ul.css('width', '100%');
                    hSlider.li.css('width', (100 / scope.numVisibleItems) + '%');
                }

                hSlider.itemWidth = (100 / scope.numVisibleItems);
                hSlider.totalWidth = hSlider.itemWidth * hSlider.numEntries;

                // Reset position
                hSlider.currentPos = 1;
                hSlider.transition(0, 0);
              });
            }
          }
        );

        scope.scroll = function(dir) {
          if (hSlider.disabled || hSlider.currentPos === 0) {
            return;
          }

          var loc = hSlider.itemWidth;

          if (dir === 'next') {
            ++hSlider.currentPos;
          } else {
            --hSlider.currentPos;
          }

          if ( hSlider.currentPos === 0 ) {
            hSlider.currentPos = hSlider.numEntries;
            loc = hSlider.totalWidth - hSlider.itemWidth;
            dir = 'next';
          } else if ( hSlider.currentPos - 1 === hSlider.numEntries ) {
            hSlider.currentPos = 1;
            loc = 0;
          }

          hSlider.transition( loc, dir );
        };

        hSlider.transition = function(loc, dir) {
          var newMargin; // -= +=

          if ( dir && loc !== 0 ) {
            newMargin = (hSlider.currentPos -1) * hSlider.itemWidth;
          } else {
            newMargin = loc;
          }

          hSlider.ul.css('margin-left', '-' + newMargin + '%');
        };
      }
    };
  }
]);
