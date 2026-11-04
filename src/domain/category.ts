import type { NewCategory } from "./types"

export function createCategory(name: string, position: number): NewCategory {
  return { name, position };
}
