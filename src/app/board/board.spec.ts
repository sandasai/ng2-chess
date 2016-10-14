/* tslint:disable:no-unused-variable */

///<reference path="../../../node_modules/@types/jasmine/index.d.ts" />

import { async, inject } from '@angular/core/testing';
import { Board } from './board';
import { Piece, King } from '../piece/piece';
import {Color, Rank, sqAdd, sqEqual} from '../chess.util';

describe('Board', () => {
  let cleanBoard = new Board();
  let testBoard = new Board();

  let p1 = new King(Color.White);
  let p2 = new King(Color.White);
  let p3 = new King(Color.White);
  let p4 = new King(Color.Black);
  testBoard.addPiece(p1,[4, 4]);
  testBoard.addPiece(p2,[4, 5]);
  testBoard.addPiece(p3,[4, 6]);

  let testBoard2: Board;
  beforeEach(() => {
    testBoard2 = new Board();
    testBoard2.addPiece(new King(Color.Black), [1, 5]);
    testBoard2.addPiece(new King(Color.White), [2, 6]);
    testBoard2.addPiece(new King(Color.Black), [4, 7]);
  });

  it('should create an empty board', () => {
    expect(cleanBoard).toBeTruthy();
    expect(cleanBoard.findPieces().length).toEqual(0);
  });

  it('Board with a single piece - testing piece querying', () => {
    expect(testBoard.findPieces().length).toEqual(3);
    expect(testBoard.getPiece([4, 4])).toBeTruthy();
  });

  it('with a multiple pieces of same color', () => {
    expect(testBoard.findPieces(function(piece: Piece) { 
    	if (piece !== null) 
    		return piece.color === Color.White 
    	return false 
    }).length).toEqual(3);
  });

  it('should check out of bounds - checkOutOfBounds()', () => {
  	expect(cleanBoard.checkOutOfBounds([-1, -1])).toEqual(false);
  	expect(cleanBoard.checkOutOfBounds([1, 7])).toEqual(true);
  	expect(cleanBoard.checkOutOfBounds([0, 7])).toEqual(true);  
  	expect(cleanBoard.checkOutOfBounds([-1, 7])).toEqual(false);	
  	expect(cleanBoard.checkOutOfBounds([0, -7])).toEqual(false);	
  	expect(cleanBoard.checkOutOfBounds([2, -1])).toEqual(false);	
  });

  /** Editing Testboard here */
  it('should move a piece to a new position - movePiece()', () => {
  	testBoard.movePiece([4,5], [7, 7]);
  	expect(testBoard.getPiece([7, 7])).toBeTruthy();
  });

  it('should find pieces based on the board.pieces property', () => {
    /* testBoard2 with pieces on [1, 5], [2, 6], [4, 7] */
    expect(testBoard2.pieces.map(piece => piece.pos).find(pos => { return sqEqual(pos, [1, 5]) })).toBeTruthy();
    expect(testBoard2.pieces.map(piece => piece.pos).find(pos => { return sqEqual(pos, [2, 6]) })).toBeTruthy();
    expect(testBoard2.pieces.map(piece => piece.pos).find(pos => { return sqEqual(pos, [4, 7]) })).toBeTruthy();
    expect(testBoard2.pieces.map(piece => piece.pos).indexOf([3, 3])).toEqual(-1);
  });

  it('should not find pieces on the board.pieces property if they have been removed from board', () => {
    testBoard2.removePiece([2, 6]);
    expect(testBoard2.pieces.map(piece => piece.pos).find(pos => { return sqEqual(pos, [2, 6]) })).toBeFalsy();
    expect(testBoard2.pieces.length).toEqual(2);
    expect(testBoard2.getPiece[2, 6]).toBeFalsy();

    testBoard2.removePiece([1, 5]);
    expect(testBoard2.pieces.map(piece => piece.pos).find(pos => { return sqEqual(pos, [1, 5]) })).toBeFalsy();
    expect(testBoard2.pieces.length).toEqual(1);
    expect(testBoard2.getPiece[1, 5]).toBeFalsy();  
  });
});
