import { world } from "@kcws/world";

export function hello(name?: string): string {
  return `hello ${name ?? world()}`;
}
