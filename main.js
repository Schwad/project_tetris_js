"use strict";

var model = {
  //data

}

var view = {
  //listeners
  init: function(){

  },

  renderBoard: function(){
    $("#container").append("waka waka"),//WHERE WE LEFT OFF
  }

}


var controller = {
  init: function(){
    view.init();
  }
}

$( document ).ready(function() {
  controller.init();

});