/**
 * @file A parser for LogStash Configuration ".conf" files
 * @author Agani Daniel Strong <adhueywilan@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'logstash',

  extras: ($) => [$.whitespace, $.comment],

  conflicts: ($) => [[$.block, $.expression_value]],

  rules: {
    // The entry point of the grammar
    source_file: ($) => repeat($.pipeline),

    pipeline: ($) =>
      choice($.input_section, $.filter_section, $.output_section),

    input_section: ($) => seq('input', '{', repeat($.block), '}'),

    filter_section: ($) => seq('filter', '{', repeat($.section_content), '}'),

    output_section: ($) => seq('output', '{', repeat($.section_content), '}'),

    // New: section_content allows blocks and conditionals at the top level of sections
    section_content: ($) => choice($.block, $.conditional),

    // New: if/else if/else conditional
    conditional: ($) =>
      seq(
        'if',
        $.condition,
        '{',
        repeat($.section_content),
        '}',
        repeat($.else_if),
        optional($.else),
      ),

    else_if: ($) =>
      seq('else', 'if', $.condition, '{', repeat($.section_content), '}'),

    else: ($) => seq('else', '{', repeat($.section_content), '}'),

    // Conditions can be complex - start simple and expand
    condition: ($) =>
      choice(
        $.boolean_condition,
        $.comparison,
        $.regexp_comparison,
        $.inclusion,
        $.not_condition,
        $.condition_value,
      ),

    // For boolean combinations
    boolean_condition: ($) =>
      prec.left(
        seq($.condition, choice('and', 'or', 'xor', 'nand'), $.condition),
      ),

    // Existing comparisons (equality)
    comparison: ($) =>
      prec.left(
        seq(
          $.condition_value,
          choice('==', '!=', '<', '>', '<=', '>='),
          $.condition_value,
        ),
      ),

    // Regexp comparison
    regexp_comparison: ($) =>
      seq($.condition_value, choice('=~', '!~'), $.condition_value),

    // Inclusion
    inclusion: ($) =>
      seq($.condition_value, choice('in', seq('not', 'in')), $.condition_value),

    // Negation
    not_condition: ($) =>
      seq(
        '!',
        choice(
          $.comparison,
          $.regexp_comparison,
          $.inclusion,
          $.condition_value,
        ),
      ),

    condition_value: ($) =>
      choice($.string, $.field_reference, $.plugin_name, $.number, $.boolean),

    // New: field references like [event][module] or [tags]
    field_reference: ($) => repeat1(seq('[', /[^\]]+/, ']')),
    block: ($) => seq($.plugin_name, '{', repeat($.block_content), '}'),

    // anonymous_block: ($) =>
    //   prec(2, seq('{', repeat($.block_content), '}')),

    block_content: ($) => choice(prec(1, $.expression), $.assignment, $.block),
    assignment: ($) => seq($.expression_key, token(prec(-1, '=')), $.expression_value),

    expression: ($) =>
      seq($.expression_key, '=>', choice(prec(1, $.expression_value), $.block)),

    expression_key: ($) => choice($.string, alias($.plugin_name, 'identifier')),

    expression_value: ($) =>
      choice(
        $.string,
        alias($.plugin_name, 'identifier'),
        $.number,
        $.boolean,
        $.array,
        $.hash,
        $.bytes,
      ),

    whitespace: ($) => /\s+/,
    comment: ($) => token(prec(-10, /#[^\r\n]*/)),

    string: ($) => choice($.double_quoted_string, $.single_quoted_string),
    
    double_quoted_string: ($) =>
      seq('"', repeat(choice($.double_quoted_content, $.string_var)), '"'),
    
    single_quoted_string: ($) =>
      seq("'", repeat($.single_quoted_content), "'"),
    
    double_quoted_content: ($) => token(prec(2, /[^"\\%]+|\\./ )),
    single_quoted_content: ($) => token(prec(2, /[^'\\]+|\\./ )),
    string_var: ($) =>
      token(
        choice(
          /%\{\{[^}]+\}\}/, 
          /%\{[^}]+\}/, 
        ),
      ),

    plugin_name: ($) => token(/[a-zA-Z_][a-zA-Z0-9_]*/),
    number: ($) => token(/\d+(\.\d+)?/),
    boolean: ($) => token(choice('true', 'false')),
    bytes: ($) => token(/\d+\s*[kKmMgGtTpPeEzZyY]i?[bB]/),
    hash: ($) => prec(1, seq('{', repeat($.hash_entry), '}')),
    hash_entry: ($) => seq($.expression_key, '=>', $.expression_value),

    array: ($) =>
      seq(
        '[',
        optional(
          seq(
            $.expression_value,
            repeat(seq(',', $.expression_value)),
            optional(','),
          ),
        ),
        ']',
      ),
  },
})
