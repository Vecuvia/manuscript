"use strict";

var documents = {};
var current_document = null;

function serialize_data () {
  //TODO
}

function deserialize_data () {
  //TODO
}

function initialize_document_list () {
  //TODO
}

function render_document_list () {
  //TODO
}

function initialize_document_editor () {
  //TODO
}

function render_document_editor () {
  //TODO
}

function initialize_import_export () {
  //TODO
}

function render_import_export () {
  //TODO
}

function initialize_views () {
  initialize_document_list();
  initialize_document_editor();
  initialize_import_export();
}

window.onLoad = function () {
  initialize_views();
  deserialize_data();
  render_document_list();
};