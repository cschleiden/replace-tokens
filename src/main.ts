import * as core from "@actions/core";
import { replaceTokens } from "./replace";

function getFiles(): string[] {
  let files =
    core.getInput("files", {
      required: true,
    }) || "";
  files = files.replace("\\", "\\\\");
  if (files.trim().startsWith("[")) {
    return JSON.parse(files);
  }

  return [files];
}

async function run() {
  try {
    const tokenPrefix = core.getInput("tokenPrefix") || "#{";
    const tokenSuffix = core.getInput("tokenSuffix") || "}#";
    const files = getFiles();
    const result = await replaceTokens(
      tokenPrefix,
      tokenSuffix,
      Array.isArray(files) ? files : [files]
    );
    console.log(`Replaced tokens in files: ${result}`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
}

run();
