import { Component, OnInit, Renderer, HostListener } from '@angular/core';
import { SquareComponent } from './square/square.component';
import { Color } from '../chess.util';
import { Square } from './square/square';
import { Piece } from '.././piece/piece';
import { PieceComponent } from '../piece/piece.component';
import { BoardService } from '../board/board.service';
import { GameService, UserState } from './game.service';
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
  squareSpacing: number = 68;
  squareSize: number = 64;

  menuWidthPx: string;
  menuHeightPx: string;

  get menuWidth(): number {
    return this.squareSpacing * 8;
  }
  get menuHeight(): number {
    return this.squareSpacing * 8;
  }
  
  get showMenu(): boolean {
    return this._gameService.userState === UserState.Menu;
  }

  constructor(private _boardService: BoardService, private _gameService: GameService) {
  	_gameService.uiMenuEvent$.subscribe((item) => this.onUiMenuEvent(item));
  }

  ngOnInit() {
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

  menuPress(): void {
    this._gameService.userState = UserState.Menu
  }

  startGame(): void {
    this._gameService.startGame();
    this.pieces = this._boardService.pieces;
  }

  onUiMenuEvent(item: any) {
    console.log("ui special event!");
    console.log(item);
  }
}
