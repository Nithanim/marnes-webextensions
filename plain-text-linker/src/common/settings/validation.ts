import type {JsonValue} from "type-fest";

export function bool(def: boolean) {
    return (stored: unknown): boolean => (typeof stored === "boolean" ? stored : def);
}

export function stringEnum<T extends string>(enumType: Record<string, T>, def: T) {
    return (input: unknown): T => {
        const isValid =
            typeof input === "string" &&
            Object.values(enumType)
                .map(entry => entry as string)
                .includes(input);
        return isValid ? (input as T) : def;
    };
}

export function sanitize<T, K extends keyof T = keyof T>(source: Record<K, JsonValue>, spec: Record<K, (x: unknown) => T[K]>): T {
    const destination: Partial<T> = {};

    for (const field of Object.getOwnPropertyNames(spec) as K[]) {
        if (Object.prototype.hasOwnProperty.call(spec, field)) {
            const validator = spec[field];
            const sourceValue = source[field];

            destination[field] = validator(sourceValue);
        }
    }

    return destination as T;
}
