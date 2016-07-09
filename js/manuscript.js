"use strict";

var documents = {};
var current_document = null;

var documents = {
  "abcdefhgijklmnopqrstuvwxyz": {
    "text": "Something\nABCDEFGHI",
    "created": new Date(),
    "updated": new Date(),
  }
}

function format_date (date) {
  // Formats a date as YYYY-MM-DD HH:MM
  // Yes, it's an hack. But it works, so...
  var ISOString = date.toISOString();
  return ISOString.slice(0, 10) + " " + ISOString.slice(11, 16);
}

function get_title (uuid) {
  var lines = documents[uuid].text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim())
      return lines[i].trim();
  }
  return "(empty document)";
}

function delete_document(uuid) {
  delete documents[uuid];
  serialize_data();
}

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
      $("#new-document").on("click", function (e) {
        //TODO
      });
    },
    render: function () {
      $("#document-list").html("");
      for (var uuid in documents) {
        var title = $("<td>" + get_title(uuid) + "</td>");
        title.on("click", function(uuid) {
          return function (e) {
            current_document = uuid;
            switch_view("document_editor");
          }
        }(uuid));
        var date = $("<td>" + format_date(documents[uuid].updated) + "</td>");
        var trash = $("<td>Del</td>");
        trash.on("click", function (uuid) {
          return function (e) {
            if (confirm("Do you really want to delete " + get_title(uuid) + "?")) {
              delete_document(uuid);
              views.document_list.render();
            }
          }
        }(uuid));
        var row = $("<tr>")
          .append(title)
          .append(date)
          .append(trash);
        $("#document-list").append(row);
      }
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
      $("#import").on("click", function (e) {
        //TODO
      });
      $("#export").on("click", function (e) {
        //TODO
      });
      $("#go-back").on("click", function (e) {
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