![Gow logo](https://repository-images.githubusercontent.com/239176380/cadf1e00-4b78-11ea-8585-bb9c7b6b3038)

[![NPM](https://nodei.co/npm/gow.png?downloads=true&downloadRank=true)](https://nodei.co/npm/gow/)
## Usage

````
Usage: gow [options]

Options:
    -c, --command     The command that should be executed at start and reload
    -f, --files       Glob pattern of files that should trigger a reload
    -s, --silent      Disable console output
    -d, --delay       Minimum delay between the reloads

The options are getting ignored, if a config file exists.
````

## Examples
````shell script
# Listen to all JavaScript files within the directory
gow -f "***/*.js"

# Listen to all JSON and TypeScript files within the directory and make sure the TypeScript files are getting compiled on reload
gow -f "***/*.ts" -f "***/*.json" -c "tsc && node ."
````

## Config
`gow.config.js`
````javascript
// Default config
module.exports = {
    command: "node .",  
    files: ["***/*"],
    silent: false,
    delay: 1000
}
````
