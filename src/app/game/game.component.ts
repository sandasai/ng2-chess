import { Component, OnInit, Renderer, HostListener } from '@angular/core';
import { SquareComponent } from './square/square.component';
import { Color } from '../chess.util';
import { Square } from './square/square';
import { Piece } from '.././piece/piece';
import { PieceComponent } from '../piece/piece.component';
import { BoardService } from '../board/board.service';
import { GameService } from './game.service';
import { Board } from '../board/board';

@Component({
  selector: 'app-game',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css'],
  providers: [BoardService,GameService],
})
export class GameComponent implements OnInit {
	squares: Square[];
	pieces: Piece[];
	board: Board;
  squareSpacing: number;

  showMenu: boolean;
  menuWidthPx: string;
  menuHeightPx: string;

  constructor(private _boardService: BoardService, private _gameService: GameService) {
  	_gameService.uiMenuEvent$.subscribe((item) => this.onUiMenuEvent(item));
    this.showMenu = true;
    //Probably include this in a game service
    this.squareSpacing = 84;
    _boardService.pieceMoved$.subscribe((item)=>this.pieceMoved(item));
  }

  ngOnInit() {
    this.menuHeightPx = (this.squareSpacing * 8).toString() + "px";
    this.menuWidthPx = (this.squareSpacing * 8).toString() + "px";

    //create Square pieces... should maybe be done in a service?
  	this.squares = [];
  	for (let i=0; i < 8; i++) { //row
  		for (let j=0; j < 8; j++) { //column
  			let col: Color;
  			if(i % 2 === 0) {
  				col = (j % 2 === 0)? Color.White : Color.Black;
  			}
  			else {
  				col = (j % 2 === 1)? Color.White : Color.Black;
  			}
  			this.squares.push(new Square([i, j], col));
  		}
  	}

    this.startGame();

  }

  /**
  Remove the piece by filtering current piece by piece.pos === null.
  Called when boardService moves a pieces to a position.
  Essentially cleans the board
  */
  menuPress(): void {
    this.showMenu = !this.showMenu;
  }

  pieceMoved(item): void {
    this.pieces = this.pieces.filter((piece) => { //clear out any removed pieces
      return piece.pos !== null;
    });
  }

  startGame(): void {
    this.showMenu = false;
    this._gameService.startGame();
    this.pieces = this._gameService.board.findPieces();
  }

  onUiMenuEvent(item: any) {
    console.log("ui special event!");
    console.log(item);
  }
}
