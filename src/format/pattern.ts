import { DaisyFormatError } from '../errors';

/** Pattern letters daisy understands (§6.2), each with the widths it may repeat to. */
export const FIELD_SYMBOL = [
  'y',
  'Y',
  'M',
  'L',
  'd',
  'D',
  'E',
  'e',
  'c',
  'w',
  'Q',
  'a',
  'H',
  'h',
  'K',
  'k',
  'm',
  's',
  'S',
] as const;

export type FieldSymbol = (typeof FIELD_SYMBOL)[number];

export type PatternToken =
  | { readonly kind: 'literal'; readonly text: string }
  | { readonly kind: 'field'; readonly symbol: FieldSymbol; readonly width: number };

export type CompiledPattern = {
  readonly tokens: readonly PatternToken[];
  /** True if any field needs a time of day, which a LocalDate doesn't have. */
  readonly usesTime: boolean;
};

const MAXIMUM_WIDTH: Readonly<Record<FieldSymbol, number>> = {
  y: 9,
  Y: 9,
  M: 5,
  L: 5,
  d: 2,
  D: 3,
  E: 6,
  e: 2,
  c: 1,
  w: 2,
  Q: 4,
  a: 1,
  H: 2,
  h: 2,
  K: 2,
  k: 2,
  m: 2,
  s: 2,
  S: 3,
};

const TIME_SYMBOLS: ReadonlySet<FieldSymbol> = new Set(['a', 'H', 'h', 'K', 'k', 'm', 's', 'S']);

const PATTERN_SCANNER = /''|'((?:[^']|'')*)'|([A-Za-z])\2*|[^A-Za-z']+|'/g;

const CACHE_LIMIT = 256;

const compiledPatterns = new Map<string, CompiledPattern>();

const isFieldSymbol = (letter: string): letter is FieldSymbol =>
  FIELD_SYMBOL.includes(letter as FieldSymbol);

/** Internal: turns one scanner match into a token; `match.index` is always set by `matchAll`. */
export const toToken = (match: RegExpMatchArray, pattern: string): PatternToken => {
  const [text, quotedText, letter] = match;
  const index = match.index ?? 0;
  if (text === "''") {
    return { kind: 'literal', text: "'" };
  }
  if (quotedText !== undefined) {
    return { kind: 'literal', text: quotedText.replaceAll("''", "'") };
  }
  if (text === "'") {
    throw new DaisyFormatError(`Unterminated quote at index ${String(index)} in "${pattern}"`);
  }
  if (letter === undefined) {
    return { kind: 'literal', text };
  }
  if (!isFieldSymbol(letter)) {
    throw new DaisyFormatError(
      `Unknown pattern letter "${letter}" at index ${String(index)} in "${pattern}"`,
    );
  }
  if (text.length > MAXIMUM_WIDTH[letter]) {
    throw new DaisyFormatError(
      `Pattern letter "${letter}" repeats ${String(text.length)} times at index ${String(index)} in "${pattern}"; at most ${String(MAXIMUM_WIDTH[letter])} are supported`,
    );
  }
  return { kind: 'field', symbol: letter, width: text.length };
};

const compile = (pattern: string): CompiledPattern => {
  const tokens = [...pattern.matchAll(PATTERN_SCANNER)].map((match) => toToken(match, pattern));
  return {
    tokens,
    usesTime: tokens.some((token) => token.kind === 'field' && TIME_SYMBOLS.has(token.symbol)),
  };
};

/** Compiles `pattern` into tokens once and caches the result; throws `DaisyFormatError` for invalid patterns. */
export const compilePattern = (pattern: string): CompiledPattern => {
  const cachedPattern = compiledPatterns.get(pattern);
  if (cachedPattern !== undefined) {
    return cachedPattern;
  }
  const compiledPattern = compile(pattern);
  if (compiledPatterns.size >= CACHE_LIMIT) {
    compiledPatterns.clear();
  }
  compiledPatterns.set(pattern, compiledPattern);
  return compiledPattern;
};

/** Internal: how many compiled patterns are cached, for tests of the size limit. */
export const cachedPatternCount = (): number => compiledPatterns.size;
