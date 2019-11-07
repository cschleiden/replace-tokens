import replace from "replace-in-file";

export async function replaceTokens(tokenPrefix: string, tokenSuffix: string, files: string[]) {
  const fromRegEx = new RegExp(`${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`, "gm");
  const matchRegEx = new RegExp(`${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`);
  await replace({
    files,
    from: fromRegEx,
    to: (match) => {
      const m = match.match(matchRegEx);
      if (m) {
        const tokenName = m[1];
        return process.env[tokenName] || "";
      }

      return "";
    }
  });
}

function escapeDelimiter(delimiter: string): string {
  return delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}