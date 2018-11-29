const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const PACKAGE = require('../package.json');
const path = require('path');
const url = require('url');

class PathDetails {
    constructor (filename) {
        const fs = require('fs');
        this.filename = filename;
        this.exists = fs.existsSync(filename);
        this.isDirectory = this.exists ? fs.statSync(filename).isDirectory() : false;
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

export function usage() {
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
}

export default function main(options = {help: true}) {
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
        options.output = '.';
    }
    const p = url.parse(options.url);
    const ext = path.parse(p.path).ext;
    const suffix = (ext != null && ext !== '') ? [] : ['index.html'];
    return path.join(options.output, p.host || '.', p.path, ...suffix);
}

if (require.main === module) {
    const options = commandLineArgs(optionDefinitions);
    const code = main(options);
    if (typeof code === 'number') {
        if (code !== 0) {
            process.exit(code);
        }
    }
}
