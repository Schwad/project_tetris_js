"use strict";
// generate new block when fused
// have it stop if it hits another block ("fuse")
// have it respond to player moves left and right
// have it respond to down arrow

var model = {

  board: {
    gridSize: { height: 20, width: 10 },
    looseBlocks: [],
    fusedBlocks: [],
  },

  generateNewBlock: function(){
    var block = {
      x: 5,
      y: 21
    };
    model.board.looseBlocks.push(block);
    model.needsNewBlock = false;
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
      model.fuse();
    };
  },

  fuse: function(){
    for(var i = 0; i < model.board.looseBlocks.length; i++){
        model.board.fusedBlocks.push(model.board.looseBlocks.pop());
      };
    model.needsNewBlock = true;
  },

  needsNewBlock: true
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
    setInterval(function(){
      if(model.needsNewBlock){
        model.generateNewBlock();
      };
      view.wipeLooseBlocks(model.board.looseBlocks);
      model.dropLooseBlocks();
      view.renderBlocks(model.board.fusedBlocks);
      view.renderBlocks(model.board.looseBlocks);
    }, 500);
  }
};

$( document ).ready(function() {
  controller.init();
});