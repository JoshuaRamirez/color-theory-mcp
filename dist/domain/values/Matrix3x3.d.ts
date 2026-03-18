/**
 * 3x3 Matrix for color space transformations.
 *
 * Used for linear transformations between color spaces,
 * particularly RGB to XYZ and vice versa.
 */
export declare class Matrix3x3 {
    readonly values: readonly [
        readonly [number, number, number],
        readonly [number, number, number],
        readonly [number, number, number]
    ];
    private constructor();
    static create(values: readonly (readonly number[])[]): Matrix3x3;
    static identity(): Matrix3x3;
    /**
     * Multiplies this matrix by a 3-element vector.
     * Returns the resulting 3-element vector.
     */
    multiplyVector(vec: readonly [number, number, number]): [number, number, number];
    /**
     * Multiplies this matrix by another matrix.
     */
    multiply(other: Matrix3x3): Matrix3x3;
    /**
     * Returns the inverse of this matrix.
     */
    inverse(): Matrix3x3;
    /**
     * Returns the transpose of this matrix.
     */
    transpose(): Matrix3x3;
    toArray(): number[][];
}
//# sourceMappingURL=Matrix3x3.d.ts.map