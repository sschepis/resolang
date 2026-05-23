// ResoLang Validator - Syntax and structure validation

import { tokenize } from './lexer.js';
import type { ValidationResult, ValidationError } from './types.js';

/**
 * Validate ResoLang source code
 * Checks for syntax errors, unmatched braces, and structural issues
 */
export function validate(source: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  try {
    const tokens = tokenize(source);
    
    // Check for basic syntax issues
    let braceCount = 0;
    let parenCount = 0;
    let bracketCount = 0;
    
    for (const token of tokens) {
      if (token.type === 'LBRACE') braceCount++;
      if (token.type === 'RBRACE') braceCount--;
      if (token.type === 'LPAREN') parenCount++;
      if (token.type === 'RPAREN') parenCount--;
      if (token.type === 'LBRACKET') bracketCount++;
      if (token.type === 'RBRACKET') bracketCount--;
      
      if (token.type === 'ERROR') {
        errors.push({
          message: `Unexpected character: ${token.value}`,
          line: token.line,
          column: token.column,
          severity: 'error',
        });
      }
    }
    
    if (braceCount !== 0) {
      errors.push({
        message: `Unmatched braces: ${braceCount > 0 ? 'missing }' : 'extra }'}`,
        line: tokens[tokens.length - 1]?.line || 1,
        column: 1,
        severity: 'error',
      });
    }
    
    if (parenCount !== 0) {
      errors.push({
        message: `Unmatched parentheses: ${parenCount > 0 ? 'missing )' : 'extra )'}`,
        line: tokens[tokens.length - 1]?.line || 1,
        column: 1,
        severity: 'error',
      });
    }
    
    if (bracketCount !== 0) {
      errors.push({
        message: `Unmatched brackets: ${bracketCount > 0 ? 'missing ]' : 'extra ]'}`,
        line: tokens[tokens.length - 1]?.line || 1,
        column: 1,
        severity: 'error',
      });
    }
    
    // Check for PROGRAM structure
    const hasProgram = tokens.some(t => t.type === 'PROGRAM');
    if (!hasProgram && tokens.length > 1) {
      warnings.push({
        message: 'No PROGRAM block found. Consider wrapping code in PROGRAM { ... }',
        line: 1,
        column: 1,
        severity: 'warning',
      });
    }
    
  } catch (error) {
    errors.push({
      message: error instanceof Error ? error.message : String(error),
      line: 1,
      column: 1,
      severity: 'error',
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
