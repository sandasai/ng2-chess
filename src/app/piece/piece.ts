import { EventEmitter } from '@angular/core';

import { Color, Rank, sqAdd, sqEqual, anySqInSqArr } from '../chess.util';
import { IBoard } from '../board/board';

export abstract class Piece {
	onBoard: boolean;
	color: Color;
	rank: Rank;
	moves: [number, number][]; //includes the starting position. So it starts at length 1
	possibleMoves: [number, number][]; //where the piece can physically move to this turn 
	pos: [number, number]; //current position on the board

	constructor(color: Color) {
		this.color = color;
		this.moves = [];
	}

	get oppColor(): Color {
		if (this.color === Color.White)
    		return Color.Black;
		return Color.White;
  	}

  	/** Update the position of the piece and record the movements taken */
  	move(pos: [number, number]) {
  		this.pos = pos;
  		this.moves.push(pos);
  		this.onBoard = true;
  	}
  	remove(): void {
  		this.pos = null;
  		this.onBoard = false;
  	}

  	/** Finds the possible moves this piece can physically move to */
  	abstract findPossibleMoves(board: IBoard): void;

    /** Helper function to find squares that piece can move when moving in a specific direction 
      startPos - position where the piece may be at or moving from
      vector - the direction where the piece is headed
      validPos - holder for the positions that the piece can move to
    */
  	protected infMoveHelper(startPos: [number, number], board: IBoard, vector: [number, number], validPos: [number, number][]): [number, number][] {
		let endPos: [number, number] = sqAdd(vector, startPos);
	    if (!board.checkOutOfBounds(endPos)) return validPos; //indexing out of bounds
	    let endPiece: Piece = board.getPiece(endPos);
	    if (endPiece) { //ran into a piece
	    	if (endPiece.color === this.oppColor)
	      		validPos.push(endPos);  //run into same color piece
	     	return validPos; //capturing an opponent piece
	    }
	    else {
		    validPos.push(endPos); //valid move, keep searching in same path
		    return this.infMoveHelper(endPos, board, vector, validPos);
	    }
  	}
}

export class King extends Piece {
	constructor(color: Color) {
		super(color);
		this.rank = Rank.King;
	}

	/**
	Returns true if the given piece is a rook, and a valid piece to preform castle
	*/
	private cornerRooksAreLegit(corner: Piece): boolean {
		return (corner && 
				anySqInSqArr([[0, 0], [0, 7], [7, 7], [7, 0]], [corner.pos]) &&
				corner.rank === Rank.Rook && 
				corner.color === this.color &&
				corner.moves.length === 1)
	}

	/**
	Returns true if there are pieces in the path of castling
	*/
	private piecesInCastlePath(castlePos: [number, number], board: IBoard): boolean {
		let dir = (castlePos[1] - this.pos[1] < 0)? -1 : 1;
		let firstSq: [number, number] = [this.pos[0], this.pos[1] + dir];
		for (let sq of [firstSq, castlePos]) {
			if (board.getPiece(sq))
				return true;
		}
		return false;
	}
	
  /* Kings can move one square in any direction, or can perform a castle if the king and it's rook has not moved yet */
	findPossibleMoves(board: IBoard): void {
		this.possibleMoves = [];
		let vectors: [number, number][] = [
			[-1, -1], // NW
			[-1, 0],  // N
			[-1, 1],  // NE
			[0, -1],  // W
			[0, 1],   // E
			[1, -1],  // SW
			[1, 0],   // S
			[1, 1]    // SE
	    ];
    
    for (let dir of vectors) {
    	let finalPos: [number, number] = sqAdd(this.pos, dir);
    	if (!board.checkOutOfBounds(finalPos)) 		//check out of bounds
    		continue;
    	let sqPiece = board.getPiece(finalPos);
    	if (sqPiece == null) {				  		//check whether square is empty
    		this.possibleMoves.push(finalPos); 
    	}
    	else if (sqPiece.color === this.oppColor) {	//if not, check if piece is opposite color
    		this.possibleMoves.push(finalPos);
    	}
    }

    //*ssm add condition for castling
    let stdInitPos: [number, number] = (this.color === Color.White) ? [7, 4] : [0, 4]; //Kings can only castle from original starting position
    if (this.moves.length > 1 || !sqEqual(this.pos, stdInitPos)) 
    	return;
	 	let cornerLeft: Piece = board.getPiece([stdInitPos[0], 0]); //left/right relative to white
		let cornerRight: Piece = board.getPiece([stdInitPos[0], 7]);
		let leftDest: [number, number] = [stdInitPos[0], 2];
		let rightDest: [number, number] = [stdInitPos[0], 6]

		if (this.cornerRooksAreLegit(cornerLeft) && !this.piecesInCastlePath(leftDest, board)) {
			this.possibleMoves.push(leftDest);
		}
		if (this.cornerRooksAreLegit(cornerRight) && !this.piecesInCastlePath(rightDest, board)) {
			this.possibleMoves.push(rightDest);
		}
	}
}

export class Pawn extends Piece {
	constructor(color: Color) {
		super(color);
		this.rank = Rank.Pawn;
	}

	/** Returns true if the pawn can perform en passent. pos is the destination square the piece is moving to. 
	Note - this assumes that the pawns and the board have been generated from standard chess board
	*/
	private checkEnPassent(pos: [number, number], board: IBoard): boolean {
		let row: number = (this.color === Color.White) ? 2 : 5; //can only realistically be performed on rows 2 for white, 5 for black
		if (pos[0] !== row)
			return false;
		let dir: number = (this.color === Color.White) ? 1 : -1; //used for checking row location of the pawn to be taken
		let prosPos: [number, number] = [row + dir, pos[1]];
		let prosPawn = board.getPiece(prosPos);
		//check whether piece exists on the square 1 column unit before/after the destination location
		if (prosPawn == null) {
			return false;
		}
		//check if the piece before is a propective pawn, and whether pawn just moved 2 spaces
		else if (prosPawn.rank === Rank.Pawn && 
						 sqEqual(board.moveLog[board.moveLog.length-1][1],(prosPos)) && 
						 prosPawn.moves.length === 2) 
			return true;
		return false;
	}

  /* Pawns can move two spaces on it's first move. One space forward otherwise. 
  Can attack pieces one square diagonal in the direction where it's moving. Can also capture with enPassent
  */
	findPossibleMoves(board: IBoard): void {
		this.possibleMoves = [];
		let dir = (this.color === Color.White) ? -1 : 1;
		let fPos: [number, number] = sqAdd(this.pos, [dir, 0]);
		let twoSpaceRank = (this.color === Color.White) ? 6 : 1;

		//Handling forward movement
    	if (board.checkOutOfBounds(fPos) &&
        	board.getPiece(fPos) == null) {
      		this.possibleMoves.push(fPos);
      		if (this.moves.length === 1 && this.pos[0] === twoSpaceRank) { //Pawns can move two spaces on their first move
        		let fPos2: [number, number] = sqAdd(this.pos, [dir * 2, 0]);
        		if (board.checkOutOfBounds(fPos2) &&
            		board.getPiece(fPos2) == null) {
          			this.possibleMoves.push(fPos2);
        		}
      		}
    	}

    	//check diagonal attack
	    let diagPos: [number, number] = sqAdd(this.pos, [dir, 1]);
	    let diagPosAlt: [number, number] = sqAdd(this.pos, [dir, -1]);
	    if ((board.checkOutOfBounds(diagPos) &&
	        board.getPiece(diagPos) != null &&
	        board.getPiece(diagPos).color === this.oppColor) 
	        ||
	        this.checkEnPassent(diagPos, board)) {
	        this.possibleMoves.push(diagPos);
	    }
	    if ((board.checkOutOfBounds(diagPosAlt) &&
	        board.getPiece(diagPosAlt) != null &&
	        board.getPiece(diagPosAlt).color === this.oppColor)
	        ||
	        this.checkEnPassent(diagPosAlt, board)) {
	        this.possibleMoves.push(diagPosAlt);
	    }
	}
}

export class Knight extends Piece {
	constructor(color: Color) {
		super(color);
		this.rank = Rank.Knight;
	}
  /* Knights can only move in L shape patterns 2x1 or 1x2 squares */
	findPossibleMoves(board: IBoard): void {
		this.possibleMoves = [];
		let vectors: [number, number][] = [
			[-1, -2], 
			[-1, 2], 
			[1, -2], 
			[1, 2], 
			[2, 1], 
			[2, -1], 
			[-2, 1], 
			[-2, -1]
		];

 		for (let dir of vectors) {
	    	let finalPos: [number, number] = sqAdd(this.pos, dir);
	    	if (!board.checkOutOfBounds(finalPos)) 		//check out of bounds
	    		continue;
	    	let sqPiece = board.getPiece(finalPos);
	    	if (sqPiece == null) {				  		//check whether square is empty
	    		this.possibleMoves.push(finalPos); 
	    	}
	    	else if (sqPiece.color === this.oppColor) {	//if not, check if piece is opposite color
	    		this.possibleMoves.push(finalPos);
	    	}
	    }
	}
	   
}

export class Bishop extends Piece {
	constructor(color: Color) {
		super(color);
		this.rank = Rank.Bishop;
	}
  /* Bishops can move any number of spaces diagonally */
	findPossibleMoves(board: IBoard): void {
		this.possibleMoves = [];
	    let moveDirections: [number, number][] = [
				[-1, -1], 
				[-1, 1], 
				[1, -1], 
				[1, 1]
	    ];

	    for (let dir of moveDirections) {
	    	let validPos: [number, number][] = [];
	    	this.possibleMoves = this.possibleMoves.concat(this.infMoveHelper(this.pos, board, dir, validPos));
	    }
	}
}

export class Rook extends Piece {
	constructor(color: Color) {
		super(color);
		this.rank = Rank.Rook;
	}
  /* Rooks can move another of spaces horizontally and vertically */
	findPossibleMoves(board: IBoard): void {
		this.possibleMoves = [];
	    let moveDirections: [number, number][] = [
				[-1, 0], 
				[1, 0], 
				[0, 1], 
				[0, -1]
	    ];

	    for (let dir of moveDirections) {
	    	let validPos: [number, number][] = [];
	    	this.possibleMoves = this.possibleMoves.concat(this.infMoveHelper(this.pos, board, dir, validPos));
	    }
	}
}

export class Queen extends Piece {
	constructor(color: Color) {
		super(color);
		this.rank = Rank.Queen;
	}
  /* Queen can move any number of spaces vertically, horizontally, and diagonally */
	findPossibleMoves(board: IBoard): void {
		this.possibleMoves = [];
	    let moveDirections: [number, number][] = [
				[-1, -1], 
				[-1, 1], 
				[1, -1], 
				[1, 1],
				[-1, 0], 
				[1, 0], 
				[0, 1], 
				[0, -1]
	    ];

	    for (let dir of moveDirections) {
	    	let validPos: [number, number][] = [];
	    	this.possibleMoves = this.possibleMoves.concat(this.infMoveHelper(this.pos, board, dir, validPos));
	    }
	}
}
