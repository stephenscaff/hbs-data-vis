/**
 * Table Filter
 *
 * Logic for Scorecards table filtering, searching and sorting.
 * Uses 2 dependencies - select2 and tinysort.js
 *
 * @see js/components/_tinyfilter.js (@link http://tinysort.sjeiti.com)
 * @see scss/components/_scorecard-table.scss
 * @see templates/_scorecard-table.hbs
 */
var TableFilter = (function() {
  var _input;

  /**
   * Global Settings
   */
  var settings = {
    dataTable: 'data-table',
    scorecardTable: document.getElementById('js-table'),
    selectFilter: $('.js-select'),
    filterInputs: document.getElementsByClassName('js-filtered-search'),
  };

  /**
   * On input event.
   * Runs through our table elements
   * Should maybe update to only parse actual columns
   */
  var _onInputEvent = function(e) {
    _input = e.target;
    var tables = document.getElementsByClassName(_input.getAttribute(settings.dataTable));

    // Remove Top25 Class
    TableFilter.removeTop25();

    /**
     * Yes, a bit gross....
     */
    [].forEach.call(tables, function(table) {
      [].forEach.call(table.tBodies, function(tbody) {
        [].forEach.call(tbody.rows, _filter);
      });
    });
  };

  /**
   * Perform the Search Input filtering
   */
  var _filter = function(e) {
    var text = e.textContent.toLowerCase(),
    val = _input.value.toLowerCase();

    e.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
  };

  return {

    /**
     * Init Let's Go
     */
    init: function() {
      this.bind();
    },

    /**
     * Bind Events
     */
    bind: function(){
      [].forEach.call(settings.filterInputs, function(e) {
        e.oninput = _onInputEvent;
      });

      // Filter From Select Method
      TableFilter.onSelectEvent();

      // Sort Columns
      TableFilter.sortColumns();

      // Hide Empty Cities for INRIX rank
      TableFilter.hideEmptyCities();
    },

    /**
     * onSelectEvent
     *
     * Uses Select2 selects to perform filtering.
     * Had to jq has select2 custom events rely on the $/Jquery object.
     * Add doesn't respond to on change or other native select events.
     * And, i'm out of time here honestly...
     */
    onSelectEvent: function() {
      var selectFilter = $('.js-select');
      var dataset = $('#js-table tbody').find('tr');

      // Select 2 method for on change
      selectFilter.on('select2:select', function(e) {
        var select_val = e.target.value;

        selectFilter.not(this).hide();

        //selectFilter.not(this).val([]);
        selectFilter.not(this).val([]).trigger('change');

        TableFilter.removeTop25();

        // Filter our td element in the tbody
        dataset.show().filter(function(index){
          return $('td:eq(0)', this).html().indexOf(select_val) === -1;
        }).hide();

        $(this).on('select2:unselecting', function (e) {
          dataset.show();
        });
      });
    },

    /**
     * Sort Columns
     * Used tinyfilter as a dependency
     * @see js/components/_tinysort.js
     */
    sortColumns: function(){

      var table = document.getElementById('js-table'),
          tableHead = table.querySelector('thead'),
          tableHeaders = tableHead.querySelectorAll('th'),
          tableBody = table.querySelector('tbody'),
          tableRow = tableBody.querySelectorAll('tr');

      /**
       * Table head click event
       */
      tableHead.addEventListener('click', function(e) {
        var tableHeader = e.target,
            textContent = tableHeader.textContent,
            tableHeaderIndex,isAscending,order;

        while (tableHeader.nodeName !== 'TH') {
          tableHeader = tableHeader.parentNode;
        }

        tableHeaderIndex = Array.prototype.indexOf.call(tableHeaders, tableHeader);
        isAscending = tableHeader.getAttribute('data-order') === 'asc';
        order = isAscending ? 'desc' : 'asc';
        tableHeader.setAttribute('data-order', order);

        var currentIdx = 0,
            prevIdx = currentIdx;

        // Remove Top25 Class
        TableFilter.removeTop25();

        /**
         * Changes last clicked item back to asc
         */
        [].forEach.call(tableHeaders, function(header, idx) {
          header.addEventListener('click', function() {
            prevIdx = currentIdx;
            currentIdx = idx;
            if (prevIdx !== currentIdx) {
              tableHeaders[prevIdx].dataset.order = 'asc';
            }
          });
        });

        /**
         * Init tinySort with our stuffs
         * Uses data-sort attribute
         * Sorts by natural order
         */
        tinysort(tableRow, {
          selector:'td[data-sort]:nth-child('+(tableHeaderIndex+1)+')',
          order: order,
          natural:true,
          data:true,
          attr:'data-sort'
        });
      });
    },

    /**
     * Remove Top 25
     * We're loading wiht only the top 25 via main_rank_25
     * To do so, add 'is-top25' class and hide via css
     * In order to only get main rank, we add it as a value to the tr
     * and if 0, we hide that too via css.
     *
     * @see scss/components/_scorecard-table.scss
     */
    removeTop25: function() {
      var scorecardTable = document.getElementById('js-table');
      scorecardTable.classList.remove('is-top25');
    },

    /**
     * Hide Empty Cities
     */
    hideEmptyCities: function() {
      var tableHeaders = document.getElementsByTagName('th');
      var scorecardTable = document.getElementById('js-table');

      [].forEach.call(tableHeaders, function(header, idx) {
        header.addEventListener('click', function() {
          if (idx === 2) {
            scorecardTable.classList.add('is-hiding');
          } else {
            scorecardTable.classList.remove('is-hiding');
          }
        });
      });
    }
  };
})();
