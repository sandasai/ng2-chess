/* tslint:disable:no-unused-variable */
///<reference path="../../../node_modules/@types/jasmine/index.d.ts" />


import { TestBed, async, inject } from '@angular/core/testing';
import { BoardService } from './board.service';
import { Board } from './board';
import { Color, BoardOrder, OrderType } from '../chess.util';
import * as Piece from '../piece/piece';

describe('Service: Board', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardService]
    });
  });

  it('should ...',
    inject([BoardService],
      (service: BoardService) => {
        expect(service).toBeTruthy();
      }));

  it('should create a new board, calculate possible moves, and copy board',
    inject([BoardService],
      (service: BoardService) => {

      	service.board = new Board();
        let board = service.board;
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
			    let bB = new Piece.Bishop(Color.Black);
			    let wB = new Piece.Bishop(Color.White);
			    board.addPiece(bB, [4, 4]);
			    board.addPiece(wB,[2, 2]);

			    board.addPiece(new Piece.Pawn(Color.White), [6, 5]);
			    board.addPiece(new Piece.Pawn(Color.White), [5, 6]);
			    board.addPiece(new Piece.Pawn(Color.White), [5, 4]);
			    board.addPiece(new Piece.Pawn(Color.White), [4, 5]);
			    board.addPiece(new Piece.King(Color.White), [7, 7]);
			    board.addPiece(new Piece.Knight(Color.Black), [2, 6]);

			    service.calcPossibleMoves(board);

			    expect(board.getPiece([6,5]).possibleMoves.length).toEqual(1);
			    expect(board.getPiece([5,4]).possibleMoves.length).toEqual(0);
			    expect(board.getPiece([5,6]).possibleMoves.length).toEqual(1);
			    expect(board.getPiece([4,5]).possibleMoves.length).toEqual(1);
			    expect(board.getPiece([7,7]).possibleMoves.length).toEqual(3); //wK
			    expect(board.getPiece([4,4]).possibleMoves.length).toEqual(9); //bB
			    expect(board.getPiece([2,2]).possibleMoves.length).toEqual(8); //wB

			    let dupBoard: Board = BoardService.deepCopy(board);

			    expect(dupBoard.getPiece([6,5]).possibleMoves.length).toEqual(1);
			    expect(dupBoard.getPiece([5,4]).possibleMoves.length).toEqual(0);
			    expect(dupBoard.getPiece([5,6]).possibleMoves.length).toEqual(1);
			    expect(dupBoard.getPiece([4,5]).possibleMoves.length).toEqual(1);
			    expect(dupBoard.getPiece([7,7]).possibleMoves.length).toEqual(3); //wK
			    expect(dupBoard.getPiece([4,4]).possibleMoves.length).toEqual(9); //bB
			    expect(dupBoard.getPiece([2,2]).possibleMoves.length).toEqual(8); //wB

			    //moving pieces on the board
			    dupBoard.movePiece(dupBoard.getPiece([2,2]), [4,0]);
			    service.calcPossibleMoves(dupBoard);

			    expect(board.getPiece([4,4]).possibleMoves.length).toEqual(9); //bB
			    expect(dupBoard.getPiece([4,4]).possibleMoves.length).toEqual(11); //bB

			    expect(dupBoard.getPiece([6,5]).possibleMoves.length).toEqual(1);
			    expect(dupBoard.getPiece([5,4]).possibleMoves.length).toEqual(0);
			    expect(dupBoard.getPiece([5,6]).possibleMoves.length).toEqual(1);
			    expect(dupBoard.getPiece([4,5]).possibleMoves.length).toEqual(1);
			    expect(dupBoard.getPiece([7,7]).possibleMoves.length).toEqual(3); //wK
      }));  

	it('should determine whether a piece is being threatened or not', inject([BoardService], (service: BoardService) => {
    /*
	    0  1  2  3  4  5  6  7 
	  0 -- -- -- -- -- -- -- --
	  1 -- -- bP -- -- -- -- --
	  2 -- -- -- bB -- -- -- --
	  3 -- -- -- -- -- -- -- --
	  4 -- -- -- -- -- -- -- --
	  5 -- -- -- -- -- -- wK --
	  6 -- -- -- -- -- -- wP --
	  7 -- -- -- -- -- -- -- --
    */

		let testboard = new Board();
		let wK = new Piece.King(Color.White);
		let wP = new Piece.Pawn(Color.White);
		let bP = new Piece.Pawn(Color.Black);
		testboard.addPiece(wK, [5, 6]);
		testboard.addPiece(new Piece.Bishop(Color.Black), [2, 3]);
		testboard.addPiece(wP, [6, 6]);
		testboard.addPiece(bP,[1, 2]);

		service.board = testboard;
		service.calcPossibleMoves(service.board);

		expect(service.isThreatened(wK, service.board)).toBeTruthy();
		expect(service.isThreatened(wP, service.board)).toBeFalsy();
		expect(service.isThreatened(bP, service.board)).toBeFalsy();
	}));

  it('should determine valid moves for pieces, cannot move a pinned piece',
    inject([BoardService],
      (service: BoardService) => {
      	service.board = new Board();
        let board = service.board;
          /*
			    0  1  2  3  4  5  6  7 
			  0 -- -- -- -- -- -- -- --
			  1 -- bK -- -- -- -- -- --
			  2 -- -- -- -- -- -- -- --
			  3 -- -- -- -- -- -- -- --
			  4 -- -- -- -- -- -- -- --
			  5 -- bR -- -- -- wP wK --
			  6 -- -- -- -- -- -- -- --
			  7 -- -- -- -- -- -- -- --
			    */
		    board.addPiece(new Piece.Pawn(Color.White), [5, 5]);
		    board.addPiece(new Piece.King(Color.White), [5, 6]);
		    board.addPiece(new Piece.King(Color.Black), [1, 1]);
		    board.addPiece(new Piece.Rook(Color.Black), [5, 1]);
		    service.calcPossibleMoves(board);

		    expect(service.confirmValidMove([5,5],[5,4])).toBeFalsy();
		    expect(service.confirmValidMove([5,5],[4,5])).toBeFalsy();
      }));

  it('should detect whether capturing a piece or blocking check is valid',
    inject([BoardService],
      (service: BoardService) => {
      	service.board = new Board();
        let board = service.board;
          /*
			    0  1  2  3  4  5  6  7 
			  0 -- -- wQ -- -- -- -- bK
			  1 -- -- -- -- -- -- bP bP
			  2 -- -- -- bN -- -- -- --
			  3 -- -- -- -- -- -- -- --
			  4 -- -- -- -- -- -- -- --
			  5 -- -- -- -- -- -- -- --
			  6 -- -- -- -- -- -- -- --
			  7 wK -- -- -- -- -- -- --
			    */
		    board.addPiece(new Piece.Queen(Color.White), [0, 2]);
		    board.addPiece(new Piece.King(Color.White), [7, 0]);
		    board.addPiece(new Piece.Knight(Color.Black), [2, 3]);
		    board.addPiece(new Piece.Pawn(Color.Black), [1, 6]);
		    board.addPiece(new Piece.Pawn(Color.Black), [1, 7]);
		    board.addPiece(new Piece.King(Color.Black), [0, 7]);
		    service.calcPossibleMoves(board);
		    //invalid moves b/c check or not possible
		    expect(service.confirmValidMove([1,6],[0,6])).toBeFalsy();
		    expect(service.confirmValidMove([1,7],[0,7])).toBeFalsy();
		    expect(service.confirmValidMove([2,3],[4,2])).toBeFalsy();		    
		    expect(service.confirmValidMove([2,3],[1,1])).toBeFalsy();	
		    //valid moves to prevent check -> via blocking or capturing
		    expect(service.confirmValidMove([2,3],[0,4])).toBeTruthy();		    
		    expect(service.confirmValidMove([2,3],[0,2])).toBeTruthy();		    
      }));

  it('should determine whether the player is in check/checkmate',
    inject([BoardService],
      (service: BoardService) => {
      	service.board = new Board();
        let board = service.board;
          /*
			    0  1  2  3  4  5  6  7 
			  0 -- -- wQ -- -- -- -- bK
			  1 -- -- -- -- -- -- bP bP
			  2 -- -- -- bN -- -- -- --
			  3 -- -- -- -- -- -- -- --
			  4 -- -- -- -- -- -- -- --
			  5 -- -- -- -- -- -- -- --
			  6 -- -- -- -- -- -- -- --
			  7 wK -- -- -- -- -- -- --
			    */
		    board.addPiece(new Piece.Queen(Color.White), [0, 2]);
		    board.addPiece(new Piece.King(Color.White), [7, 0]);
		    board.addPiece(new Piece.Knight(Color.Black), [2, 3]);
		    board.addPiece(new Piece.Pawn(Color.Black), [1, 6]);
		    board.addPiece(new Piece.Pawn(Color.Black), [1, 7]);
		    board.addPiece(new Piece.King(Color.Black), [0, 7]);
		    service.calcPossibleMoves(board);

		    expect(service.inCheck(Color.Black, board)).toBeTruthy();
		    expect(service.inCheckmate(Color.Black)).toBeFalsy();

		    board.movePiece(board.getPiece([2,3]), [0,4]);
		    board.movePiece(board.getPiece([0,2]),[0,4]);

		    expect(service.inCheck(Color.Black, board)).toBeTruthy();
		    expect(service.inCheckmate(Color.Black)).toBeTruthy();
      }));
});

describe('Service: Board - Determining legal castling', () => {
	let testboard: Board;
	let boardOrders: BoardOrder[] = [];

	beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardService]
    });

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
    let bK = new Piece.King(Color.Black);
    let wK = new Piece.King(Color.White);
    testboard.addPiece(bK, [0, 4]);
    testboard.addPiece(wK, [7, 4]);
    testboard.addPiece(new Piece.Rook(Color.Black), [0, 0]);
    testboard.addPiece(new Piece.Rook(Color.Black), [0, 7]);
    testboard.addPiece(new Piece.Rook(Color.White), [7, 0]);
    testboard.addPiece(new Piece.Rook(Color.White), [7, 7]);

  	boardOrders = [];
  });

	it('should identify castling as a legal move', inject([BoardService], (service: BoardService) => {
	  service.board = testboard;
    service.calcPossibleMoves(testboard);
    expect(service.confirmValidMove([7, 4], [7, 6], boardOrders)).toBeTruthy();
    expect(service.confirmValidMove([7, 4], [7, 2], boardOrders)).toBeTruthy();
    expect(service.confirmValidMove([0, 4], [0, 6], boardOrders)).toBeTruthy();
    expect(service.confirmValidMove([0, 4], [0, 2], boardOrders)).toBeTruthy();
    console.log(boardOrders.length);

    expect(boardOrders).toContain({ orderType: OrderType.Move, pos: [0, 0], endPos: [0, 3] });
    
   	expect(boardOrders).toEqual(jasmine.arrayContaining(
		[
			{ orderType: OrderType.Move, pos: [7, 4], endPos: [7, 6] }, //first expect, king move
			{ orderType: OrderType.Move, pos: [7, 7], endPos: [7, 5] }, //first expect, rook move
			{ orderType: OrderType.Move, pos: [7, 4], endPos: [7, 2] }, //second, king move
			{ orderType: OrderType.Move, pos: [7, 0], endPos: [7, 3] }, //second, rook move
			{ orderType: OrderType.Move, pos: [0, 4], endPos: [0, 6] }, //third, king move
			{ orderType: OrderType.Move, pos: [0, 7], endPos: [0, 5] }, //third, rook move
			{ orderType: OrderType.Move, pos: [0, 4], endPos: [0, 2] }, //fourth, king move
			{ orderType: OrderType.Move, pos: [0, 0], endPos: [0, 3] }, //fourth, rook move
		]));
	
	}));

	it('should identify castling through pieces as illegal', inject([BoardService], (service: BoardService) => {
		service.board = testboard;	
		testboard.addPiece(new Piece.Bishop(Color.Black), [7, 5]);
		testboard.addPiece(new Piece.Knight(Color.Black), [7, 3]);
		service.calcPossibleMoves(testboard);
    expect(service.confirmValidMove([7, 4], [7, 6])).toBeFalsy();
    expect(service.confirmValidMove([7, 4], [7, 2])).toBeFalsy();
	}));

	it('should identify castling ontop pieces as illegal', inject([BoardService], (service: BoardService) => {
		service.board = testboard;	
		testboard.addPiece(new Piece.Bishop(Color.White), [0, 6]);
		testboard.addPiece(new Piece.Knight(Color.White), [0, 2]);
		service.calcPossibleMoves(testboard);
    expect(service.confirmValidMove([0, 4], [0, 6])).toBeFalsy();
    expect(service.confirmValidMove([0, 4], [0, 2])).toBeFalsy();
	}));

	it('should identify castling through check as illegal', inject([BoardService], (service: BoardService) => {
		service.board = testboard;
		let bB = new Piece.Bishop(Color.Black);
		let wQ = new Piece.Queen(Color.White);
		testboard.addPiece(bB, [4, 0]);
		testboard.addPiece(wQ, [6, 5]);
		service.calcPossibleMoves(testboard);
		expect(service.confirmValidMove([7, 4], [7, 2])).toBeFalsy();
		//expect(service.confirmValidMove([0, 4], [0, 6])).toBeFalsy();
	}));

	it('should identify ending up in check after castling as illegal', inject([BoardService], (service:BoardService) => {
		service.board = testboard;
		let bB = new Piece.Bishop(Color.Black);
		let wQ = new Piece.Queen(Color.White);
		testboard.addPiece(bB, [1, 0]);
		testboard.addPiece(wQ, [6, 2]);
		service.calcPossibleMoves(testboard);	
		expect(service.confirmValidMove([7, 4], [7, 6])).toBeFalsy();
		expect(service.confirmValidMove([0, 4], [0, 2])).toBeFalsy();
	}));
})
