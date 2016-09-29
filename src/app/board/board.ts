import { Piece, Pawn, King } from '../piece/piece';
import { Color, Rank } from '../chess.util';

export interface IBoard {
	moveLog: [number, number][][];

	/** Returns true if the given sqvec is a valid location on the board */
	checkOutOfBounds(pos: [number, number]): boolean;

	/** Add piece to the board at a specified location */
	addPiece(piece: Piece, pos: [number, number]): void;

	/** Remove piece at the specified location if it exists. Returns the piece or null*/
	removePiece(pos: [number, number]): Piece;

	/** Returns the piece at the specified location */
	getPiece(pos: [number, number]): Piece;

	/** Returns the multidimensional array that contains the pieces. Do NOT manipulate the contents of the array */
	getPieceArr(): Piece[][];

	/** Filter for pieces. Returns an array of all the pieces that match the condition of the callback function*/
	findPieces(callback?: (piece: Piece) => boolean): Piece[];

	/** Moves piece from its current position to the specified position on the board 
		If the final position has a piece on it, that 'captured' piece will be updated to have a null position
		Returns the 'captured' piece (if it exists)
	*/
	movePiece(piece: Piece, pos: [number, number]): Piece;

}

export class Board implements IBoard {
	private pieces: Piece[][];
	bounds: [number, number];
	moveLog: [number, number][][]; //keep a running entry for moves that are taken on this board. First index is start, second index is finish

	constructor() {
		this.pieces = [];
		this.bounds = [8, 8]; //for chess
		this.moveLog = [];
		for (let i = 0; i < this.bounds[0]; i++) {
			let newRow: Piece[] = [];
			for (let j = 0; j < this.bounds[1]; j++) {
				newRow.push(null);
			}
			this.pieces.push(newRow);
		}
	}

	checkOutOfBounds(pos: [number, number]): boolean {
		return ((pos[0] >= 0) && (pos[0] < this.bounds[0]) && (pos[1] >= 0) && (pos[1] < this.bounds[1])); 
	}

	addPiece(piece: Piece, pos: [number, number]): void {
		if(this.pieces[pos[0]][pos[1]] != null) {
			this.pieces[pos[0]][pos[1]].remove();
		}
		this.pieces[pos[0]][pos[1]] = piece;
		piece.move(pos);
	}

	removePiece(pos: [number, number]): Piece {
		let piece = this.pieces[pos[0]][pos[1]];
		this.pieces[pos[0]][pos[1]] = null;
		if (piece)
			piece.remove();
		return piece;
	}

	getPiece(pos: [number, number]): Piece {
		if (!this.checkOutOfBounds(pos))
			return null;
		return this.pieces[pos[0]][pos[1]];
	}
	getPieceArr(): Piece[][] {
		return this.pieces;
	}

	findPieces(callback?: (piece: Piece) => boolean): Piece[] {
		let pieces: Piece[] = [];
		for (let pRow of this.pieces) {
			if (callback) {
				pRow = pRow.filter((piece: Piece) => { return (piece == null) ? false: true } );
				pieces = pieces.concat(pRow.filter(callback));
			}
			else 
				pieces = pieces.concat(pRow.filter((piece: Piece) => { return (piece == null) ? false : true}));
		}
		return pieces;
	}

	movePiece(piece: Piece, pos: [number, number]): Piece {
		let currentPos: [number, number] = piece.pos;
		this.pieces[currentPos[0]][currentPos[1]] = null;
		let destPiece = this.getPiece(pos);
		if (destPiece) {
			destPiece.remove();
		}
		this.moveLog.push([currentPos, pos]);
		this.pieces[pos[0]][pos[1]] = piece;
		piece.move(pos);
		return destPiece;
	}

}


