"use strict";

var documents = {};
var current_document = null;
var serialize_source = "manuscript_v_5";
var background_thread = null;

function format_date (date) {
  // Formats a date as YYYY-MM-DD HH:MM
  // Yes, it's an hack. But it works, so...
  var ISOString = date.toISOString();
  return ISOString.slice(0, 10) + " " + ISOString.slice(11, 16);
}

function generate_UUID(){
  // see http://stackoverflow.com/a/8809472
  var d = new Date().getTime();
  if(window.performance && typeof window.performance.now === "function"){
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

function word_count (text) {
  var words = text.trim().replace(/\s+/gi, ' ').split(' ');
  if (words[0])
    return words.length;
  return 0;
}

function get_title (uuid) {
  var lines = documents[uuid].text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim())
      return lines[i].trim();
  }
  return "(empty document)";
}

function new_document () {
  var uuid = generate_UUID();
  documents[uuid] = {
    text: "",
    created: new Date(),
    updated: new Date()
  };
  serialize_data();
  return uuid;
}

function delete_document (uuid) {
  delete documents[uuid];
  serialize_data();
}

function nuke_storage () {
  documents = {};
  current_document = null;
  localStorage.removeItem(serialize_source);
}

function space_occupied () {
  return (localStorage.getItem(serialize_source) || "").length;
}

function save_current_document () {
  var new_text = $("#document-edit")[0].value;
  if (documents[current_document].text !== new_text) {
    documents[current_document].text = new_text;
    documents[current_document].updated = new Date();
    serialize_data();
  }
}

function background_save () {
  save_current_document();
  $("#word-count").html(word_count($("#document-edit")[0].value));
}

function start_background_save () {
  background_thread = setInterval(background_save, 250);
}

function stop_background_save () {
  clearInterval(background_thread);
}

function serialize_data () {
  localStorage.setItem(serialize_source, JSON.stringify({
    documents: documents,
    current_document: current_document
  }));
}

function deserialize_data () {
  var data = JSON.parse(localStorage.getItem(serialize_source)) || {};
  documents = data.documents || {};
  current_document = data.current_document || null;
  for (var uuid in documents) {
    documents[uuid].created = new Date(documents[uuid].created);
    documents[uuid].updated = new Date(documents[uuid].updated);
  }
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
        current_document = new_document();
        switch_view("document_editor");
      });
      $("#clear-all").on("click", function (e) {
        if (confirm("Do you really want to delete every document from storage?")) {
          nuke_storage();
          views.document_list.render();
        }
      });
    },
    render: function () {
      $("#space-occupied").html(space_occupied());
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
      $("#toggle-preview").on("click", function (e) {
        $("#document-edit").toggle();
        $("#document-preview").html(marked($("#document-edit")[0].value));
        $("#document-preview").toggle();
      });
      $("#close-document").on("click", function (e) {
        save_current_document();
        stop_background_save();
        switch_view("document_list");
      });
    },
    render: function () {
      var text = documents[current_document].text;
      $("#document-edit")[0].value = text;
      $("#document-preview").html(marked(text));
      start_background_save();
    }
  },
  import_export: {
    initialize: function () {
      $("#import").on("click", function (e) {
        if (confirm("Do you really want to import the content of the textarea? This will clobber your current documents.")) {
          var data = JSON.parse($("#raw-data")[0].value) || {};
          documents = data.documents || {};
          current_document = data.current_document || null;
        }
      });
      $("#export").on("click", function (e) {
        $("#raw-data")[0].value = JSON.stringify({
          documents: documents,
          current_document: current_document
        });
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