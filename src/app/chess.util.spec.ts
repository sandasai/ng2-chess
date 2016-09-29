/* tslint:disable:no-unused-variable */
///<reference path="../../node_modules/@types/jasmine/index.d.ts" />

import { sqArrInSqArr, anySqInSqArr } from './chess.util';

describe('sqArrInSqArr', () => {
  it('should return false if one of the tuples in array b are not found in array a', () => {
    let a: [number, number][] = [ [3, 0], [4, 5], [1, 7] ];
    let b: [number, number][] = [ [4, 5], [12341, 56], [0, 0] ];
    expect(sqArrInSqArr(a, b)).toBeFalsy();
  });

  it('should return true if all of the tuples in array ab are found in array a', () => {
    let a: [number, number][] = [ [3, 0], [4, 5], [1, 7], [7, 4], [3, 5] ];
    let b: [number, number][] = [ [3, 5], [1, 7], [3, 0]];
    expect(sqArrInSqArr(a, b)).toBeTruthy();
  });
});

describe('anySqInSqArr', () => {
  it('should return false if none of the tuples in array b are in array a', () => {
    let a: [number, number][] = [ [3, 0], [4, 5], [1, 7], [7, 4], [3, 5] ];
    let b: [number, number][] = [ [123, 5], [12341, 56], [0, 0], [7, 3] ];
    expect(anySqInSqArr(a, b)).toBeFalsy();
  });

  it('should return true if any of the tuples in array b are in array a', () => {
    let a: [number, number][] = [ [3, 0], [4, 5], [1, 7] ];
    let b: [number, number][] = [ [4, 5], [12341, 56], [0, 0] ];
    expect(anySqInSqArr(a, b)).toBeTruthy();
  });
})