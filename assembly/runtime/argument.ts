// assembly/runtime/argument.ts

export class Argument {
    public s: string | null = null;
    public f: f64 = 0;
    public i: i32 = 0;

    isString(): bool {
        return this.s != null;
    }

    isFloat(): bool {
        return this.s == null && this.i == 0;
    }

    isInt(): bool {
        return this.s == null && this.f == 0;
    }

    static fromString(s: string): Argument {
        const arg = new Argument();
        arg.s = s;
        return arg;
    }

    static fromFloat(f: f64): Argument {
        const arg = new Argument();
        arg.f = f;
        return arg;
    }

    static fromInt(i: i32): Argument {
        const arg = new Argument();
        arg.i = i;
        return arg;
    }

    toString(): string {
        if (this.isString()) {
            return this.s!;
        }
        if (this.isFloat()) {
            return this.f.toString();
        }
        return this.i.toString();
    }
}