// ResoLang Lexer - Tokenizes ResoLang source code

import { Token, TokenType } from './types.js';

const KEYWORDS: Record<string, TokenType> = {
  // Program structure
  'PROGRAM': 'PROGRAM',
  'CONFIG': 'CONFIG',
  'STATE': 'STATE',
  'FUNCTION': 'FUNCTION',
  'EXECUTE': 'EXECUTE',
  // Control flow
  'IF': 'IF',
  'ELSE': 'ELSE',
  'FOR': 'FOR',
  'WHILE': 'WHILE',
  'IN': 'IN',
  'RETURN': 'RETURN',
  'BREAK': 'BREAK',
  // Error handling
  'TRY': 'TRY',
  'CATCH': 'CATCH',
  'FINALLY': 'FINALLY',
  'USING': 'USING',
  'DEFER': 'DEFER',
  // Distributed
  'DISTRIBUTE': 'DISTRIBUTE',
  'ON': 'ON',
  'WHERE': 'WHERE',
  'SYNC': 'SYNC',
  'ACROSS': 'ACROSS',
  'WITH': 'WITH',
  'TOPOLOGY': 'TOPOLOGY',
  'CONSENSUS': 'CONSENSUS',
  // Economy
  'PAY': 'PAY',
  'STAKE': 'STAKE',
  'REWARD': 'REWARD',
  // Variables
  'VAR': 'VAR',
  // Types
  'INT': 'INT',
  'FLOAT': 'FLOAT',
  'COMPLEX': 'COMPLEX',
  'BOOLEAN': 'BOOLEAN',
  'STRING': 'STRING',
  'QUATERNION': 'QUATERNION',
  'PRIMES': 'PRIMES',
  'RESONANCE': 'RESONANCE',
  'SUPERPOSITION': 'SUPERPOSITION',
  'REAL': 'REAL',
  'IMAG': 'IMAG',
  // Note: MAGNITUDE and NORMALIZE are handled as function calls in parseIdentifier
  // 'MAGNITUDE': 'MAGNITUDE',
  'PHASE': 'PHASE',
  // Built-in functions
  'GET_PRIMES': 'GET_PRIMES',
  'COMPUTE_RESONANCE': 'COMPUTE_RESONANCE',
  'FACTORIZE': 'FACTORIZE',
  'IS_PRIME': 'IS_PRIME',
  'COMPUTE_ENTROPY': 'COMPUTE_ENTROPY',
  'MEASURE_COHERENCE': 'MEASURE_COHERENCE',
  'COMPUTE_ENERGY': 'COMPUTE_ENERGY',
  'CREATE_SUPERPOSITION': 'CREATE_SUPERPOSITION',
  'APPLY_GATE': 'APPLY_GATE',
  'MEASURE': 'MEASURE',
  'COLLAPSE': 'COLLAPSE',
  'EVOLVE_PHASE': 'EVOLVE_PHASE',
  'UPDATE_PHASE': 'UPDATE_PHASE',
  'ADJUST_PHASE': 'ADJUST_PHASE',
  'LOG': 'LOG',
  'STORE_RESULT': 'STORE_RESULT',
  'AGGREGATE_RESULTS': 'AGGREGATE_RESULTS',
  // Vector math
  'VECTOR_ADD': 'VECTOR_ADD',
  'SCALE': 'SCALE',
  'DISTANCE': 'DISTANCE',
  'NORMALIZE_TANH': 'NORMALIZE_TANH',
  'GET_EIGENVECTOR': 'GET_EIGENVECTOR',
  'COPY': 'COPY',
  // Boolean literals
  'true': 'BOOLEAN_LITERAL',
  'false': 'BOOLEAN_LITERAL',
  // Logical operators
  'AND': 'AND',
  'OR': 'OR',
  'NOT': 'NOT',
};

export class Lexer {
  private source: string;
  private tokens: Token[] = [];
  private current = 0;
  private line = 1;
  private column = 1;

  constructor(source: string) {
    this.source = source;
  }

  tokenize(): Token[] {
    while (!this.isAtEnd()) {
      this.scanToken();
    }

    this.tokens.push({
      type: 'EOF',
      value: '',
      line: this.line,
      column: this.column,
    });

    return this.tokens;
  }

  private scanToken(): void {
    const c = this.advance();

    switch (c) {
      // Single-character tokens
      case '(': this.addToken('LPAREN', c); break;
      case ')': this.addToken('RPAREN', c); break;
      case '{': this.addToken('LBRACE', c); break;
      case '}': this.addToken('RBRACE', c); break;
      case '[': this.addToken('LBRACKET', c); break;
      case ']': this.addToken('RBRACKET', c); break;
      case ',': this.addToken('COMMA', c); break;
      case ':': this.addToken('COLON', c); break;
      case ';': this.addToken('SEMICOLON', c); break;
      case '.': this.addToken('DOT', c); break;
      case '+': this.addToken('PLUS', c); break;
      case '*': this.addToken('MULTIPLY', c); break;
      case '%': this.addToken('MODULO', c); break;
      case '^': this.addToken('POWER', c); break;
      case '|': this.addToken('MAGNITUDE', c); break;

      // Multi-character tokens
      case '-':
        if (this.match('>')) {
          this.addToken('ARROW', '->');
        } else {
          this.addToken('MINUS', c);
        }
        break;

      case '/':
        if (this.match('/')) {
          // Single-line comment
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
        } else if (this.match('*')) {
          // Multi-line comment
          this.blockComment();
        } else {
          this.addToken('DIVIDE', c);
        }
        break;

      case '=':
        if (this.match('=')) {
          this.addToken('EQ', '==');
        } else {
          this.addToken('ASSIGN', c);
        }
        break;

      case '!':
        if (this.match('=')) {
          this.addToken('NEQ', '!=');
        } else {
          this.addToken('NOT', c);
        }
        break;

      case '<':
        if (this.match('=')) {
          this.addToken('LTE', '<=');
        } else {
          this.addToken('LT', c);
        }
        break;

      case '>':
        if (this.match('=')) {
          this.addToken('GTE', '>=');
        } else {
          this.addToken('GT', c);
        }
        break;

      case '&':
        if (this.match('&')) {
          this.addToken('AND', '&&');
        }
        break;

      // Whitespace
      case ' ':
      case '\r':
      case '\t':
        break;

      case '\n':
        this.line++;
        this.column = 1;
        break;

      // String literals
      case '"':
        this.string();
        break;

      default:
        if (this.isDigit(c)) {
          this.number(c);
        } else if (this.isAlpha(c)) {
          this.identifier(c);
        } else {
          this.addToken('ERROR', c);
        }
        break;
    }
  }

  private string(): void {
    const startColumn = this.column - 1;
    let value = '';

    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      if (this.peek() === '\\') {
        this.advance();
        const escaped = this.advance();
        switch (escaped) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case '"': value += '"'; break;
          case '\\': value += '\\'; break;
          default: value += escaped;
        }
      } else {
        value += this.advance();
      }
    }

    if (this.isAtEnd()) {
      this.tokens.push({
        type: 'ERROR',
        value: 'Unterminated string',
        line: this.line,
        column: startColumn,
      });
      return;
    }

    this.advance(); // Consume closing "
    this.addToken('STRING_LITERAL', value);
  }

  private number(firstDigit: string): void {
    let value = firstDigit;
    let hasDecimal = false;
    let isComplex = false;

    while (this.isDigit(this.peek()) || this.peek() === '.' || this.peek() === 'i') {
      if (this.peek() === '.') {
        if (hasDecimal) break;
        hasDecimal = true;
        value += this.advance();
      } else if (this.peek() === 'i') {
        isComplex = true;
        this.advance(); // Consume 'i'
        break;
      } else {
        value += this.advance();
      }
    }

    this.addToken(isComplex ? 'COMPLEX_LITERAL' : 'NUMBER', value);
  }

  private identifier(firstChar: string): void {
    let value = firstChar;

    while (this.isAlphaNumeric(this.peek()) || this.peek() === '_') {
      value += this.advance();
    }

    const type = KEYWORDS[value] || 'IDENTIFIER';
    this.addToken(type, value);
  }

  private blockComment(): void {
    let depth = 1;
    while (depth > 0 && !this.isAtEnd()) {
      if (this.peek() === '/' && this.peekNext() === '*') {
        this.advance();
        this.advance();
        depth++;
      } else if (this.peek() === '*' && this.peekNext() === '/') {
        this.advance();
        this.advance();
        depth--;
      } else {
        if (this.peek() === '\n') {
          this.line++;
          this.column = 1;
        }
        this.advance();
      }
    }
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    this.column++;
    return this.source[this.current++];
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source[this.current];
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source[this.current + 1];
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;
    this.current++;
    this.column++;
    return true;
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: this.column - value.length,
    });
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
           c === '_';
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }
}

export function tokenize(source: string): Token[] {
  const lexer = new Lexer(source);
  return lexer.tokenize();
}
