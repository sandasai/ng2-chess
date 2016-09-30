import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Color, Rank } from '../chess.util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	@Input() widthPx: string;
	@Input() heightPx: string;
  @Input() colorPieceSelect: Color;

	@Output() menuExit = new EventEmitter<any>();

  pieceSelectList: any[];

  constructor() { 
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

  onPieceSelected() {
  	this.menuExit.emit();
  }

}
