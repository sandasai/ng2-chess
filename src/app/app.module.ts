import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PieceComponent } from './piece/piece.component';
import { GameComponent } from './game/game.component';
import { BoardService } from './board/board.service';
import { SquareComponent } from './game/square/square.component';
import { GameService } from './game/game.service';
import { MenuComponent } from './menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    SquareComponent,
    PieceComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [BoardService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
