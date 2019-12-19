'use strict';

const expat = require('node-expat')
const he = require('he');

const { isEmpty, pprint } = require('./util');

function Parser() {

    const parser = new expat.Parser('UTF-8')

    function parse(xmlString) {

        return new Promise((resolve, reject) => {

            let depth = 0;
            let tree = { content: [] };
            let stack = [ tree ];
            let cdata = false;

            const cursor = () => stack.length ? stack[stack.length - 1] : stack[0];
            const insert = node => cursor().content.push(node);
            const next = node => stack.push(node);
            const pop = node => stack.pop();

            parser.on('startElement', (tag, attrs) => {
                depth++;
                const node = {
                    tag,
                    attrs: Object.entries(attrs).reduce((acc, [ k, v ]) => {
                        acc[k] = he.decode(v, { isAttributeValue: true });
                        return acc;
                    }, {}),
                    content: []
                };
                insert(node);
                next(node);
            });

            parser.on('endElement', name => (!--depth) ? resolve(tree.content) : pop());
            parser.on('text', text => cursor().text = he.decode(text))
            parser.on('processingInstruction', (target, data) => {});
            parser.on('comment', s => {});
            parser.on('xmlDecl', (version, encoding, standalone) => {});
            parser.on('startCdata', () => { cdata = true; });
            parser.on('endCdata', () => { cdata = false; });
            parser.on('entityDecl', (entityName, isParameterEntity, value, base, systemId, publicId, notationName) => {});
            parser.on('error', e => reject(e));
            parser.write(xmlString);
        });
    }
    return { parse };
}

module.exports = { Parser };
