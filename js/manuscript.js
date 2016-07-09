"use strict";

var documents = {};
var current_document = null;

function serialize_data () {
  //TODO
}

function deserialize_data () {
  //TODO
}

var views = {
  document_list: {
    initialize: function () {
      $("#show-about").on("click", function (e) {
        $("#about").toggle();
      });
      $("#import-export").on("click", function (e) {
        switch_view("import_export");
      });
    },
    render: function () {
      //TODO
    }
  },
  document_editor: {
    initialize: function () {
      //TODO
    },
    render: function () {
      //TODO
    }
  },
  import_export: {
    initialize: function () {
      $("import").on("click", function (e) {
        //TODO
      });
      $("export").on("click", function (e) {
        //TODO
      });
      $("go-back").on("click", function (e) {
        switch_view("document_list");
      });
    },
    render: function () {
      //TODO
    }
  }
};
var current_view = null;

function initialize_views () {
  for (var view in views) {
    views[view].initialize();
  }
}

function render_views () {
  function selector_of (view) {
    return view.split("_").join("-") + "-view";
  }
  //Hide all the views
  for (var view in views) {
    $("#" + selector_of(view)).hide();
  }
  //Show and render current view
  $("#" + selector_of(current_view)).show();
  views[current_view].render();
}

function switch_view (view) {
  current_view = view;
  render_views();
}

window.onload = function () {
  initialize_views();
  deserialize_data();
  switch_view("document_list");
};