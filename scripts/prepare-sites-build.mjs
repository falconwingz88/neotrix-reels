import { copyFile, mkdir } from "node:fs/promises";

const source = new URL("../worker/site-static-worker.js", import.meta.url);
const serverDirectory = new URL("../dist/server/", import.meta.url);
const destination = new URL("index.js", serverDirectory);

await mkdir(serverDirectory, { recursive: true });
await copyFile(source, destination);
