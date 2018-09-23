/*
Language: Solidity
Author: Shun (Shunsuke Hondo)
Modified from the original work by: Kaustav Haldar & Age Manning
*/

function (hljs) {

  // Helper variables and functions 
  var IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';

  var NUMBER = {
    className: 'number',
    variants: [
      // jacked from julia.js, should match ethereum addresses too
      { begin: /(\b0x[\d_]*(\.[\d_]*)?|0x\.\d[\d_]*)p[-+]?\d+|\b0[box][a-fA-F0-9][a-fA-F0-9_]*|(\b\d[\d_]*(\.[\d_]*)?|\.\d[\d_]*)([eEfF][-+]?\d+)?/ },
    ],
    relevance: 0
  }

  var getStr = function() {
    return (
      'uint' + Array(256/8).fill().map(function(_, i) {return (i+1)*8}).join(' uint') + ' ' +
      'uint' + Array(256/8).fill().map(function(_, i) {return (i+1)*8}).join('[] uint') + ' ' +
      'int' + Array(256/8).fill().map(function(_, i) {return (i+1)*8}).join(' int') + ' ' +
      'int' + Array(256/8).fill().map(function(_, i) {return (i+1)*8}).join('[] int') + ' ' +
      'bytes' + Array(32).fill().map(function(_, i) {return i+1}).join(' bytes') + ' ' +
      'bytes' + Array(32).fill().map(function(_, i) {return i+1}).join('[] bytes') + ' ' +
      'fixed' + [].concat.apply(
        [], Array(32).fill().map(function(_, i) {
          return Array(81).fill().map(function(_, j) {
            return ((i+1)*8)+'x'+j
          })
        })
      ).join(' fixed') + ' ' +
      'ufixed' + [].concat.apply([], Array(32).fill().map(function(_, i) {return Array(81).fill().map(function(_, j) {return ((i+1)*8)+'x'+j})})).join(' ufixed')
    );
  }

  var KEYWORDS = {
    keyword:
      'anonymous as assembly break constant continue do delete else external for hex if ' +
      'indexed internal import is mapping memory new payable public pragma ' +
      'private pure return returns storage super this throw using view while' +
      'var function event modifier struct enum contract library interface emit ' +
      'abstract after case catch default final in inline let match ' +
      'of relocatable static switch try type typeof'
      ,
    literal: 'true false null constructor',
    built_in:
      'block msg sender tx now suicide selfdestruct addmod mulmod sha3 keccak256 log ' +
      'sha256 ecrecover ripemd160 assert revert require transfer value ' +
      'bytes string address uint int bool byte ' + 
      'bytes[] string[] address[] uint[] int[] bool[] byte[] ' +
      'wei szabo finney ether seconds minutes hours days weeks years ' +
      'returndatacopy call sload sstore mload mstore delegatecall ' +
      getStr()
    }

  var COMMONS = {
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.COMMENT(
      '/\\*', // begin
      '\\*/'), // end 
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      NUMBER
    ],
  }

  var parameters = {
    className: 'params',
    begin: /\(/, end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS,
    contains: COMMONS.contains
  }

  var titlesContract = {
    className: 'title',
    begin: /(?!is\b)\b\w/, // any word that is not 'is'
    end: /[ |\(]/,
    excludeEnd: true,
    endsWithParent: true,
    keywords: KEYWORDS
  }

  var titlesConstructor = {
    className: 'title',
    begin: /[A-Z]/,
    end: /\(/,
    endsWithParent: true,
    excludeEnd: true,
  }

  var functionContainer = [
    hljs.inherit(hljs.TITLE_MODE, {
      begin: IDENT_RE,
      keywords: KEYWORDS.keyword
    }),
    parameters
  ]

  var eventContainer = [
    {
      className: 'literal', // matches more closely atom.
      begin: IDENT_RE
    },
    parameters
  ]

  var FUNC = {
    className: 'function',
    beginKeywords: 'function',
    end: /\{|\;/,
    excludeEnd: true,
    relevance: 0,
    contains: functionContainer,
    keywords: KEYWORDS,
    illegal: /\[|%/
  }

  var EVENT = {
    className: 'class',
    beginKeywords: 'event',
    end: /\;/,
    excludeEnd: true,
    relevance: 10,
    contains: eventContainer,
    illegal: /\[|%/
  }

  var EMIT = {
    className: 'function',
    beginKeywords: 'emit',
    end: /\;/,
    excludeEnd: true,
    relevance: 10,
    contains: eventContainer,
    illegal: /\[|%/
  }

  var CONSTRUCTOR = {
    className: 'function',
    beginKeywords: 'constructor',
    end: /\{/,
    excludeEnd: true,
    relevance: 0,
    keywords: KEYWORDS,
    contains: [
      parameters,
      titlesConstructor
    ],
    illegal: /\[|%/
  }

  var CONTRACT = {
    className: 'function',
    end: /\{/,
    excludeEnd: true,
    relevance: 10,
    keywords: KEYWORDS,
    variants: [
      { beginKeywords: 'contract' },
      { beginKeywords: 'interface' },
      { beginKeywords: 'library' },
      { beginKeywords: 'struct', relevance: 0},
    ],
    contains: [ titlesContract ]
  }


  COMMONS = [].concat.apply(COMMONS.contains, [FUNC, EMIT, EVENT, CONSTRUCTOR, CONTRACT])

  return {
    aliases: ['sol'],
    keywords: KEYWORDS,
    contains: COMMONS
  }
}
