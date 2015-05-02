"use strict";

// non-interactive single block falling
// have it stop at the bottom row
// have it stop if it hits another block ("fuse")
// have it respond to player moves left and right
// have it respond to down arrow

var model = {

  board: {
    looseBlocks: [],
    fusedBlocks: []
  }
};

var view = {
  //listeners
  init: function(){
    this.renderBoard();
  },

  renderBoard: function(){
    var gridSize = { height: 20, width: 10 };
    this.appendRowsToContainer(gridSize);
  },

  appendRowsToContainer: function(gridSize){
    for( var y = gridSize.height; y > 0; y--){
      var $row = $("<div />", {
        class: 'row',
        'data-y': y
      });

      $('#container').append($row);
      this.appendCellsToRow($row, gridSize.width);
    }
  },

  appendCellsToRow: function(row, width){
    for( var x = 1; x <= width; x++){
      var $cell = $("<div />", {
        class: 'cell',
        'data-x': x,
        'data-y': row.data('y')
      });
      row.append($cell);
    }
  }
};

var controller = {
  init: function(){
    view.init();
    // Gameloop
  }
};

$( document ).ready(function() {
  controller.init();
});