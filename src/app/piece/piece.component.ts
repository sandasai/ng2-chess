import { Component, OnInit, Input } from '@angular/core';
import { Color, Rank} from '../chess.util';
import { GameService } from '../game/game.service';
import { Piece } from './piece';
import { BoardService } from '../board/board.service'; //for subscribing to movement events

export const IMAGES = {
  White_Pawn : '/images/Pawn.png',
  White_Knight: '/images/Knight.png',
  White_Bishop: '/images/Bishop.png',
  White_Rook: '/images/Rook.png',
  White_Queen: '/images/Queen.png',
  White_King: '/images/King.png',
  Black_Pawn : '/images/Pawn Filled.png',
  Black_Knight: '/images/Knight Filled.png',
  Black_Bishop: '/images/Bishop Filled.png',
  Black_Rook: '/images/Rook Filled.png',
  Black_Queen: '/images/Queen Filled.png',
  Black_King: '/images/King Filled.png'
}

@Component({
  selector: 'app-piece',
  templateUrl: 'piece.component.html',
  styleUrls: ['piece.component.css']
})
export class PieceComponent implements OnInit {

  @Input() piece: Piece;
  windowX: number;
  windowY: number;
  @Input() squareSpacing: number;

  get windowXPx(): string {
    return this.windowX.toString() + "px";
  }
  get windowYPx(): string {
    return this.windowY.toString() + "px";
  }

  constructor(private _boardService: BoardService) { 
    _boardService.pieceMoved$.subscribe((item)=>this.pieceMoved(item));
  }

  /**
  Updates the rendered position of the piece.
  Assumes that the piece object has its position already updated
  */
  pieceMoved(item): void {
    if (Object.keys(item).length === 0)
      return;
    let piece = item.piece;
    let numFrames: number = 40;
    if (piece.pos !== this.piece.pos)
      return;

    //this.setWindowCoordinates();

    let startX: number = item.startPos[1] * this.squareSpacing;
    let startY: number = item.startPos[0] * this.squareSpacing;

    let finalX: number = item.endPos[1] * this.squareSpacing;
    let finalY: number = item.endPos[0] * this.squareSpacing;

    let xInt: number = (finalX - startX) / numFrames;
    let yInt: number = (finalY - startY) / numFrames;
    let count = 0;

    let id = setInterval(() => {
      this.windowX = this.windowX + xInt;
      this.windowY = this.windowY + yInt;
      count += 1;

      if (count >= numFrames) {
        clearInterval(id);
        this.setWindowCoordinates();
      }
    }, 5);

  }

  ngOnInit() {
    this.setWindowCoordinates();
  }

  /**
  Given the set gamePos, sets the instaces' window coordinates (position it should be rendered on screen)
  */
  setWindowCoordinates() {
    this.windowX = this.piece.pos[1] * this.squareSpacing;
    this.windowY = this.piece.pos[0] * this.squareSpacing;
  }
  

  get imgSrc(): string {
    switch(this.piece.rank) {
      case Rank.Pawn:
        return (this.piece.color === Color.White) ? IMAGES.White_Pawn : IMAGES.Black_Pawn;
      case Rank.Knight:
        return (this.piece.color === Color.White) ? IMAGES.White_Knight : IMAGES.Black_Knight;
      case Rank.Bishop:
        return (this.piece.color === Color.White) ? IMAGES.White_Bishop : IMAGES.Black_Bishop;
      case Rank.Rook:
        return (this.piece.color === Color.White) ? IMAGES.White_Rook : IMAGES.Black_Rook;
      case Rank.Queen:
        return (this.piece.color === Color.White) ? IMAGES.White_Queen : IMAGES.Black_Queen;
      case Rank.King:
        return (this.piece.color === Color.White) ? IMAGES.White_King : IMAGES.Black_King;
    }
  }
    
}
