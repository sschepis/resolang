// ResoLang Monaco Editor Language Support
// Provides syntax highlighting and language configuration

import type { languages } from 'monaco-editor';

export const RESOLANG_LANGUAGE_ID = 'resolang';

export const resolangLanguageConfig: languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"', notIn: ['string'] },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  folding: {
    markers: {
      start: /^\s*(PROGRAM|CONFIG|FUNCTION|EXECUTE|IF|FOR|WHILE|TRY)\b/,
      end: /^\s*}/,
    },
  },
};

export const resolangTokensProvider: languages.IMonarchLanguage = {
  defaultToken: 'invalid',
  tokenPostfix: '.resolang',

  keywords: [
    'PROGRAM', 'CONFIG', 'STATE', 'FUNCTION', 'EXECUTE',
    'IF', 'ELSE', 'FOR', 'WHILE', 'IN', 'RETURN', 'BREAK',
    'TRY', 'CATCH', 'FINALLY', 'USING', 'DEFER',
    'DISTRIBUTE', 'ON', 'WHERE', 'SYNC', 'ACROSS', 'WITH',
    'TOPOLOGY', 'CONSENSUS', 'PAY', 'STAKE', 'REWARD',
    'AND', 'OR', 'NOT',
  ],

  typeKeywords: [
    'INT', 'FLOAT', 'COMPLEX', 'BOOLEAN', 'STRING',
    'QUATERNION', 'PRIMES', 'RESONANCE', 'SUPERPOSITION',
    'REAL', 'IMAG', 'MAGNITUDE', 'PHASE',
    'COLLAPSED_STATE', 'EVOLVED_STATE', 'GATED_STATE',
    'COUPLING', 'STABILITY', 'MEASUREMENT',
  ],

  builtins: [
    'GET_PRIMES', 'COMPUTE_RESONANCE', 'FACTORIZE', 'IS_PRIME',
    'COMPUTE_ENTROPY', 'MEASURE_COHERENCE', 'COMPUTE_ENERGY',
    'CREATE_SUPERPOSITION', 'APPLY_GATE', 'MEASURE', 'COLLAPSE',
    'EVOLVE_PHASE', 'UPDATE_PHASE', 'ADJUST_PHASE',
    'LOG', 'STORE_RESULT', 'AGGREGATE_RESULTS',
    'COMPUTE_PHASE', 'SIGN', 'NOW', 'NORMALIZE',
    'INNER_PRODUCT', 'RESONANCE_COUPLING', 'EVOLVE_WITH_RESONANCE',
    'ANALYZE_RESONANCE_STABILITY', 'PROOF_OF_RESONANCE',
    'RING_TOPOLOGY', 'MESH_TOPOLOGY', 'AGGREGATE_PHASES',
    'COMPUTATIONAL_BASIS', 'ROTATION_Z',
  ],

  constants: [
    'true', 'false', 'PI', 'E', 'null',
  ],

  operators: [
    '=', '==', '!=', '<', '>', '<=', '>=',
    '+', '-', '*', '/', '%', '^',
    '&&', '||', '!',
    '->', ':',
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      // Comments
      [/\/\/.*$/, 'comment'],
      [/\/\*/, 'comment', '@comment'],

      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string'],

      // Numbers
      [/\d+\.\d*([eE][\-+]?\d+)?i?/, 'number.float'],
      [/\.\d+([eE][\-+]?\d+)?i?/, 'number.float'],
      [/\d+[eE][\-+]?\d+i?/, 'number.float'],
      [/\d+i/, 'number.complex'],
      [/\d+/, 'number'],

      // Identifiers and keywords
      [/[A-Z_][A-Z0-9_]*/, {
        cases: {
          '@keywords': 'keyword',
          '@typeKeywords': 'type',
          '@builtins': 'function.builtin',
          '@constants': 'constant',
          '@default': 'identifier',
        },
      }],
      [/[a-z_][a-zA-Z0-9_]*/, {
        cases: {
          '@constants': 'constant',
          '@default': 'variable',
        },
      }],

      // Whitespace
      { include: '@whitespace' },

      // Delimiters and operators
      [/[{}()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': '',
        },
      }],

      // Delimiter
      [/[;,.]/, 'delimiter'],
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment'],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],
  },
};

// Completion items for ResoLang
export const resolangCompletions = [
  // Program structure
  { label: 'PROGRAM', kind: 14, insertText: 'PROGRAM ${1:ProgramName} {\n\t${0}\n}', insertTextRules: 4, detail: 'Define a ResoLang program' },
  { label: 'CONFIG', kind: 14, insertText: 'CONFIG {\n\t${1:key}: ${2:value}\n}', insertTextRules: 4, detail: 'Program configuration block' },
  { label: 'EXECUTE', kind: 14, insertText: 'EXECUTE {\n\t${0}\n}', insertTextRules: 4, detail: 'Main execution block' },
  { label: 'FUNCTION', kind: 3, insertText: 'FUNCTION ${1:name}(${2:params}) -> ${3:ReturnType} {\n\t${0}\n}', insertTextRules: 4, detail: 'Define a function' },

  // Types
  { label: 'QUATERNION', kind: 7, insertText: 'QUATERNION([${1:0,0,0}], ${2:1.0}, [${3:0,0}], [${4:0,0}])', insertTextRules: 4, detail: 'Quaternionic state' },
  { label: 'STATE', kind: 7, insertText: 'STATE ${1:name} = QUATERNION([0,0,0], 1.0, [0,0], [0,0])', insertTextRules: 4, detail: 'State variable' },
  { label: 'PRIMES', kind: 7, insertText: 'PRIMES ${1:name} = GET_PRIMES(${2:100})', insertTextRules: 4, detail: 'Prime number list' },
  { label: 'RESONANCE', kind: 7, insertText: 'RESONANCE ${1:name} = COMPUTE_RESONANCE(${2:2}, ${3:3}, ${4:1.0})', insertTextRules: 4, detail: 'Resonance value' },

  // Built-in functions
  { label: 'GET_PRIMES', kind: 3, insertText: 'GET_PRIMES(${1:100})', insertTextRules: 4, detail: 'Get first N primes' },
  { label: 'COMPUTE_RESONANCE', kind: 3, insertText: 'COMPUTE_RESONANCE(${1:prime1}, ${2:prime2}, ${3:1.0})', insertTextRules: 4, detail: 'Compute prime resonance' },
  { label: 'FACTORIZE', kind: 3, insertText: 'FACTORIZE(${1:number})', insertTextRules: 4, detail: 'Prime factorization' },
  { label: 'IS_PRIME', kind: 3, insertText: 'IS_PRIME(${1:number})', insertTextRules: 4, detail: 'Check if number is prime' },
  { label: 'COMPUTE_ENTROPY', kind: 3, insertText: 'COMPUTE_ENTROPY(${1:state})', insertTextRules: 4, detail: 'Compute state entropy' },
  { label: 'MEASURE_COHERENCE', kind: 3, insertText: 'MEASURE_COHERENCE(${1:state})', insertTextRules: 4, detail: 'Measure state coherence' },
  { label: 'COMPUTE_ENERGY', kind: 3, insertText: 'COMPUTE_ENERGY(${1:state})', insertTextRules: 4, detail: 'Compute state energy' },
  { label: 'LOG', kind: 3, insertText: 'LOG(${1:"message"})', insertTextRules: 4, detail: 'Log output' },
  { label: 'STORE_RESULT', kind: 3, insertText: 'STORE_RESULT("${1:key}", ${2:value})', insertTextRules: 4, detail: 'Store a result' },

  // Control flow
  { label: 'IF', kind: 14, insertText: 'IF ${1:condition} {\n\t${0}\n}', insertTextRules: 4, detail: 'Conditional statement' },
  { label: 'FOR', kind: 14, insertText: 'FOR ${1:i} IN range(${2:10}) {\n\t${0}\n}', insertTextRules: 4, detail: 'For loop' },
  { label: 'WHILE', kind: 14, insertText: 'WHILE ${1:condition} {\n\t${0}\n}', insertTextRules: 4, detail: 'While loop' },

  // Distributed
  { label: 'DISTRIBUTE', kind: 14, insertText: 'DISTRIBUTE ${1:operation} ON ${2:nodes} WHERE ${3:condition}', insertTextRules: 4, detail: 'Distributed execution' },
  { label: 'SYNC', kind: 14, insertText: 'SYNC ${1:phases} ACROSS ${2:nodes}', insertTextRules: 4, detail: 'Synchronize across nodes' },
];

export function registerResoLangLanguage(monaco: typeof import('monaco-editor')) {
  // Register the language
  monaco.languages.register({ id: RESOLANG_LANGUAGE_ID });

  // Set language configuration
  monaco.languages.setLanguageConfiguration(RESOLANG_LANGUAGE_ID, resolangLanguageConfig);

  // Set tokens provider (syntax highlighting)
  monaco.languages.setMonarchTokensProvider(RESOLANG_LANGUAGE_ID, resolangTokensProvider);

  // Register completion provider
  monaco.languages.registerCompletionItemProvider(RESOLANG_LANGUAGE_ID, {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: resolangCompletions.map(item => ({
          ...item,
          range,
          kind: item.kind as any,
          insertTextRules: item.insertTextRules as any,
        })),
      };
    },
  });

  // Register hover provider
  monaco.languages.registerHoverProvider(RESOLANG_LANGUAGE_ID, {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const hoverInfo: Record<string, string> = {
        'PROGRAM': 'Defines a ResoLang program container with name and body.',
        'CONFIG': 'Configuration block for program parameters.',
        'EXECUTE': 'Main execution block where program logic runs.',
        'FUNCTION': 'Defines a reusable function with parameters and return type.',
        'QUATERNION': 'A quaternionic state with position, amplitude, gaussian, and eisenstein coordinates.',
        'STATE': 'Declares a quantum/resonance state variable.',
        'PRIMES': 'A list of prime numbers.',
        'RESONANCE': 'A resonance value between two primes.',
        'GET_PRIMES': 'Returns the first N prime numbers.',
        'COMPUTE_RESONANCE': 'Calculates resonance strength between two primes.',
        'FACTORIZE': 'Returns prime factorization of a number.',
        'IS_PRIME': 'Checks if a number is prime.',
        'COMPUTE_ENTROPY': 'Calculates entropy of a quaternionic state.',
        'MEASURE_COHERENCE': 'Measures coherence level of a state.',
        'COMPUTE_ENERGY': 'Calculates energy of a state.',
        'DISTRIBUTE': 'Distributes computation across network nodes.',
        'SYNC': 'Synchronizes phases across distributed nodes.',
        'CONSENSUS': 'Proof-of-resonance consensus operation.',
        'LOG': 'Outputs a message to the console.',
        'STORE_RESULT': 'Stores a value in the results collection.',
      };

      const info = hoverInfo[word.word];
      if (info) {
        return {
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          },
          contents: [
            { value: `**${word.word}**` },
            { value: info },
          ],
        };
      }

      return null;
    },
  });
}
