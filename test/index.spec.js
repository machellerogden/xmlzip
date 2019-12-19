'use strict';

import test from 'ava';

const { pipe, pprint, partialRight } = require('../lib/util');

const {
    zipper, arrayZip, xmlZip, node, attr, text, isBranch,
    children, makeNode, path, lefts, rights, down, up,
    isEnd, root, right, rightmost, left, leftmost,
    insertRight, insertLeft, replace, edit, insertChild,
    appendChild, next, prev, remove
} = require('datazip');

const { Parser } = require('../lib/parser');

/**********************************************************************
 * xml zip
 */

test("xml - down, down, right, text", async t =>{
    const tree = await Parser().parse('<a><b>c</b><b z="123">d</b><b><p>e</p><![CDATA[characters with markup]]></b></a>');
    const tz = xmlZip(tree);
    t.deepEqual(pipe(down, down, right, text)(tz), 'd');
});

test("xml - down, down, right, attr 'z'", async t =>{
    const tree = await Parser().parse('<a><b>c</b><b z="123">d</b><b><p>e</p><![CDATA[characters with markup]]></b></a>');
    const tz = xmlZip(tree);
    t.deepEqual(pipe(down, down, right, attr('z'))(tz), '123');
});
