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
    view.initialize();
  }
}

function render_views () {
  for (var view in views) {
    // hide view
  }
  //Show current view
  views[current_view].render();
}

window.onLoad = function () {
  initialize_views();
  deserialize_data();
  current_view = "document_list";
  render_views();
};