$(function() {
  var countries = [
    { Name: "", Id: 0 },
    { Name: "Mbape", Id: 1 },
    { Name: "A. K. Raja-1", Id: 2 },
    { Name: "Gas North", Id: 3 },
    { Name: "Africa Gas", Id: 4 },
    { Name: "Clipper Norge", Id: 5 },
    { Name: "Sailer", Id: 6 },
    { Name: "Canizares", Id: 7 }
  ];

  var products = [
    { Name: "", Id: 0 },
    { Name: "Ethane", Id: 1 },
    { Name: "Propane", Id: 2 },
    { Name: "IsoButane", Id: 3 },
    { Name: "Butane", Id: 4 }
  ];

  var SolRiaDateTimeField = function(config) {
    jsGrid.Field.call(this, config);
  };
  SolRiaDateTimeField.prototype = new jsGrid.Field({
    sorter: function(date1, date2) {
      return new Date(date1) - new Date(date2);
    },

    itemTemplate: function(value) {
      if (value === null) {
        return "";
      } else {
        return moment(value).format("L LTS");
      }
    },

    insertTemplate: function(value) {
      this._insertPicker = $("<input>").datetimepicker({
        format: "L",
        defaultDate: moment(),
        widgetPositioning: {
          horizontal: "auto",
          vertical: "bottom"
        }
      });

      this._insertPicker.data("DateTimePicker").date(moment());
      return this._insertPicker;
    },

    editTemplate: function(value) {
      this._editPicker = $("<input>").datetimepicker({
        format: "L",
        widgetPositioning: {
          horizontal: "auto",
          vertical: "bottom"
        }
      });

      if (value !== null) {
        this._editPicker.data("DateTimePicker").defaultDate(moment(value));
        this._editPicker.data("DateTimePicker").date(moment(value));
      }
      return this._editPicker;
    },

    insertValue: function() {
      var insertValue = this._insertPicker.data("DateTimePicker").date();
      if (typeof insertValue !== "undefined" && insertValue !== null) {
        return insertValue.format("L");
      } else {
        return null;
      }
    },

    editValue: function() {
      var editValue = this._editPicker.data("DateTimePicker").date();
      if (typeof editValue !== "undefined" && editValue !== null) {
        return editValue.format("L");
      } else {
        return null;
      }
    }
  });
  jsGrid.fields.myDate = SolRiaDateTimeField;

  $("#jsGrid").jsGrid({
    height: "auto",
    width: "100%",
    filtering: true,
    inserting: true,
    editing: true,
    sorting: true,
    paging: true,
    autoload: true,
    pageSize: 10,
    pageButtonCount: 5,
    deleteConfirm: "Do you really want to delete this trade?",
    controller: {
      loadData: function(filter) {
        return $.ajax({
          type: "GET",
          url: "/trades",
          data: filter
        });
      },
      insertItem: function(item) {
        var d = $.ajax({
          type: "POST",
          url: "/trades",
          data: item
        });
      },
      updateItem: function(item) {
        var d = $.ajax({
          type: "PUT",
          url: "/trades",
          data: item
        });
      },
      deleteItem: function(item) {
        var d = $.ajax({
          type: "DELETE",
          url: "/trades",
          data: item
        });
      }
    },
    fields: [
      { name: "origin_date", type: "myDate", title: "Origin date" },
      {
        name: "vessel_id",
        type: "select",
        title: "Vessel",
        items: countries,
        valueField: "Id",
        textField: "Name"
      },
      { name: "origin_id", type: "text", title: "Origin" },
      { name: "seller", type: "text", title: "Seller" },
      { name: "destination_id", type: "text", title: "Destination" },
      { name: "buyer", type: "text", title: "Buyer" },
      { name: "charterer", type: "text", title: "Charterer" },
      { name: "value", type: "text", title: "Value" },
      {
        name: "product_id",
        type: "select",
        title: "Product",
        items: products,
        valueField: "Id",
        textField: "Name"
      },
      { name: "trade_id", css: "hide", type: "text", title: "Trade Id" },
      { type: "control" }
    ]
  });
});
