import * as core from '@actions/core';
import { replaceTokens } from "./replace";

async function run() {
  try {
    const tokenPrefix = core.getInput("tokenPrefix") || "#{";
    const tokenSuffix = core.getInput("tokenPrefix") || "}#";
    const files = JSON.parse(core.getInput("files", {
      required: true
    }));
    if (typeof files !== "string" && !Array.isArray(files)) {
      throw new Error("`files` needs to be a string or an array")
    }

    const result = await replaceTokens(tokenPrefix, tokenSuffix, Array.isArray(files) ? files : [files]);

    console.log(`Replaced tokens in files: ${result}`)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
