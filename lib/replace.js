"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const replace_in_file_1 = __importDefault(require("replace-in-file"));
function replaceTokens(tokenPrefix, tokenSuffix, files) {
    return __awaiter(this, void 0, void 0, function* () {
        const fromRegEx = new RegExp(`${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`, "gm");
        const matchRegEx = new RegExp(`${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`);
        yield replace_in_file_1.default({
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
    });
}
exports.replaceTokens = replaceTokens;
function escapeDelimiter(delimiter) {
    return delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
