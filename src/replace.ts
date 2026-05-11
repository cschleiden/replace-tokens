import * as core from "@actions/core";
import { replaceInFile } from "replace-in-file";
import { MissingVarLog } from "./missingVarLog";

export async function replaceTokens(
  tokenPrefix: string,
  tokenSuffix: string,
  files: string[],
  missingVarDefault: string,
  missingVarLog: MissingVarLog,
  additionalVariables: any
) {
  const fromRegEx = new RegExp(
    `${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`,
    "gm"
  );
  const matchRegEx = new RegExp(
    `${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`
  );

  const getVariable = (tokenName: string): string | undefined => {
    return additionalVariables[tokenName] ?? process.env[tokenName]
  }

  const result = await replaceInFile({
    files,
    allowEmptyPaths: true,
    from: fromRegEx,
    to: (match: string) => {
      const m = match.match(matchRegEx);
      if (m) {
        const tokenName = m[1];
        const value = getVariable(tokenName);
        if (!!value) {
          return value;
        }

        if (missingVarLog === MissingVarLog.Error) {
          core.error(`Variable not found: ${tokenName}`);
        } else if (missingVarLog == MissingVarLog.Warn) {
          core.warning(`Variable not found: ${tokenName}`);
        }
      }

      return missingVarDefault;
    }
  });

  return result.filter(r => r.hasChanged).map(r => r.file);
}

function escapeDelimiter(delimiter: string): string {
  return delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
