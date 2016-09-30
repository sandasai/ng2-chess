import { Component, OnInit, Input } from '@angular/core';
import { IMAGES } from './piece.component';
import { Color, Rank} from '../chess.util';

@Component({
  selector: 'app-piece-select',
  templateUrl: './piece-select.component.html',
  styleUrls: ['./piece-select.component.css']
})
export class PieceSelectComponent implements OnInit {

	@Input() color: Color;
	@Input() rank: Rank;

  constructor() { }

  ngOnInit() {
  }

  get imgSrc(): string {
    switch(this.rank) {
      case Rank.Pawn:
        return (this.color === Color.White) ? IMAGES.White_Pawn : IMAGES.Black_Pawn;
      case Rank.Knight:
        return (this.color === Color.White) ? IMAGES.White_Knight : IMAGES.Black_Knight;
      case Rank.Bishop:
        return (this.color === Color.White) ? IMAGES.White_Bishop : IMAGES.Black_Bishop;
      case Rank.Rook:
        return (this.color === Color.White) ? IMAGES.White_Rook : IMAGES.Black_Rook;
      case Rank.Queen:
        return (this.color === Color.White) ? IMAGES.White_Queen : IMAGES.Black_Queen;
      case Rank.King:
        return (this.color === Color.White) ? IMAGES.White_King : IMAGES.Black_King;
    }
  }

}
