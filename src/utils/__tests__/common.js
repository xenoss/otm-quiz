import { shuffle, getScore } from '../common';

describe('getScore', () => {
    it('Should get right score for int', () => {
        expect(getScore(5, 5, 5)).toBe(5);
    });
    it('Should get right score for float', () => {
        expect(getScore(15, 30, 5)).toBe(2.5);
    });
});

describe('shuffle', () => {
    it('Should shuffle array without mutation', () => {
        const orig = [1, 2, 3];
        const shuffled = shuffle([1, 2, 3]);
        expect(orig === shuffled).toBe(false);
    });
});
