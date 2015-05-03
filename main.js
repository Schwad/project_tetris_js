"use strict";

// Add color to piece type.
// Randomly picking a piece.
// Create rest of pieces.

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

    score: 0
  },

  piece: {
    square: function(){
      model.generateNewBlock(5, 21, "square");
      model.generateNewBlock(5, 22, "square");
      model.generateNewBlock(6, 21, "square");
      model.generateNewBlock(6, 22, "square");
      model.newPiece = false;
    },
    bar: function(){
      model.generateNewBlock(5, 21, "bar");
      model.generateNewBlock(5, 22, "bar");
      model.generateNewBlock(5, 23, "bar");
      model.generateNewBlock(5, 24, "bar");
      model.newPiece = false;
    },
    rightL: function(){
      model.generateNewBlock(5, 21, "right-l");
      model.generateNewBlock(6, 21, "right-l");
      model.generateNewBlock(5, 22, "right-l");
      model.generateNewBlock(5, 23, "right-l");
      model.newPiece = false;
    },
    leftL: function(){
      model.generateNewBlock(5, 21, "left-l");
      model.generateNewBlock(6, 21, "left-l");
      model.generateNewBlock(6, 22, "left-l");
      model.generateNewBlock(6, 23, "left-l");
      model.newPiece = false;
    },
    rightS: function(){
      model.generateNewBlock(5, 21, "right-s");
      model.generateNewBlock(6, 21, "right-s");
      model.generateNewBlock(6, 22, "right-s");
      model.generateNewBlock(7, 22, "right-s");
      model.newPiece = false;
    },
    leftS: function(){
      model.generateNewBlock(5, 22, "left-s");
      model.generateNewBlock(6, 21, "left-s");
      model.generateNewBlock(6, 22, "left-s");
      model.generateNewBlock(7, 21, "left-s");
      model.newPiece = false;
    }
  },

  generateNewBlock: function(x, y, type){
    var block = {
      x: x,
      y: y,
      type: type
    };
    model.board.looseBlocks.push(block);
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
    });
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
    model.board.looseBlocks.forEach(function(block){
      var column = block.x;
      model.board.fusedBlocks[column].push(block);
    });
    model.board.looseBlocks = [];
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
        model.board.score++;
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
        } else if (block.y > row){
          block.y--;
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
  },

  addRandomPiece: function (){
    var selector = Math.floor(Math.random()*6)+1;
    if(selector === 1){
      model.piece.square();
    } else if (selector === 2){
      model.piece.bar();
    } else if (selector === 3){
      model.piece.leftL();
    } else if (selector === 4){
      model.piece.rightL();
    } else if (selector === 5){
      model.piece.rightS();
    } else if (selector === 6){
      model.piece.leftS();
    }
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
      $("div[data-y='" + block.y + "'] div[data-x='" + block.x + "']").addClass( 'block' ).addClass( block.type );
    });
  },

  renderFusedBlocks: function(fusedBlocks){
    for(var i = 1; i <= 10; i++){
      view.renderBlocks(fusedBlocks[i]);
    }
  },

  wipeBlocks: function(blocks){
    blocks.forEach(function(block){
      $("div[data-y='" + block.y + "'] div[data-x='" + block.x + "']").removeClass( 'block' ).removeClass( 'square' ).removeClass( 'bar' ).removeClass( 'left-l' ).removeClass( 'right-l' ).removeClass( 'right-s' ).removeClass( 'left-s' );
    });
  },

  wipeFusedBlocks: function(){
    $(".block").removeClass("block");
  },

  renderScore: function(score){
    $("#score").text(score);
  }
};

var controller = {
  init: function(){
    view.init(model.board);
    setInterval(function(){
      if(model.newPiece){
        model.cleanUpRows();
        view.wipeFusedBlocks();
        view.renderFusedBlocks(model.board.fusedBlocks);
        model.addRandomPiece();
      }
      view.renderScore(model.board.score);
      view.wipeBlocks(model.board.looseBlocks);
      model.iterateBlocks();
      view.renderFusedBlocks(model.board.fusedBlocks);
      view.renderBlocks(model.board.looseBlocks);
    }, 600);
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