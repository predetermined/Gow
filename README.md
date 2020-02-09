![Gow logo](https://repository-images.githubusercontent.com/239176380/cadf1e00-4b78-11ea-8585-bb9c7b6b3038)

[![NPM](https://nodei.co/npm/gow.png?downloads=true&downloadRank=true)](https://nodei.co/npm/gow/)
## Usage

````shell script
Usage: gow [options]

Options:
    -c, --command     The command that should be executed at start and reload
    -f, --files       Glob pattern of files that should trigger a reload (e.x. '**/*.js')
    -e, --excludes    Comma-seperated list of excluded folders or files
    -s, --silent      Disable console output
    -d, --delay       Minimum delay between the reloads

The options are getting ignored, if a config file exists.
````

## Config
`gow.config.js`
````javascript
// Default config
module.exports = {
    command: "node .",  
    files: "***/*",
    excludes: ["node_modules"],
    silent: false,
    delay: 1000
}
````
