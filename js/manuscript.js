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
      //TODO
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
      //TODO
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
  for (var view in views) {
    $("#" + selector_of(view)).hide();
  }
  //Show current view
  $("#" + selector_of(current_view)).show();
  views[current_view].render();
}

window.onload = function () {
  initialize_views();
  deserialize_data();
  current_view = "document_list";
  render_views();
};