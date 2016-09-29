import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	@Input() widthPx: string;
	@Input() heightPx: string;

	@Output() startGame = new EventEmitter<any>();

  constructor() { 
  }

  ngOnInit() {
  }

  onStartGame() {
  	this.startGame.emit();
  }

}
