export enum Color {
  White,
  Black
}

export enum Rank {
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King
}

export enum OrderType {
	Move,
	Remove,
	Add
}

export function oppColor(color: Color) {
  if (color === Color.Black)
    return Color.White;
  if (color === Color.White)
    return Color.Black;
  return null;
}

export function sqAdd(a: [number, number], b: [number, number]): [number, number] {
	return [a[0] + b[0], b[1] + a[1]];
}
export function sqEqual(a: [number, number], b: [number, number]): boolean {
	return (a[0] === b[0]) && (a[1] === b[1]);
}

/**
Returns the distance in terms of square movements it takes from one position to the other.
The directional path includes vertical, horizontal AND diagonal movements
*/
export function sqDist(a: [number, number], b: [number, number]): number {
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
}

/**
Checks to see if all numeric tuples of array b are in array a
*/
export function sqArrInSqArr(a: [number, number][], b: [number, number][]): boolean {
  for (let bPos of b) {
    let foundB: boolean = false;
    for (let aPos of a) {
      if (sqEqual(aPos, bPos)) {
        foundB = true;
      }
    }
    if (!foundB)
      return false;
  }
  return true;
}


/**
Checks to see if any numeric tuples of array b are in array a
*/
export function anySqInSqArr(a: [number, number][], b: [number, number][]): boolean {
  let found: boolean = false;
  for (let bPos of b) {
    for (let aPos of a) {
      if (sqEqual(aPos, bPos)) {
        found = true;
      }
    }
  }
  return found;
}

export function sqColDiff(a: [number, number], b: [number, number]): number {
	return Math.abs(b[1] - a[1]);
}

export interface Selectable {
  selected: boolean;
}

export interface MoveOrder {
  startPos: [number, number];
  endPos: [number, number];
}

export interface BoardOrder {
	orderType: OrderType;
	pos: [number, number];
  endPos?: [number, number];
  rank?: Rank;
  color?: Color;
}