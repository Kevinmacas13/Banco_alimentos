import { ulid } from "ulid";

export const prefixes = {
    animal: "ani",
    flashcard: "fsh",
} as const;

export function createID(prefix: keyof typeof prefixes): string {
    return [prefixes[prefix], ulid()].join("_");
}