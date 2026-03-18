/**
 * 3x3 Matrix for color space transformations.
 *
 * Used for linear transformations between color spaces,
 * particularly RGB to XYZ and vice versa.
 */
export class Matrix3x3 {
    values;
    constructor(values) {
        if (values.length !== 3 || values.some(row => row.length !== 3)) {
            throw new Error('Matrix3x3 requires a 3x3 array');
        }
        this.values = [
            [values[0][0], values[0][1], values[0][2]],
            [values[1][0], values[1][1], values[1][2]],
            [values[2][0], values[2][1], values[2][2]],
        ];
    }
    static create(values) {
        // Convert to mutable arrays for internal constructor
        const mutableValues = values.map(row => [...row]);
        return new Matrix3x3(mutableValues);
    }
    static identity() {
        return new Matrix3x3([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ]);
    }
    /**
     * Multiplies this matrix by a 3-element vector.
     * Returns the resulting 3-element vector.
     */
    multiplyVector(vec) {
        return [
            this.values[0][0] * vec[0] + this.values[0][1] * vec[1] + this.values[0][2] * vec[2],
            this.values[1][0] * vec[0] + this.values[1][1] * vec[1] + this.values[1][2] * vec[2],
            this.values[2][0] * vec[0] + this.values[2][1] * vec[1] + this.values[2][2] * vec[2],
        ];
    }
    /**
     * Multiplies this matrix by another matrix.
     */
    multiply(other) {
        const a = this.values;
        const b = other.values;
        return Matrix3x3.create([
            [
                a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
                a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
                a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2],
            ],
            [
                a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
                a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
                a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2],
            ],
            [
                a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
                a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
                a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2],
            ],
        ]);
    }
    /**
     * Returns the inverse of this matrix.
     */
    inverse() {
        const m = this.values;
        const det = m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
            m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
            m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
        if (Math.abs(det) < 1e-10) {
            throw new Error('Matrix is not invertible');
        }
        const invDet = 1 / det;
        return Matrix3x3.create([
            [
                (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
                (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet,
                (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet,
            ],
            [
                (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet,
                (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
                (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet,
            ],
            [
                (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
                (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet,
                (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet,
            ],
        ]);
    }
    /**
     * Returns the transpose of this matrix.
     */
    transpose() {
        return Matrix3x3.create([
            [this.values[0][0], this.values[1][0], this.values[2][0]],
            [this.values[0][1], this.values[1][1], this.values[2][1]],
            [this.values[0][2], this.values[1][2], this.values[2][2]],
        ]);
    }
    toArray() {
        return this.values.map(row => [...row]);
    }
}
//# sourceMappingURL=Matrix3x3.js.map