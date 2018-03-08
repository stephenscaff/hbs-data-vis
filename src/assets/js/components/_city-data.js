/**
 * City Data Hbs renderings
 */
var CityData = (function() {


  /**
   * Our Setting object.
   * Sets hbs templates and data source
   */
  var settings = {
    dataSource: 'assets/data/scorecards-data.json',
    hbTemplate: 'assets/templates/scorecards-city.hbs',
    hbSelectTemplate: 'assets/templates/scorecards-city-select.hbs',
    renderEl: '#scorecard-city',
    renderSelect: '#scorecard-city-select-render'
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
     * Retrieve data via getJson
     */
    retriveData: function() {
      $.getJSON(s.dataSource, CityData.renderView);

      $.getJSON(s.dataSource, CityData.renderViewSelect);

      hbHelpers.init();
    },

    /**
     * Render View
     */
    renderView: function(data) {
      CityData.compileTemplate(s.hbTemplate, s.renderEl, data);
    },

    /**
     * Render Selects View
     */
    renderViewSelect: function(data) {
      CityData.compileTemplate(s.hbSelectTemplate, s.renderSelect, data);
    },

    /**
     * Compile hbs template
     */
    compileTemplate: function(withTemplate,inElement,withData) {
      CityData.getData(withTemplate, function(template) {
        $(inElement).html(template(withData));
      });
    },

    /**
     * Get Data
     */
    getData: function(path, callback) {
      var source, template;
      $.ajax({
        url: path,
        success: function (data) {
          source = data;
          template = Handlebars.compile(source);
          if (callback) callback(template);
        },
      });
    },
  };
})();

if (document.querySelectorAll('#scorecard-city').length) {
  CityData.init();
}
