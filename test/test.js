
// test tools
import chai from 'chai';
import chaiPromised from 'chai-as-promised';
import chaiIterator from 'chai-iterator';
import chaiString from 'chai-string';
import then from 'promise';
import resumer from 'resumer';
import FormData from 'form-data';
import URLSearchParams_Polyfill from 'url-search-params';
import { URL } from 'whatwg-url';

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const { parse: parseURL, URLSearchParams } = require('url');

let convert;
try { convert = require('encoding').convert; } catch(e) { }

chai.use(chaiPromised);
chai.use(chaiIterator);
chai.use(chaiString);
const expect = chai.expect;

import TestServer from './server';

// test subjects
import main, {
} from '../src/';

const supportToString = ({
	[Symbol.toStringTag]: 'z'
}).toString() === '[object z]';

const local = new TestServer();
const base = `http://${local.hostname}:${local.port}/`;
let url, opts;

before(done => {
	local.start(done);
});

after(done => {
	local.stop(done);
});

describe(require('../package.json').name, () => {
	it('should test', function() {
		expect(main()).to.equal(0);
	});
	it('should convert to index.html', () => {
		{
			const url = 'https://aframe.io/aframe/examples/showcase/anime-UI/';
			const out = 'aframe.io/aframe/examples/showcase/anime-UI/index.html';
			expect(main(url)).to.equal(out);
		}
		{
			const url = 'https://example.com/foo?bar/';
			const out = 'example.com/foo?bar/index.html';
			expect(main(url)).to.equal(out);
		}
	});
	it('should not convert to index.html', () => {
		{
			const url = 'https://example.com/foo?bar';
			const out = 'example.com/foo?bar';
			expect(main(url)).to.equal(out);
		}
		{
			const url = 'https://example.com/foo';
			const out = 'example.com/foo';
			expect(main(url)).to.equal(out);
		}
	});
});
