const assert = require('assert');
const SymmetryArithmetic = require('../arithmetic');

var arithmetic = new SymmetryArithmetic();
var arithmeticAltCycle = new SymmetryArithmetic(false, true);
var arithmeticAltEpoch = new SymmetryArithmetic(false, false, true);
var arithmeticAltCycleEpoch = new SymmetryArithmetic(false, true, true);
var arithmeticAltCycleCalendar = new SymmetryArithmetic(true, true);

var arithmeticAltCalendar = new SymmetryArithmetic(true);

describe('Function tests', () => {
    it('should return 733407', () => {
        assert.strictEqual(arithmetic._priorElapsedDays(2009), 733407);
    });
    it('should return 195', () => {
        assert.strictEqual(arithmetic._gregorianOrdinalDay(2018, 7, 14), 195);
    });
    it('should return true', () => {
        assert.strictEqual(arithmetic._isSymLeapYear(2009), true);
    });
    it('should return false', () => {
        assert.strictEqual(arithmeticAltCycle._isSymLeapYear(2009), false);
    });
    it('should return true', () => {
        assert.strictEqual(arithmeticAltCycle._isSymLeapYear(2010), true);
    })
    it('should return 733776', () => {
        assert.strictEqual(arithmetic._symNewYearDay(2010), 733776);
    });
    it('should return 733769', () => {
        assert.strictEqual(arithmeticAltCycle._symNewYearDay(2010), 733769);
    })
    it('should return 3291', () => {
        assert.strictEqual(arithmeticAltEpoch._symNewYearDay(2010), 3291);
    });
    it('should return 3284', () => {
        assert.strictEqual(arithmeticAltCycleEpoch._symNewYearDay(2010), 3284);
    });
    it('should return 154', () => {
        assert.strictEqual(arithmetic._daysBeforeMonth(6), 154);
    });
    it('should return 152', () => {
        assert.strictEqual(arithmeticAltCalendar._daysBeforeMonth(6), 152);
    });
    it('should return 171', () => {
        assert.strictEqual(arithmetic._symDayOfYear(6, 17), 171);
    });
    it('should return 169', () => {
        assert.strictEqual(arithmeticAltCalendar._symDayOfYear(6, 17), 169);
    });
    it('should return 733500', () => {
        assert.strictEqual(arithmetic._symToFixed(2009, 4, 5), 733500);
    });
    it('should return 733500', () => {
        assert.strictEqual(arithmeticAltCycle._symToFixed(2009, 4, 5), 733500);
    });
    it('should return 733500', () => {
        assert.strictEqual(arithmeticAltCalendar._symToFixed(2009, 4, 5), 733500);
    });
    it('should return 733500', () => {
        assert.strictEqual(arithmeticAltCycleCalendar._symToFixed(2009, 4, 5), 733500);
    });
    it('should be 2009', () => {
        assert.deepStrictEqual(arithmetic._fixedToSymYear(733649), {
            startOfYear: arithmetic._symNewYearDay(2009),
            symYear: 2009
        });
    });
    it('should be 2009', () => {
        assert.deepStrictEqual(arithmetic._fixedToSymYear(733406), {
            startOfYear: arithmetic._symNewYearDay(2009),
            symYear: 2009
        });
    });
    it('should be 2009', () => {
        assert.deepStrictEqual(arithmetic._fixedToSymYear(733774), {
            startOfYear: arithmetic._symNewYearDay(2009),
            symYear: 2009
        });
    });
});

describe('Feature tests', () => {
    let start = arithmetic._gregorianToFixed(1800, 1, 1);
    let end = arithmetic._gregorianToFixed(2500, 1, 1);
    for (let i = start; i < end; i++) {
        it('should be the same (' + (((i - start) * 100) / (end - start)) + '%)', () => {
            let sym = arithmetic._fixedToSym(i);
            assert.strictEqual(arithmetic._symToFixed(sym.symYear, sym.symMonth, sym.symDay), i);
        });
    }
});