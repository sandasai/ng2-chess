import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Color, Rank } from '../chess.util';
import { GameService, UserState } from '../game/game.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() squareSize: number;
  @Input() width: number;
  @Input() height: number;
  colorPieceSelect: Color;

  get playerTurn(): string {
    return this.gameService.playerTurn === Color.White ? 'Black' : 'White';
  }

  get showContent(): string {
    if(this.gameService.userState === UserState.Menu) 
        return 'menu';
    else if (this.gameService.userState === UserState.Checkmate)
        return 'checkmate';
    return null;
  }
  get showPawnPromotion(): boolean {
    return this.gameService.userState === UserState.Menu;
  }

  pieceSelectList: any[]; //List of pieces to render in the menu

  constructor(public gameService: GameService) { 
    this.colorPieceSelect = this.gameService.playerTurn;
  }

  ngOnInit() {
    this.pieceSelectList = [];
    for (var i=0; i < 5; ++i) {
      this.pieceSelectList.push({ color: this.colorPieceSelect });
    }
    this.pieceSelectList[0].rank = Rank.Pawn;
    this.pieceSelectList[1].rank = Rank.Knight;
    this.pieceSelectList[2].rank = Rank.Bishop;
    this.pieceSelectList[3].rank = Rank.Rook;
    this.pieceSelectList[4].rank = Rank.Queen;
  }

  /**
  Event handler for pawn promotion
  */
  onPieceSelected(pieceSelect: any) {
    console.log(Rank[pieceSelect.rank]);
    this.gameService.pawnPromotion(this.gameService.backrowPawnPos, pieceSelect.color, pieceSelect.rank); 
  }

}
