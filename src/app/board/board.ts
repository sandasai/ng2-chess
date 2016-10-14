import { Piece, Pawn, King } from '../piece/piece';
import { Color, Rank, sqEqual } from '../chess.util';

export interface IBoard {
	pieces: Piece[];

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
	movePiece(startPos: [number, number], endPos: [number, number]): Piece;

}

export class Board implements IBoard {
	public pieces: Piece[];
	private piecesIndex: Piece[][]; // Use for indexing pieces by position
	bounds: [number, number];
	moveLog: [number, number][][]; //keep a running entry for moves that are taken on this board. First index is start, second index is finish

	constructor() {
		this.pieces = [];
		this.piecesIndex = [];
		this.bounds = [8, 8]; //for chess
		this.moveLog = [];
		for (let i = 0; i < this.bounds[0]; i++) {
			let newRow: Piece[] = [];
			for (let j = 0; j < this.bounds[1]; j++) {
				newRow.push(null);
			}
			this.piecesIndex.push(newRow);
		}
	}

	checkOutOfBounds(pos: [number, number]): boolean {
		return ((pos[0] >= 0) && (pos[0] < this.bounds[0]) && (pos[1] >= 0) && (pos[1] < this.bounds[1])); 
	}

	addPiece(piece: Piece, pos: [number, number]): void {
		if(this.piecesIndex[pos[0]][pos[1]] != null) {
			this.piecesIndex[pos[0]][pos[1]].remove();
		}
		this.piecesIndex[pos[0]][pos[1]] = piece;
		this.pieces.push(piece);
		piece.move(pos);
	}

	removePiece(pos: [number, number]): Piece {
		let piece = this.piecesIndex[pos[0]][pos[1]];
		this.piecesIndex[pos[0]][pos[1]] = null;

		let index = this.pieces.map(p => p.pos).findIndex(piecePos => { return sqEqual(pos, piecePos)});
		if (index > -1) {
			this.pieces.splice(index, 1);
		}

		if (piece)
			piece.remove();
		return piece;
	}

	getPiece(pos: [number, number]): Piece {
		if (!this.checkOutOfBounds(pos))
			return null;
		return this.piecesIndex[pos[0]][pos[1]];
	}
	getPieceArr(): Piece[][] {
		return this.piecesIndex;
	}

	findPieces(callback?: (piece: Piece) => boolean): Piece[] {
		let piecesIndex: Piece[] = [];
		for (let pRow of this.piecesIndex) {
			if (callback) {
				pRow = pRow.filter((piece: Piece) => { return (piece == null) ? false: true } );
				piecesIndex = piecesIndex.concat(pRow.filter(callback));
			}
			else 
				piecesIndex = piecesIndex.concat(pRow.filter((piece: Piece) => { return (piece == null) ? false : true}));
		}
		return piecesIndex;
	}

	movePiece(startPos: [number, number], endPos: [number, number]): Piece {
		let piece: Piece = this.getPiece(startPos);
		if (piece == null)
			return null;
		this.piecesIndex[startPos[0]][startPos[1]] = null;

		let destPiece = this.removePiece(endPos);
		this.moveLog.push([startPos, endPos]);
		this.piecesIndex[endPos[0]][endPos[1]] = piece;
		piece.move(endPos);
		return destPiece;
	}

}


