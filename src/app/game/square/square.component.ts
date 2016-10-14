import { Component, OnInit, Input } from '@angular/core';
import { Selectable, Color } from '../../chess.util';
import { Square } from './square';
import { GameService } from '../game.service';

@Component({
  selector: 'app-square',
  templateUrl: 'square.component.html',
  styleUrls: ['square.component.css'],
})
export class SquareComponent implements OnInit, Selectable {
  @Input() square: Square;
  @Input() squareSize: number;
  @Input() squareSpacing: number;
  windowX: number;
  windowY: number;

  selected: boolean = false;

	private whiteSqColor: string = "#FCFCFC";
	private blackSqColor: string = "#72A98F";

  constructor(private _gameService: GameService) { }

  get renderColor(): string {
  	return (this.square.color === Color.White) ? this.whiteSqColor : this.blackSqColor;
  }

  ngOnInit() {
    this.setWindowCoordinates();
  }

  /**
  Given the set gamePos, sets the instaces' window coordinates (position it should be rendered on screen)
  */
  setWindowCoordinates() {
    this.windowX = this.square.pos[1] * this.squareSpacing;
    this.windowY = this.square.pos[0] * this.squareSpacing;
  }

  
  clicked(): void {
    this._gameService.selectPos(this.square.pos, this);
  }
  
}
