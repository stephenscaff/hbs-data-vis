/*jshint -W030*/
/*globals feature: false */
/**
 * Table for City Stats Data and HBS templating
 */
var TableData = (function() {

  var settings = {
    dataSource: 'assets/data/scorecards-data.json',
    hbTemplate: 'assets/templates/scorecards-table.hbs',
    renderEl: '#scorecard-data',
  };

  return {

    /**
     * Init
     */
    init: function() {
      s = settings;
      this.retriveData();
    },

    /**
     * GetJson from data source
     */
    retriveData: function(){
      $.getJSON(s.dataSource, TableData.renderView);
    },

    /**
     * Register HBS Helpers
     * Compile HBS
     */
    renderView: function(data) {
      TableData.compileTemplate(s.hbTemplate, s.renderEl, data);
      // Global Helpers
      hbHelpers.init();
    },

    /**
     * Compile our hbs template
     */
    compileTemplate: function(withTemplate,inElement,withData) {
      TableData.getData(withTemplate, function(template) {
        $(inElement).html(template(withData));
      });
    },

    /**
     * Ajax our data.
     * Run any inits from callback
     */
    getData: function(path, callback) {
      var source, template;
      $.ajax({
        url: path,
        success: function (data) {
          source = data;
          template = Handlebars.compile(source);
          if (callback) callback(template);

          // Init tablefilter
          // @see components/_table-filter.js
          TableFilter.init();
        },
      });
    },
  };
})();

if (document.querySelectorAll('#scorecard-data').length) {
  TableData.init();
}
