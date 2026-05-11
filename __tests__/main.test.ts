import { promises as fs } from "fs";
import * as process from 'process';
import * as core from '@actions/core';
import { replaceTokens } from "../src/replace";
import { MissingVarLog } from "../src/missingVarLog";

let warningMock: jest.SpiedFunction<typeof core.warning>
let errorMock: jest.SpiedFunction<typeof core.error>

describe("basic functionality", () => {
    beforeEach(async () => {
        jest.clearAllMocks();

        errorMock = jest.spyOn(core, 'error').mockImplementation();
        warningMock = jest.spyOn(core, 'warning').mockImplementation();

        await fs.writeFile("test.txt", "hello #{ACTOR}#", "utf8");
        await fs.writeFile("test2.txt", "#{GREETING}# #{ACTOR}#", "utf8");
    })

    afterEach(async () => {
        await fs.unlink("test.txt");
        await fs.unlink("test2.txt");
    })

    test("replaces single token in file", async () => {
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["test.txt"], "", MissingVarLog.Off, "{}");

        const content = await fs.readFile('test.txt', 'utf8');
        expect(content).toBe("hello world");
    });

    test("replaces single token in file specified with glob", async () => {
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["*.txt"], "", MissingVarLog.Off, "{}");

        const content = await fs.readFile('test.txt', 'utf8');
        expect(content).toBe("hello world");

        const content2 = await fs.readFile('test2.txt', 'utf8');
        expect(content2).toBe(" world");
    });

    test("replaces multiple token in file", async () => {
        process.env["GREETING"] = "hallo";
        process.env["ACTOR"] = "welt";
        await replaceTokens("#{", "}#", ["test2.txt"], "", MissingVarLog.Off, "{}");

        const content = await fs.readFile('test2.txt', 'utf8');
        expect(content).toBe("hallo welt");
    });

    test("returns list of changed files", async () => {
        const result = await replaceTokens("#{", "}#", ["*.txt"], "", MissingVarLog.Off, "{}");

        expect(result).toEqual([
            "test.txt", "test2.txt"
        ]);
    });

    test("returns only list of changed files", async () => {
        const result = await replaceTokens("#{", "}#", ["test.txt"], "", MissingVarLog.Off, "{}");

        expect(result).toEqual([
            "test.txt"
        ]);
    });

    test("does not throw when no match", async () => {
        const result = await replaceTokens("#{", "}#", [""], "", MissingVarLog.Off, "{}");

        expect(result).toEqual([]);
    });

    test("does not log missing variable to console when missingVarLog is 'off'", async () => {
        delete process.env["GREETING"];
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["test2.txt"], "", MissingVarLog.Off, "{}");

        const content = await fs.readFile('test2.txt', 'utf8');
        expect(content).toBe(" world");
        expect(warningMock).not.toHaveBeenCalled();
        expect(errorMock).not.toHaveBeenCalled();
    });

    test("logs missing variable warning to console when missingVarLog is 'warn'", async () => {
        delete process.env["GREETING"];
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["test2.txt"], "", MissingVarLog.Warn, "{}");

        const content = await fs.readFile('test2.txt', 'utf8');
        expect(content).toBe(" world");
        expect(warningMock).toHaveBeenCalled();
        expect(errorMock).not.toHaveBeenCalled();
    });

    test("logs missing variable error to console when missingVarLog is 'error'", async () => {
        delete process.env["GREETING"];
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["test2.txt"], "", MissingVarLog.Error, "{}");

        const content = await fs.readFile('test2.txt', 'utf8');
        expect(content).toBe(" world");
        expect(warningMock).not.toHaveBeenCalled();
        expect(errorMock).toHaveBeenCalled();
    });

    test("does not log missing variable to console when missingVarLog is incorrect", async () => {
        delete process.env["GREETING"];
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["test2.txt"], "", 'NONE' as MissingVarLog, "{}");

        const content = await fs.readFile('test2.txt', 'utf8');
        expect(content).toBe(" world");
        expect(warningMock).not.toHaveBeenCalled();
        expect(errorMock).not.toHaveBeenCalled();
    });

    test("replaces token with value from missingVarDefault", async () => {
        delete process.env["GREETING"];
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["test2.txt"], "[MISSING_VALUE]", MissingVarLog.Off, "{}");

        const content = await fs.readFile('test2.txt', 'utf8');
        expect(content).toBe("[MISSING_VALUE] world");
    });
    
    test("replaces token with value from additionalVariables", async () => {
        const additionalVariables = { GREETING: "Hello" };
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["test2.txt"], "", MissingVarLog.Off, additionalVariables);

        const content = await fs.readFile('test2.txt', 'utf8');
        expect(content).toBe("Hello world");
    });
});
