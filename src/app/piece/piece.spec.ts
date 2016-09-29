/* tslint:disable:no-unused-variable */
///<reference path="../../../node_modules/@types/jasmine/index.d.ts" />

import { async, inject } from '@angular/core/testing';
import { Piece, King, Pawn, Knight, Bishop, Rook, Queen } from './piece';
import { Color, Rank, sqAdd, sqEqual, sqArrInSqArr } from '../chess.util';
import { Board } from '../board/board';

describe('King', () => {

	let testboard: Board;

	beforeEach(function() {
	  testboard = new Board();
  /*
    0  1  2  3  4  5  6  7 
  0 bR -- -- -- bK -- -- bR
  1 -- -- -- -- -- -- -- --
  2 -- -- -- -- -- -- -- --
  3 -- -- -- -- -- -- -- --
  4 -- -- -- -- -- -- -- --
  5 -- -- -- -- -- -- -- --
  6 -- -- -- -- -- -- -- --
  7 wR -- -- -- wK -- -- wR
  */
    let bK = new King(Color.Black);
    let wK = new King(Color.White);
    testboard.addPiece(bK, [0, 4]);
    testboard.addPiece(wK, [7, 4]);
    testboard.addPiece(new Rook(Color.Black), [0, 0]);
    testboard.addPiece(new Rook(Color.Black), [0, 7]);
    testboard.addPiece(new Rook(Color.White), [7, 0]);
    testboard.addPiece(new Rook(Color.White), [7, 7]);
	});

  it('should be able to preform castling either side, regardless', () => {
  	let wK = testboard.getPiece([7, 4]);
  	let bK = testboard.getPiece([0, 4]);
    wK.findPossibleMoves(testboard);
    bK.findPossibleMoves(testboard);
    expect(sqArrInSqArr(bK.possibleMoves, [[0,2],[0,6]])).toBeTruthy();
    expect(sqArrInSqArr(wK.possibleMoves, [[7,2],[7,6]])).toBeTruthy();
  });

  //it()

  it('should not be able to preform castling through check', () => {
  	//saving this for later - to be resolved in BoardService tests - pieces should only calculate possible moves regardless of check
  });

  it('should not be able to preform castling when King OR Rook has moved', () => {
 		let wK = testboard.getPiece([7, 4]);
  	let bK = testboard.getPiece([0, 4]);
  	testboard.movePiece(wK, [7, 5]);
  	testboard.movePiece(wK, [7, 4]);
    wK.findPossibleMoves(testboard);
    bK.findPossibleMoves(testboard);
    expect(sqArrInSqArr(wK.possibleMoves, [[7,2],[7,6]])).toBeFalsy();
  });

  it('should not be able to preform castling when King ends up in check', () => {
  	//saving this for later - to be resolved in BoardService tests - pieces should only calculate possible moves regardless of check
  });
});

describe('Pawn', () => {
  	this.board = new Board();
  	/*
  	 0  1  2  3  4  5  6  7 
	0 -- -- -- -- -- -- -- --
	1 -- -- -- -- -- -- -- --
	2 wP wP -- -- -- -- -- --
	3 wK -- bK -- -- -- -- --
	4 -- bP -- -- bP -- bP --
	5 -- -- wP -- -- -- -- --
	6 -- -- -- -- -- wP -- --
	7 -- -- -- -- -- -- -- --
	Moves 6,5 --> 4,5
  	*/
  	let bp0 = new Pawn(Color.Black);
  	this.board.addPiece(new King(Color.White), [3,0]);
  	this.board.addPiece(new Pawn(Color.White), [2,0]);
  	this.board.addPiece(new Pawn(Color.White), [2,1]);
  	this.board.addPiece(new Pawn(Color.White), [5,2]);
  	this.board.addPiece(new King(Color.Black), [3,2]);
  	this.board.addPiece(bp0, [4,1]);

  	let six_five: [number, number] = [6,5];
  	let bp1 = new Pawn(Color.Black);
  	let bp2 = new Pawn(Color.Black);

  	this.board.addPiece(new Pawn(Color.White), six_five);
  	this.board.addPiece(bp1, [4,6]);
  	this.board.addPiece(bp2, [4,4]);
  	it('should be able to move and capture diagonally', () => {
  		this.board.movePiece(bp0, bp0.pos); //moving to same position to register a movement
  		bp0.findPossibleMoves(this.board);
	  	expect(bp0.possibleMoves.find((pos) => { return sqEqual(pos, [5, 2]); })).toBeTruthy();
	  	expect(bp0.possibleMoves.find((pos) => { return sqEqual(pos, [5, 1]); })).toBeTruthy();
	  	expect(bp0.possibleMoves.length).toEqual(2);
  	});

  	it('should be able to move one or two spaces at the start', () => {
	  	let wp_six_five = this.board.getPiece(six_five);
	  	wp_six_five.findPossibleMoves(this.board);
	  	expect(wp_six_five.possibleMoves.length).toEqual(2);
	  	expect(wp_six_five.possibleMoves.find((pos) => { return sqEqual(pos, [5, 5]); })).toBeTruthy();
	  	expect(wp_six_five.possibleMoves.find((pos) => { return sqEqual(pos, [4, 5]); })).toBeTruthy();

  	});

  	//checking enPassent
  	it('should be able to perform enPassent', () => {
	  	this.board.movePiece(this.board.getPiece(six_five), [4, 5]);
	  	expect(this.board.getPiece([4, 5])).toBeTruthy();
	  	bp1.findPossibleMoves(this.board);
	  	bp2.findPossibleMoves(this.board);
	  	expect(bp1.possibleMoves.find((pos) => { return sqEqual(pos, [5, 5]); })).toBeTruthy();
	  	expect(bp2.possibleMoves.find((pos) => { return sqEqual(pos, [5, 5]); })).toBeTruthy();
      //assuming that pawn moves to same place again...sqEqual
      this.board.movePiece(this.board.getPiece([4, 5]), [4, 5]);
      bp1.findPossibleMoves(this.board);
      bp2.findPossibleMoves(this.board);
      expect(bp1.possibleMoves.find((pos) => { return sqEqual(pos, [5, 5]); })).toBeFalsy();
      expect(bp2.possibleMoves.find((pos) => { return sqEqual(pos, [5, 5]); })).toBeFalsy();
  	});

});


describe('Knight', () => {
  var testboard: Board;
  beforeEach(function() {
  	testboard = new Board();
  	/*
  	0  1  2  3  4  5  6  7 
	0 -- -- -- bP -- -- -- --
	1 -- wN -- -- -- -- -- --
	2 -- -- -- -- -- -- -- --
	3 wN -- -- -- -- -- -- --
	4 -- -- -- -- bN -- -- --
	5 -- -- -- -- -- -- -- --
	6 -- -- -- -- -- -- -- --
	7 -- -- -- -- -- -- -- --
  	*/
  	let four_four:[number, number] = [4, 4];
  	let five_two:[number, number] = [5, 2];
  	let three_two:[number, number] = [3, 2];
  	let six_three:[number, number] = [6, 3];
  	let two_three:[number, number] = [2, 3];
  	let two_five:[number, number] = [3, 6];
  	let five_six:[number, number] = [5, 6];
  	let six_five:[number, number] = [6, 5];
    
    testboard.addPiece(new Pawn(Color.White), [3, 0]);
    testboard.addPiece(new Pawn(Color.Black), [0, 3]);
    let blackTestKnight: Knight = new Knight(Color.Black);
    let whiteTestKnight: Knight = new Knight(Color.White);
  	testboard.addPiece(blackTestKnight,four_four);
    testboard.addPiece(whiteTestKnight, [1, 1]);

    blackTestKnight.findPossibleMoves(testboard);
    whiteTestKnight.findPossibleMoves(testboard);
  });

  it('should create an instance', () => {
    expect(new Knight(Color.Black)).toBeTruthy();
  });

  it('should move in L shape patterns', () => {
    let bN = testboard.getPiece([4, 4]);
    expect(bN.possibleMoves.find((pos) => { return sqEqual(pos, [5, 2]); })).toBeTruthy();
    expect(bN.possibleMoves.find((pos) => { return sqEqual(pos, [3, 2]); })).toBeTruthy();
    expect(bN.possibleMoves.find((pos) => { return sqEqual(pos, [2, 3]); })).toBeTruthy();
    expect(bN.possibleMoves.find((pos) => { return sqEqual(pos, [2, 5]); })).toBeTruthy();
    expect(bN.possibleMoves.find((pos) => { return sqEqual(pos, [3, 6]); })).toBeTruthy();
    expect(bN.possibleMoves.find((pos) => { return sqEqual(pos, [5, 6]); })).toBeTruthy();
    expect(bN.possibleMoves.find((pos) => { return sqEqual(pos, [6, 5]); })).toBeTruthy();
    expect(bN.possibleMoves.find((pos) => { return sqEqual(pos, [6, 3]); })).toBeTruthy();
    expect(bN.possibleMoves.length).toEqual(8);
  });

  it('should not move out of bounds or move on friendly piece', () => {
    let wN = testboard.getPiece([1, 1]);
    expect(wN.possibleMoves.find((pos) => { return sqEqual(pos, [3, 2]); })).toBeTruthy();
    expect(wN.possibleMoves.find((pos) => { return sqEqual(pos, [2, 3]); })).toBeTruthy();
    expect(wN.possibleMoves.find((pos) => { return sqEqual(pos, [0, 3]); })).toBeTruthy();
    expect(wN.possibleMoves.length).toEqual(3);
  });
});

describe('Bishop', () => {
  var testboard: Board;
  beforeEach(function() {
    testboard = new Board();
    /*
    0  1  2  3  4  5  6  7 
  0 -- -- -- -- -- -- -- --
  1 -- -- -- -- -- -- -- --
  2 -- -- wB -- -- -- bN --
  3 -- -- -- -- -- -- -- --
  4 -- -- -- -- bB wP -- --
  5 -- -- -- -- wP -- wP --
  6 -- -- -- -- -- wP -- --
  7 -- -- -- -- -- -- -- wK
    */
    let bB = new Bishop(Color.Black);
    let wB = new Bishop(Color.White);
    testboard.addPiece(bB, [4, 4]);
    testboard.addPiece(wB,[2, 2]);
    testboard.addPiece(new Pawn(Color.White), [6, 5]);
    testboard.addPiece(new Pawn(Color.White), [5, 6]);
    testboard.addPiece(new Pawn(Color.White), [5, 4]);
    testboard.addPiece(new Pawn(Color.White), [4, 5]);
    testboard.addPiece(new King(Color.White), [6, 5]);
    testboard.addPiece(new Knight(Color.Black), [2, 6]);
  });
  it('should be able to move diagonally only', () => {
    let wB = testboard.getPiece([2, 2]);
    wB.findPossibleMoves(testboard);
    expect(wB.possibleMoves.length).toEqual(8);
    expect(wB.possibleMoves.find((pos) => { return sqEqual(pos, [0, 0]); })).toBeTruthy(); //NW
    expect(wB.possibleMoves.find((pos) => { return sqEqual(pos, [1, 1]); })).toBeTruthy(); //NW
    expect(wB.possibleMoves.find((pos) => { return sqEqual(pos, [3, 1]); })).toBeTruthy(); //SW
    expect(wB.possibleMoves.find((pos) => { return sqEqual(pos, [4, 0]); })).toBeTruthy(); //SW
    expect(wB.possibleMoves.find((pos) => { return sqEqual(pos, [1, 3]); })).toBeTruthy(); //NE
    expect(wB.possibleMoves.find((pos) => { return sqEqual(pos, [0, 4]); })).toBeTruthy(); //NE
    expect(wB.possibleMoves.find((pos) => { return sqEqual(pos, [3, 3]); })).toBeTruthy(); //SE
    expect(wB.possibleMoves.find((pos) => { return sqEqual(pos, [4, 4]); })).toBeTruthy(); //SE
  });

  it('should be able to move diagonally between pieces, stop at friendly piece', () => {
    let bB = testboard.getPiece([4, 4]);
    bB.findPossibleMoves(testboard);
    expect(bB.possibleMoves.length).toEqual(9);
    expect(bB.possibleMoves.find((pos) => { return sqEqual(pos, [3, 3]); })).toBeTruthy(); //NW
    expect(bB.possibleMoves.find((pos) => { return sqEqual(pos, [2, 2]); })).toBeTruthy(); //NW
    expect(bB.possibleMoves.find((pos) => { return sqEqual(pos, [3, 5]); })).toBeTruthy(); //NE
    expect(bB.possibleMoves.find((pos) => { return sqEqual(pos, [5, 5]); })).toBeTruthy(); //SE
    expect(bB.possibleMoves.find((pos) => { return sqEqual(pos, [6, 6]); })).toBeTruthy(); //SE
    expect(bB.possibleMoves.find((pos) => { return sqEqual(pos, [7, 7]); })).toBeTruthy(); //SE
    expect(bB.possibleMoves.find((pos) => { return sqEqual(pos, [5, 3]); })).toBeTruthy(); //SW
    expect(bB.possibleMoves.find((pos) => { return sqEqual(pos, [6, 2]); })).toBeTruthy(); //SW
    expect(bB.possibleMoves.find((pos) => { return sqEqual(pos, [7, 1]); })).toBeTruthy(); //SW
  });
});

describe('Rook', () => {
  var testboard: Board;
  beforeEach(function() {
    testboard = new Board();
    /*
    0  1  2  3  4  5  6  7 
  0 -- -- -- -- -- -- -- --
  1 -- -- -- wB -- -- -- --
  2 -- wB -- -- -- -- -- --
  3 -- -- -- -- -- -- -- --
  4 -- -- -- -- -- -- -- --
  5 -- wR -- bR -- -- -- --
  6 -- -- -- -- -- -- -- --
  7 -- -- -- -- -- -- -- --
    */
    let bR = new Rook(Color.Black);
    let wR = new Rook(Color.White);
    testboard.addPiece(bR, [5, 3]);
    testboard.addPiece(wR,[5, 1]);
    testboard.addPiece(new Bishop(Color.White), [2, 1]);
    testboard.addPiece(new Bishop(Color.White), [1, 3]);
  });
  it('should be able to move in lateral directions, capture pieces', () => {
    let bR = testboard.getPiece([5, 3]);
    bR.findPossibleMoves(testboard);
    expect(bR.possibleMoves.length).toEqual(12);
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [5, 1]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [5, 2]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [4, 3]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [3, 3]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [2, 3]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [1, 3]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [5, 4]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [5, 5]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [5, 6]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [5, 7]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [6, 3]); })).toBeTruthy();
    expect(bR.possibleMoves.find((pos) => { return sqEqual(pos, [7, 3]); })).toBeTruthy();
  });
  it('should not capture same color pieces, move laterally', () => {
    let wR = testboard.getPiece([5, 1]);
    wR.findPossibleMoves(testboard);
    expect(wR.possibleMoves.length).toEqual(7);
    expect(wR.possibleMoves.find((pos) => { return sqEqual(pos, [5, 0]); })).toBeTruthy();
    expect(wR.possibleMoves.find((pos) => { return sqEqual(pos, [5, 2]); })).toBeTruthy();
    expect(wR.possibleMoves.find((pos) => { return sqEqual(pos, [5, 3]); })).toBeTruthy();
    expect(wR.possibleMoves.find((pos) => { return sqEqual(pos, [3, 1]); })).toBeTruthy();
    expect(wR.possibleMoves.find((pos) => { return sqEqual(pos, [4, 1]); })).toBeTruthy();
    expect(wR.possibleMoves.find((pos) => { return sqEqual(pos, [6, 1]); })).toBeTruthy();
    expect(wR.possibleMoves.find((pos) => { return sqEqual(pos, [7, 1]); })).toBeTruthy();
  });
});

describe('Queen', () => {
  var testboard: Board;
  beforeEach(function() {
    testboard = new Board();
    /*
    0  1  2  3  4  5  6  7 
  0 -- -- -- -- -- -- -- --
  1 -- bR -- wB -- -- -- --
  2 -- wB -- -- -- -- -- --
  3 -- -- -- -- -- -- -- --
  4 -- -- -- -- -- -- -- --
  5 -- wQ -- bQ -- -- -- --
  6 -- -- wR -- -- -- -- --
  7 -- -- -- -- -- -- -- --
    */
    let bR = new Queen(Color.Black);
    let wR = new Queen(Color.White);
    testboard.addPiece(bR, [5, 3]);
    testboard.addPiece(wR,[5, 1]);
    testboard.addPiece(new Bishop(Color.White), [2, 1]);
    testboard.addPiece(new Bishop(Color.White), [1, 3]);
    testboard.addPiece(new Rook(Color.White), [6, 2]);
    testboard.addPiece(new Rook(Color.Black), [1, 1]);
  });
  it('should not capture same pieces, move diagonally and laterally', () => {
    let wQ = testboard.getPiece([5, 1]);
    wQ.findPossibleMoves(testboard);
    expect(wQ.possibleMoves.length).toEqual(14);
    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [5, 0]); })).toBeTruthy(); //W

    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [3, 1]); })).toBeTruthy(); //N
    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [4, 1]); })).toBeTruthy(); //N

    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [4, 2]); })).toBeTruthy(); //NE
    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [3, 3]); })).toBeTruthy(); //NE
    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [2, 4]); })).toBeTruthy(); //NE
    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [1, 5]); })).toBeTruthy(); //NE
    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [0, 6]); })).toBeTruthy(); //NE

    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [5, 2]); })).toBeTruthy(); //E
    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [5, 3]); })).toBeTruthy(); //E

    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [6, 1]); })).toBeTruthy(); //S
    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [7, 1]); })).toBeTruthy(); //S

    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [6, 0]); })).toBeTruthy(); //SW

    expect(wQ.possibleMoves.find((pos) => { return sqEqual(pos, [5, 0]); })).toBeTruthy(); //W
  });
});