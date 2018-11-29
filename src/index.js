const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const PACKAGE = require('../package.json');
const path = require('path');
const url = require('url');

class PathDetails {
    constructor (path) {
        const fs = require('fs');
        this.path = path;
        this.exists = fs.existsSync(path);
        this.isDirectory = this.exists ? fs.statSync(path).isDirectory() : false;
    }
}

const optionDefinitions = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Display this usage guide'
    },
    {
        name: 'version',
        type: Boolean,
        description: 'Display version number'
    },
    {
        name: 'url',
        defaultOption: true,
        type: String,
    },
    {
        name: 'output',
        type: filename => new PathDetails(filename)
    },
    // {
    //     name: 'forcewrite',
    //     alias: 'f',
    //     type: Boolean,
    //     description: 'Force write'
    // },
    // {
    //     name: 'debuggable',
    //     alias: 'd',
    //     type: Boolean,
    //     description: 'Debuggable?'
    // },
    // {
    //     name: 'devcert',
    //     alias: 'c',
    //     description: 'Dev certificate to embed',
    //     type: filename => new FileDetails(filename)
    // },
    // {
    //     name: 'sbox',
    //     alias: 's',
    //     description: '4-char sandbox tag',
    //     type: String,
    // },
    // {
    //     name: 'seinfo',
    //     alias: 'i',
    //     description: 'SELinux SEInfo',
    //     type: String,
    // },
    // {
    //     name: 'sentinel',
    //     description: 'Sentinel type',
    //     type: Number,
    // },
    // {
    //     name: 'sentinel-version',
    //     description: 'Sentinel version',
    //     type: Number,
    // },
    // {
    //     name: 'file',
    //     defaultOption: true,
    //     type: filename => new FileDetails(filename)
    // },
];

module.exports = function(...args) {
    return module.exports.main(...args);
};

module.exports.usage = function usage() {
    return commandLineUsage([
        {
            header: `${PACKAGE.name}@${PACKAGE.version}`,
            content: `${PACKAGE.description}`,
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            content: PACKAGE.homepage ? `Project home: {underline ${PACKAGE.homepage}}` : undefined,
        }
    ]);
};

const _shouldAppendIndex = (url) => {
    return url.endsWith('/');
}

module.exports.main = function main(options = {help: true}) {
    const usage = module.exports.usage;
    if (typeof options === 'string') {
        options = {url: options};
    }
    if (options.help) {
        console.log(usage());
        return 0;
    }
    if (options.version) {
        console.log(PACKAGE.version);
        return 0;
    }
    if (options.url == null) {
        console.error('Missing url');
        console.log(usage());
        return 1;
    }
    if (options.output == null) {
        options.output = {path: '.', isDirectory: true, exists: true};
    }
    const p = url.parse(options.url);
    const suffix = _shouldAppendIndex(p.path) ? ['index.html'] : [];
    return path.join(options.output.path, p.host || '.', p.path, ...suffix);
};

module.exports.cli = function() {
    const options = commandLineArgs(optionDefinitions);
    const result = module.exports.main(options);
    if (typeof result === 'number') {
        if (result !== 0) {
            process.exit(result);
        }
    }
    if (result != null) {
        console.log(result);
    }
};
if (require.main === module) {
    module.exports.cli();
}
