"use strict";

// have it stop if it hits another block ("fuse")
// have it respond to player moves left and right
// have it respond to down arrow

var model = {

  board: {
    gridSize: { height: 20, width: 10 },
    looseBlocks: [],
    aboutToFuseBlocks: [],
    fusedBlocks: [],
    fuseThisTurn: false
  },

  generateNewBlock: function(){
    var block = {
      x: 5,
      y: 21
    };
    model.board.looseBlocks.push(block);
  },

  dropLooseBlocks: function(){
    var fuseLooseBlocks = false;
    model.board.looseBlocks.forEach( function(block){
      block.y--;
      if(block.y === 1){
        fuseLooseBlocks = true;
      }
    });
    if(fuseLooseBlocks){
      model.queueToFuse();
    };
  },

  queueToFuse: function(){
    for(var i = 0; i < model.board.looseBlocks.length; i++){
        model.board.aboutToFuseBlocks.push(model.board.looseBlocks.pop());
      }
  }
};

var view = {
  //listeners
  init: function(board){
    this.renderBoard(board);
  },

  renderBoard: function(board){
    this.appendRowsToContainer(board.gridSize);
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
  },

  renderBlocks: function(blocks){
    blocks.forEach (function(block){
      $("div[data-y='" + block.y + "'] div[data-x='" + block.x + "']").addClass( 'block' );
    });
  },

  wipeLooseBlocks: function(looseBlocks){
    looseBlocks.forEach (function(block){
      $("div[data-y='" + block.y + "'] div[data-x='" + block.x + "']").removeClass( 'block' );
    });
  },

};

var controller = {
  init: function(){
    view.init(model.board);
    model.generateNewBlock();
    setInterval(function(){
      view.wipeLooseBlocks(model.board.looseBlocks);
      model.dropLooseBlocks();
      view.renderBlocks(model.board.aboutToFuseBlocks);
      view.renderBlocks(model.board.looseBlocks);
    }, 500);
  }
};

$( document ).ready(function() {
  controller.init();
});