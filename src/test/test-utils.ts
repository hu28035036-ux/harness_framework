import { existsSync } from "node:fs";
import { join } from "node:path";

export const projectRoot = process.cwd();

export function projectPath(...segments: string[]) {
  return join(projectRoot, ...segments);
}

export function expectProjectPath(...segments: string[]) {
  const path = projectPath(...segments);
  if (!existsSync(path)) {
    throw new Error(`Expected project path to exist: ${path}`);
  }
  return path;
}
