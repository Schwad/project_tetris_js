"use strict";

// have it respond to player moves left and right

// add lateralMove function to model
// have it respond to down arrow

var model = {

  board: {
    gridSize: { height: 20, width: 10 },
    looseBlocks: [],
    fusedBlocks: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: []
    },
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
      if(model.crash(block)){
        fuseLooseBlocks = true;
      }
    });
    if(fuseLooseBlocks){
      model.fuse();
    }
  },

  crash: function(block){
    return (block.y === 1 || model.hasBlockBelow(block));
  },

  hasBlockBelow: function(block){
    var column = block.x;
    var hasBelow = false;
    model.board.fusedBlocks[column].forEach(function(fusedBlock){
      if(fusedBlock.y === block.y - 1){
        hasBelow = true;
      }
    })
    return hasBelow
  },

  fuse: function(){
    for(var i = 0; i < model.board.looseBlocks.length; i++){
      var movingBlock = model.board.looseBlocks.pop();
      var column = movingBlock.x;
      model.board.fusedBlocks[column].push(movingBlock);
    }
    model.needsNewBlock = true;
  },

  needsNewBlock: true
};

var view = {
  //listeners
  init: function(board){
    this.renderBoard(board);
    this.attachArrowListener();
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

  attachArrowListener: function(){
    $( window ).keydown(function(e){
      if(e.which === 37){
        controller.lateralMove("left");
      } else if(e.which === 39){
        controller.lateralMove("right");
      }
    });
  },

  renderBlocks: function(blocks){
    blocks.forEach (function(block){
      $("div[data-y='" + block.y + "'] div[data-x='" + block.x + "']").addClass( 'block' );
    });
  },

  renderFusedBlocks: function(fusedBlocks){
    for(var i = 1; i <= 10; i++){
      this.renderBlocks(fusedBlocks[i]);
    }
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
      }
      view.wipeLooseBlocks(model.board.looseBlocks);
      model.dropLooseBlocks();
      view.renderFusedBlocks(model.board.fusedBlocks);
      view.renderBlocks(model.board.looseBlocks);
    }, 200);
  },

  lateralMove: function(direction){
    view.wipeLooseBlocks(model.board.looseBlocks);
    model.lateralMove(direction);
    view.renderBlocks(model.board.looseBlocks);
  }
};

$( document ).ready(function() {
  controller.init();
});