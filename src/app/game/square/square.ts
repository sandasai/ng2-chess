import { Color } from '../../chess.util';

export class Square {
	pos: [number, number];
	color: Color;

	constructor(pos: [number, number], color: Color) {
		this.pos = pos;
		if (pos[0] % 2 === 0) {
			if (pos[1] % 2 === 0) 
				this.color = Color.White;
			else 
				this.color = Color.Black;
		}
		else {
			if (pos[1] % 2 === 0)
				this.color = Color.Black;
			else 
				this.color = Color.White;
		}
	}
}
