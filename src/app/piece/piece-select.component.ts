import { Component, OnInit, Input } from '@angular/core';
import { svgIMAGES } from './piece.component';
import { Color, Rank} from '../chess.util';

@Component({
  selector: 'app-piece-select',
  templateUrl: './piece-select.component.html',
  styleUrls: ['./piece-select.component.css']
})
export class PieceSelectComponent implements OnInit {

	@Input() color: Color;
	@Input() rank: Rank;
  @Input() squareSize: number;

  constructor() { }

  ngOnInit() {
  }

  get imgSrc(): string {
    switch(this.rank) {
      case Rank.Pawn:
        return (this.color === Color.White) ? svgIMAGES.White_Pawn : svgIMAGES.Black_Pawn;
      case Rank.Knight:
        return (this.color === Color.White) ? svgIMAGES.White_Knight : svgIMAGES.Black_Knight;
      case Rank.Bishop:
        return (this.color === Color.White) ? svgIMAGES.White_Bishop : svgIMAGES.Black_Bishop;
      case Rank.Rook:
        return (this.color === Color.White) ? svgIMAGES.White_Rook : svgIMAGES.Black_Rook;
      case Rank.Queen:
        return (this.color === Color.White) ? svgIMAGES.White_Queen : svgIMAGES.Black_Queen;
      case Rank.King:
        return (this.color === Color.White) ? svgIMAGES.White_King : svgIMAGES.Black_King;
    }
  }

}
