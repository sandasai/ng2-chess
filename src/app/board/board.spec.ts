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
  	let pieceMoved = testBoard.getPiece([4, 5]);
  	testBoard.movePiece(pieceMoved, [7, 7]);
  	expect(testBoard.getPiece([7, 7])).toBeTruthy();
  });
});
