"use strict";


// PART 2: clearing out the row

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
    model.newPiece = false;
  },

  iterateBlocks: function(){
    model.dropLooseBlocks();
    var fuseLooseBlocks = model.haveLooseBlocksCrashed();
    if(fuseLooseBlocks){
      model.fuse();
    }
  },

  dropLooseBlocks: function(){
    model.board.looseBlocks.forEach( function(block){
      block.y--;
    });
  },

  haveLooseBlocksCrashed: function(){
    var haveCrashed = false;
    model.board.looseBlocks.forEach( function(block){
      if(model.crash(block)){
        haveCrashed = true;
      }
    });
    return haveCrashed;
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
    return hasBelow;
  },

  fuse: function(){
    model.board.looseBlocks.forEach(function(block){
      model.rowsToTest.push(block.y);
    });
    model.moveBlocksFromLooseToFused();
    model.newPiece = true;
  },

  newPiece: true,

  rowsToTest: [],

  moveBlocksFromLooseToFused: function(){
    for(var i = 0; i < model.board.looseBlocks.length; i++){
      var movingBlock = model.board.looseBlocks.pop();
      var column = movingBlock.x;
      model.board.fusedBlocks[column].push(movingBlock);
    }
  },

  lateralMove: function(direction){
    if(direction === "left" && !model.atLeftEdge()){
      model.board.looseBlocks.forEach( function(block){
        block.x--;
      });
    } else if (direction === "right" && !model.atRightEdge()){
      model.board.looseBlocks.forEach( function(block){
        block.x++;
      });
    }
  },

  atRightEdge: function(){
    var rightEdge = false;
    model.board.looseBlocks.forEach( function(block){
      if(block.x === 10){
        rightEdge = true;
      }
    });
    return rightEdge;
  },

  atLeftEdge: function(){
    var leftEdge = false;
    model.board.looseBlocks.forEach( function(block){
      if(block.x === 1){
        leftEdge = true;
      }
    });
    return leftEdge;
  },

  forceDown: function(){
    while(!model.haveLooseBlocksCrashed()){
      model.dropLooseBlocks();
    }
    model.fuse();
  },

  cleanUpRows: function(){
    model.rowsToTest.forEach(function(row){
      if(model.isRowComplete(row)){
        model.destroyRowAndDropPiecesAbove(row);
        console.log("BOOM at row " + row);
      }
    });
    model.rowsToTest = [];
  },

  destroyRowAndDropPiecesAbove: function(row){
    for(var column = 1; column <= 10; column++){
      var targetIndex;
      model.board.fusedBlocks[column].forEach(function(block, index){
        if(block.y === row){
          targetIndex = index;
        }
      });
      if(targetIndex !== undefined){
        model.board.fusedBlocks[column].splice(targetIndex,1);
      }
      targetIndex = undefined;
    }
  },

  isRowComplete: function(row){
    var isComplete = true;
    for(var column = 1; column <= 10; column ++){
      if(!model.hasCellAtCoordinates(column, row)){
        isComplete = false;
      }
    }
    return isComplete;
  },

  hasCellAtCoordinates: function(column, row){
    var cellAtCoordinates = false;
    model.board.fusedBlocks[column].forEach(function(block){
      if(block.y === row){
        cellAtCoordinates = true;
      }
    });
    return cellAtCoordinates;
  }
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
      } else if(e.which ===  40){
        controller.forceDown();
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
      view.renderBlocks(fusedBlocks[i]);
    }
  },

  wipeBlocks: function(blocks){
    blocks.forEach (function(block){
      $("div[data-y='" + block.y + "'] div[data-x='" + block.x + "']").removeClass( 'block' );
    });
  },

  wipeFusedBlocks: function(fusedBlocks){
    for(var i = 1; i <= 10; i++){
      view.wipeBlocks(fusedBlocks[i]);
    }
  }
};

var controller = {
  init: function(){
    view.init(model.board);
    setInterval(function(){
      if(model.newPiece){
        model.cleanUpRows();
        view.wipeFusedBlocks(model.board.fusedBlocks);
        // view.renderFusedBlocks(model.board.fusedBlocks);
        model.generateNewBlock();
      }
      view.wipeBlocks(model.board.looseBlocks);
      model.iterateBlocks();
      view.renderFusedBlocks(model.board.fusedBlocks);
      view.renderBlocks(model.board.looseBlocks);
    }, 200);
  },

  lateralMove: function(direction){
    view.wipeBlocks(model.board.looseBlocks);
    model.lateralMove(direction);
    view.renderBlocks(model.board.looseBlocks);
  },

  forceDown: function(){
    view.wipeBlocks(model.board.looseBlocks);
    model.forceDown();
    view.renderBlocks(model.board.looseBlocks);
  }
};

$( document ).ready(function() {
  controller.init();
});