/**
 * Handlebars Helpers for scorecards data
 * @author Stephen Scaff
 */
var hbHelpers = (function() {

  return {

    /**
     * Init
     */
    init: function() {
      this.hbHelpers();
    },

    /**
     * Get param by name helper
     * used in some of the HBS helpers below
     */
    getParameterByName: function(name, url) {
      if (!url) url = window.location.href;

      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
      var results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    /**
     * Our Global HB Helpers
     */
    hbHelpers: function(){

      /**
       * Debug Helper
       * Logs debug info on object context
       */
      Handlebars.registerHelper('debug', function(optionalValue) {
        console.log('Current Context');
        console.log('====================');
        console.log(this);
      });

      /**
       * HBS Index counter
       * @return int (index tra)
       */
      Handlebars.registerHelper('counter', function (index) {
        return index + 1;
      });

      /**
       * City Query Helper
       * Creates a link with our desired index as eul hash
       * @return fn
       */
      Handlebars.registerHelper('cityQuery', function(obj, options) {
        var query = hbHelpers.getParameterByName('index');
        // Offset by 1
        return options.fn(obj[query - 1]);
      });

      /**
       * City Nav Helper
       * Creates a link with our desired index and a loop for first/last cities
       */
      Handlebars.registerHelper('cityNav', function(obj, direction, options) {
        var city,
            objLength = Object.keys(obj).length,
            query = parseInt(hbHelpers.getParameterByName('index'));

        if (direction === 'previous') {
          // If on the first city, get the last city from length minus 1 index of object
          city = query === 1 ? obj[objLength - 1] : city = obj[query - 2];
        } else {
          // If on the last city, get the first city from first index of object
          city = query === objLength ? obj[0] : obj[query];
        }

        return options.fn(city);
      });

      /**
       * City Format
       * Helper to clean up our data, as the
       * US city names include their respective states after a semicolon
       * @return string - formated City name
       */
      Handlebars.registerHelper('cityFormat', function(str) {
        var formatedCity = str.replace(/;/g , ",");
        return new Handlebars.SafeString(formatedCity);
      });

      /**
       * Continent Format
       * Helper to clean up our data, as the Continent
       * names lack a space
       * @return string (formated continent name)
       */
      Handlebars.registerHelper('continentFormat', function(str) {
        var formatedContinent = str.replace(/([A-Z])/g, ' $1').trim();
        return new Handlebars.SafeString(formatedContinent);
      });

       /**
        * FileName Helper
        * Converts fields to a proper filename
        * @return string (filename)
        */
      Handlebars.registerHelper('fileName', function(str) {
        var removedSpaces = str.replace(/\s/g, '');
        var newFileName = encodeURI(removedSpaces.toLowerCase());
        return new Handlebars.SafeString(newFileName);
      });

      /**
       * Counter Helper
       * A simple index offset counter
       */
       Handlebars.registerHelper("indexOffset", function (index){
        return index + 1;
      });

      /**
       * Ordinal Helper
       * Used on Cities's Global rank to apply Ordinals.
       *
       * @return string (ordinal)
       */
      Handlebars.registerHelper('getOrdinal', function(num) {
        var ordinal = ['th', 'st', 'nd', 'rd'];
        var remainder = num % 100;
        return new Handlebars.SafeString(num + (ordinal[(remainder - 20) % 10] || ordinal[remainder] || ordinal[0]));
      });

      /**
       * Trim Helper
       * Used on Cities's Pie Chart for remove % from data.
       *
       * @return string (ordinal)
       */
      Handlebars.registerHelper('trimPercent', function(num) {
        num = num.slice(0, -1);
        return new Handlebars.SafeString(num);
      });

      /**
       * UpDown Helper
       * Used on Cities's Global rank to apply Ordinals.
       *
       * @return string ($val)
       */
      Handlebars.registerHelper('upDown', function(str, field) {

        var up =   '<span class="color-red"><i class="icon-up-chev"></i>' + ' ' + field + '</span>';
        var down = '<span class="color-green"><i class="icon-down-chev"></i>' + ' ' + field + '</span>';
        var same = '<span class="color-green"><i class="icon-minus"></i>' + ' ' + field + '</span>';

        // If str is pos, the same, or neg
        if (parseInt(str) > 0) {
          $val = new Handlebars.SafeString(up);
        } else if (parseInt(str) === 0) {
          $val = new Handlebars.SafeString(same);
        } else{
          $val = new Handlebars.SafeString(down);
        }
        return $val;
      });
    }
  };
})();

hbHelpers.init();
