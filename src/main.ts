import * as core from "@actions/core";
import { replaceTokens } from "./replace";
import { MissingVarLog } from "./missingVarLog";

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

function getMissingVarLog(): MissingVarLog {
    const value = core.getInput("missingVarLog") as MissingVarLog;
    return Object.values(MissingVarLog).includes(value) ? value : MissingVarLog.Off;
}

async function run() {
  try {
    const tokenPrefix = core.getInput("tokenPrefix") || "#{";
    const tokenSuffix = core.getInput("tokenSuffix") || "}#";
    const files = getFiles();
    const missingVarDefault = core.getInput("missingVarDefault") || "";
    const missingVarLog = getMissingVarLog();
    const additionalVariables = JSON.parse(core.getInput("additionalVariables") || "{}");
    const result = await replaceTokens(
      tokenPrefix,
      tokenSuffix,
      Array.isArray(files) ? files : [files],
      missingVarDefault, 
      missingVarLog, 
      additionalVariables
    );
    console.log(`Replaced tokens in files: ${result}`);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
