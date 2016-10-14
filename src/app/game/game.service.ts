import { Injectable } from '@angular/core';
import { Board } from '../board/board';
import { BoardService } from '../board/board.service';
import { Color, Rank, Selectable, sqEqual, MoveOrder, oppColor, BoardOrder } from '../chess.util';
import { Piece } from '../piece/piece';
import { SquareComponent } from './square/square.component';

import { Subject } from 'rxjs/Subject';

export enum UserState {
	SelectSt,
	SelectEnd,
	Menu
}

@Injectable()
export class GameService {

	userState: UserState;

	//board
	board: Board;
	playerTurn: Color;
  selected: Selectable;

	//Selected Positions
	private _startPos: [number, number];
	private _startPiece: Piece;

  //Storing position of last pawn that reached backrow....
  public backrowPawnPos: [number, number];

  //Emitting special events from service...
  private _uiOverlaySource = new Subject<Object>();
  uiMenuEvent$ = this._uiOverlaySource.asObservable(); //For emitting special events which should be shown on ui

  constructor(private _boardService: BoardService) { 
  	this.startGame();
  }

  /**
	Initialize the start of the turn 
  */
  startGame(): void {
    this.userState = UserState.SelectSt;//for now
    this._boardService.setupStandardGame();
    this.board = this._boardService.board;
    this.playerTurn = Color.White;
    this._boardService.calcPossibleMoves();  
  }

  /**
	Gets called when user selects a square. Main entry for user input
  */
  selectPos(pos: [number, number], selectable?: Selectable): void {
  	switch(this.userState) {

  		case UserState.SelectSt: 
  			let selectPiece = this.board.getPiece(pos);
  			if (!selectPiece) 
  				return;
  			if (selectPiece.color !== this.playerTurn) 
  				return;
  			this._startPos = pos;
  			this._startPiece = selectPiece;
        if (selectable) {
          this.changeSelect(selectable);
        }
  			this.userState = UserState.SelectEnd;
  			break;

  		case UserState.SelectEnd:
  			//need to actually confirm whether the move is valid first
        if (sqEqual(pos, this._startPos)) {
          this.userState = UserState.SelectSt;
          this.changeSelect();
        }
        let boardOrders: BoardOrder[] = [];
        if (!this._boardService.confirmValidMove(this._startPos, pos, boardOrders))
          return;
        this._boardService.processOrders(boardOrders);
        //add handling for pawns reaching backrow if it did. If so, breaks out of this function, opens menu for pawn selection
        if (this.isPawnBackrow()) {
          console.log("pawn in backrow");
          this.backrowPawnPos = pos; //assumes that only one board order was taken, the pawn movement to the backrow 
          this.userState = UserState.Menu;
          return;
        }

  			this.endTurn();
  			break;

      default:
        return;
  	}
  }

  /**
  Checks if the pawn reaches the backrow, if so, will prompt
  */
  isPawnBackrow(): boolean {
    let backRow: number = (this.playerTurn === Color.White)? 0 : 7;
    let backPawns: Piece[] = this.board.findPieces((piece) => {
      return (piece.rank === Rank.Pawn && 
              piece.color === this.playerTurn &&
              piece.pos[0] === backRow);
    });
    return backPawns.length !== 0;
  }

  /**
  Event to be called from menu component. GameService stores which pawn is to be promoted and adds it to the board
  */
  pawnPromotion(pos: [number,number], color: Color, rank: Rank) {
    this._boardService.addPiece(color, rank, pos);
    this.endTurn();
  }

  /**
  Deselects any selected square, changes turns, calculates check or checkmate
  */
  endTurn(): void {
    this.changeSelect();
  	this.playerTurn = this.playerTurn === Color.White ? Color.Black : Color.White;
  	this.userState = UserState.SelectSt;
  	
  	this._boardService.calcPossibleMoves();
  	if(this._boardService.inCheck(this.playerTurn, this.board)) {
  		console.log("Check!");
  	}
    if(this._boardService.inCheckmate(this.playerTurn)) {
      console.log("Checkmate");
      this._uiOverlaySource.next({ test: "hello" });
    }

    this._startPos = null;
  }

  /**
  If provided a newSelectable, changes current selectable to false (selectable),
  with new Selectable selected. Otherwise changes current selectable to false and nulls it.
  */
  changeSelect(newSelect?: Selectable) {
    if (this.selected) {
        this.selected.selected = false;
    }
    if (newSelect) {  
      newSelect.selected = true;
      this.selected = newSelect;
    }
    else {
      this.selected = null;
    }
  }
}
