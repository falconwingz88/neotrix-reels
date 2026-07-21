import { copyFile, mkdir, readdir, rename } from "node:fs/promises";

const source = new URL("../worker/site-static-worker.js", import.meta.url);
const buildDirectory = new URL("../dist/", import.meta.url);
const clientDirectory = new URL("client/", buildDirectory);
const serverDirectory = new URL("server/", buildDirectory);
const destination = new URL("index.js", serverDirectory);

const buildEntries = await readdir(buildDirectory, { withFileTypes: true });
await mkdir(clientDirectory, { recursive: true });

for (const entry of buildEntries) {
  if (entry.name === "client" || entry.name === "server") continue;
  await rename(new URL(entry.name, buildDirectory), new URL(entry.name, clientDirectory));
}

await mkdir(serverDirectory, { recursive: true });
await copyFile(source, destination);
