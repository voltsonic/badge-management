### Configuration Formatting

---

##### Global Options

- `after` a callable function. `(valuePulled: string) => string`
    - @parameters
        - `valuePulled` `string` this will be the value that was pulled or given.
    - @return string
        - Return the manipulated value to be replace the `valuePulled` on badge creation.

---

### Generics Types

---

##### Type: Raw

- The default definition. Very basic text based rules.

###### Options
- **Required**
    - `label` the label of the badge.
    - `text` the text of the badge.

```json
{
  "label": "Label",
  "text": "Value"
}
```

---

##### Type: Json Key

- Basic json key value with support for sub-keys.

###### Options
- *Optional*
    - `label`
- **Required**
    - `type` = `json_key` *(do not change)*
    - `file` the json file to read.
    - `key` `string|string[]` points to the key in the json file.
        - `"version"`

            JSON: `{ "version": "v1.0.0" }`
            Value: `v1.0.0`

        - `["sub", "version"]`

            JSON: `{ "sub": { "version": "v1.0.1" } }`
            Value: `v1.0.1`

    - `label` the label of the badge.
    - `text` the text of the badge.

```json
{
  "type": "json_key",
  "file": "package.json",
  "label": "Author",
  "key": "author"
}
```

---

### Custom Types

---

##### Type: NodeJS // package.json Version

- Basic module that creates a badge based on the `package.json` version.

###### Options
- *Optional*
    - `label` replace the default label `app`.
- **Required**
    - `type` = `node_package_version` *(do not change)*

```json
{
  "type": "package_version"
}
```

---

##### Type: NodeJS // package.json repository url.

- Basic module that creates a badge based on the `package.json` `repository.url` key.
- Auto sets up the url for clickable badge.
- Sets the badge `text` to the hostname of the repository.
- Strips any odd pre-text (example: `git+https://github.com/...` to `https://github.com/...`)

###### Options
- *Optional*
    - `label` replace the default label `repo`.
- **Required**
    - `type` = `package_version` *(do not change)*

```json
{
  "type": "package_version"
}
```
