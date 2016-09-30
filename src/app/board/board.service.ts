import { Injectable } from '@angular/core';
import { Board } from './board';
import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from '../piece/piece';
import { Color, Rank, sqEqual, sqDist, oppColor, MoveOrder, OrderType, BoardOrder, sqColDiff } from '../chess.util';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class BoardService {

	board: Board;

	private _pieceMovedSource = new Subject<Object>();
	pieceMoved$ = this._pieceMovedSource.asObservable(); //Components can subscribe to this event

	constructor() { 
		this.setupStandardGame();
	}

	/** Create a copy of a board */
	public static deepCopy(oldObj: any) {
			var newObj = oldObj;
			if (oldObj && typeof oldObj === "object") {
					newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
					for (var i in oldObj) {
							newObj[i] = this.deepCopy(oldObj[i]);
					}
			}
			return newObj;
	}

	/** Setups the board for a standard game of chess */
	setupStandardGame(): void {
		//*ssm remove all pieces first, clear movelog
		this.board = new Board();

		for (let i = 0; i < 8; i++) {
			this.board.addPiece(new Pawn(Color.White), [6, i]);
			this.board.addPiece(new Pawn(Color.Black), [1, i]);
		}

		this.board.addPiece(new Rook(Color.White), [7, 0]);
		this.board.addPiece(new Knight(Color.White), [7, 1]);
		this.board.addPiece(new Bishop(Color.White), [7, 2]);
		this.board.addPiece(new Queen(Color.White), [7, 3]);
		this.board.addPiece(new King(Color.White), [7, 4]);
		this.board.addPiece(new Bishop(Color.White), [7, 5]);
		this.board.addPiece(new Knight(Color.White), [7, 6]);
		this.board.addPiece(new Rook(Color.White), [7, 7]);

		this.board.addPiece(new Rook(Color.Black), [0, 0]);
		this.board.addPiece(new Knight(Color.Black), [0, 1]);
		this.board.addPiece(new Bishop(Color.Black), [0, 2]);
		this.board.addPiece(new Queen(Color.Black), [0, 3]);
		this.board.addPiece(new King(Color.Black), [0, 4]);
		this.board.addPiece(new Bishop(Color.Black), [0, 5]);
		this.board.addPiece(new Knight(Color.Black), [0, 6]);
		this.board.addPiece(new Rook(Color.Black), [0, 7]);

		this.calcPossibleMoves();
	}

	/** Creates a new board */
	public static createBoard(): Board {
		return new Board();
	}

	/**
	Calculates all possible moves for the pieces on a board
	*/
	calcPossibleMoves(board?: Board): void {
		if (!board)
			board = this.board;
		let allPieces: Piece[] = board.findPieces();
		for (let piece of allPieces) {
			piece.findPossibleMoves(board);
		}
	}

	/**
	Algorithm for checking:
	1 - Determine whether the piece can physically move to specified position
		- Checks this.possiblePos[] which checks piece movement patterns,
			validates out of range, piece color on destination
	2 - If the desired end position is valid, create a mock board with pieces in the same place,
			except with the specified piece in it's new position. Evaluate possible moves for all pieces,
			If an opponent's piece can move to your King, then move is not valid
	In addition for checking whether the move is valid, returns a list of moveOrders to be completed (optional)
	*/
	confirmValidMove(startPos: [number, number], endPos: [number, number], boardOrders?: BoardOrder[]): boolean {
		let piece = this.board.getPiece(startPos);
		let isPosInPossibleMoves = false;
		if (piece == null)
			return false;
		if (piece.possibleMoves.find((pos) => { return sqEqual(pos, endPos)}))
			isPosInPossibleMoves = true;
		if (isPosInPossibleMoves == false) return false;

		//handling special King movements - castling
		if (piece.rank === Rank.King && sqDist(startPos, endPos) === 2) {
			if (this.verifyCastle(piece, endPos)) {
				if (boardOrders) {
					boardOrders.push( { orderType: OrderType.Move, pos: startPos, endPos: endPos });
					let rookBoardOrder = {} as BoardOrder;
					if (endPos[1] - startPos[1] > 0) { //Castle king side
						rookBoardOrder.orderType = OrderType.Move;
						rookBoardOrder.pos = [startPos[0], 7];
						rookBoardOrder.endPos = [startPos[0], 5];
					}
					else { //Castle queen side
						rookBoardOrder.orderType = OrderType.Move;
						rookBoardOrder.pos = [startPos[0], 0];
						rookBoardOrder.endPos = [startPos[0], 3];
					}
					boardOrders.push(rookBoardOrder);
				}
				return true;
			}
			else {
				return false;
			}
		}

		//regular movements
		let dupBoard: Board = BoardService.deepCopy(this.board);
		let prospectPiece: Piece = dupBoard.getPiece(startPos);
		dupBoard.movePiece(startPos, endPos);

		this.calcPossibleMoves(dupBoard);

		if (this.inCheck(prospectPiece.color, dupBoard))
			return false;

		if (boardOrders) {
			boardOrders.push({ orderType: OrderType.Move, pos: startPos, endPos: endPos });
			//handling special Pawn movements - EnPassent
			if (piece.rank === Rank.Pawn && 
					sqColDiff(startPos, endPos) === 1 &&
					!this.board.getPiece(endPos)) {
				console.log("enpassent");
				boardOrders.push({ orderType: OrderType.Remove, pos: [startPos[0], endPos[1]]});
			}
		}
		return true;
	}

	/**
	Returns true if the opposite player color has piece which can move to the specified piece position (capture it)
	Does not evaluate the possible moves of the current pieces on the specified board
	*/
	isThreatened(piece: Piece, board: Board): boolean {
		for (let p of board.findPieces((thePiece: Piece) => {
			return thePiece.color === oppColor(piece.color);
		})) {
			if (p.possibleMoves.find((pos) => { return sqEqual(pos, piece.pos) })) {
				return true;
			}
		}
		return false;
	}

	/**
	Checks whether the player by color is in check
	- Returns true or false if the color of king is in check.
	- Note: Does not calculate the possible moves of pieces beforehand
	 */
	inCheck(color: Color, board: Board): boolean {
		let kings = board.findPieces((piece: Piece) => { return (piece.color === color && piece.rank === Rank.King)}); //usually only one king
		//finding pieces of opponent color
		for (let king of kings) {
			if (this.isThreatened(king, board))
				return true;
		}
		return false;
	}


	/**
	Checks whether the player (by color) is in checkmate.
	- Note: calculates possible moves beforehand
	*/
	inCheckmate(color: Color): boolean {
		this.calcPossibleMoves(this.board);

		/*Cant just calculate moves done by friendly king, also have to determine whether
		Also have to calculate moves done by other pieces to prevent checkmate, like blocking, capturing
		*/
		if (this.inCheck(color, this.board)) { 
			for (let piece of this.board.findPieces((piece: Piece) => {
				return piece.color === color;
			})) {
				for (let move of piece.possibleMoves) { //brute force way to calculating ;)
					if(this.confirmValidMove(piece.pos, move))
						return false;		
				}
			}
		}
		else {
			return false;
		}
		return true;
	}

	/**
	should probably handle movement instead of game service directly controlling the pieces
	*/
	movePiece(startPos: [number, number], endPos: [number, number]): void {
		let piece = this.board.getPiece(startPos);
		this.board.movePiece(startPos, endPos);
		this._pieceMovedSource.next(
		{
			piece: piece,
			startPos: startPos,
			endPos: endPos
		}
		);
	}

	/**
	Adds a piece by color and rank to the position
	*/
	addPiece(color: Color, rank: Rank, pos: [number, number]): void {
		this.removePiece(pos);
		switch(rank) {
      case Rank.Pawn:
      	this.board.addPiece(new Pawn(color), pos);
      	break;
      case Rank.Knight:
      	this.board.addPiece(new Knight(color), pos);
      	break;
      case Rank.Bishop:
      	this.board.addPiece(new Bishop(color), pos);
      	break;
      case Rank.Rook:
      	this.board.addPiece(new Rook(color), pos);
      	break;
      case Rank.Queen:
      	this.board.addPiece(new Queen(color), pos);
      	break;
      case Rank.King:
      	this.board.addPiece(new King(color), pos);
      	break;    
    }
	}

	removePiece(pos: [number, number]): void {
		this.board.removePiece(pos);
		this._pieceMovedSource.next({});
	}
	/**
	Returns true if the castle move is valid
	*/
	verifyCastle(king: Piece, pos: [number, number]): boolean {
		let initSq:[number, number] = king.pos;
		let dir = (pos[1] - king.pos[1] < 0)? -1 : 1;
		let firstSq: [number, number] = [king.pos[0], king.pos[1] + dir]; //castle moves two squaes, this is the first square
		
		for (let sq of [king.pos, firstSq, pos]) {
			let dupBoard: Board = BoardService.deepCopy(this.board);
			let prospectKing: Piece = dupBoard.getPiece(initSq);
			dupBoard.movePiece(initSq, sq);
			this.calcPossibleMoves(dupBoard);

			if (this.isThreatened(prospectKing, dupBoard)) {
				return false;
			}
		}

		return true; //finish
	}

	/** 
	Process orders to be accomplied. Does not error check. May not be used.
	*/
	processOrders(boardOrders: BoardOrder[]): void {
		for (let order of boardOrders) {
			let piece: Piece;
			switch (order.orderType) {
				case OrderType.Move:
					this.movePiece(order.pos, order.endPos);
				break;
				case OrderType.Remove:
					this.removePiece(order.pos);
				break;
			}
		}
	}
}
