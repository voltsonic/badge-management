# Badge Management


[comment_badge_management_start]: <hidden__do_not_remove>
[![repository badge](badges/repository.png)](https://github.com/voltsonic/badge-management.git)

[comment_badge_management_end]: <hidden__do_not_remove>

a simple approach to badge management in any project (nodejs required)


[comment_badge_management_start]: <hidden__do_not_remove-special>
### Badges

![version badge](badges/version.png)

[comment_badge_management_end]: <hidden__do_not_remove>

- Styles: flat, classic (gradient)
- Hooks into single readme (no requirement for a "template" readme file)

### Install NPM

```bash
npm install --save-dev badge-management
```

### How to setup

1. Include project to your `package.json` via `npm install --save-dev badge-management`

2. Add to your `package.json`

    ```json
    {
      "badges": {
        "injectors": {
          "README.md": [
            {
              "definitions": [
                "repository",
                "version"
              ]
            }
          ]
        },
        "definitions": {
          "version": {
            "type": "package_version"
          },
          "repository": {
            "type": "package_repository_url"
          }
        }
      }
    }
    ```

    - `injectors` are not required and can be removed.
    - `definitions` requires at least 1 entry.

3. If `injectors` is not defined skip to step 4.

    - In each file your injecting add these tags where you want the render to happen.
    
    ```text
    [comment_badge_management_start]: <hidden__do_not_remove>
    [comment_badge_management_end]: <hidden__do_not_remove>
    ```

4. Create a script wherever you would like with the following contents (for example we picked `./scripts/badges.js`.

    ```javascript
    require("badge-management").run();
    ```

5. Execute that script with `node scripts/badges.js` to update your badge files and injectors (if defined).

more about configuration options can be [found here](./README-CONFIGURATION.md)