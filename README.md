# Replace tokens

Simple GitHub Action to replace tokens in files.

## Inputs

- `files` - Glob expression, file name or array of glob/file name
- `tokenPrefix` - Prefix to use when matching tokens, defaults to `#{`
- `tokenSuffix` - Suffix to use when matching tokens, defaults to `}#`
- `missingVarDefault` - The default value to use when a variable is not found, defaults to `""`
- `missingVarLog` - The level to log variable not found messages. Accepted values `off`, `warn`, `error`, defaults to `off`
- `additionalVariables` - A JSON formatted string containing additional variable values, defaults to `"{}"`

## Example

If you want to replace `#{CDN}#` and `#{CALLBACK}#` in all of your JS files, add the action to your workflow like this:

```yml
- uses: cschleiden/replace-tokens@v1
  with:
    files: '["**/*.js"]'
  env:
    CDN: https://somecdn.com/...
    CALLBACK: some_value
```

If you want to use a different token format, you can specify a custom token prefix/suffix. For example, to replace just tokens like `{CDN}` you could add:

```yml
- uses: cschleiden/replace-tokens@v1
  with:
    tokenPrefix: '{'
    tokenSuffix: '}'
    files: '["**/*.js"]'
  env:
    CDN: https://somecdn.com/...
```

# Acknowledgements

- Inspired by the excellent https://marketplace.visualstudio.com/items?itemName=qetza.replacetokens Azure Pipelines task.
- Uses [replace-in-file](https://github.com/adamreisnz/replace-in-file) to do the actual replacement
