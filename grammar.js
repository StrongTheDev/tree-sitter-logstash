/**
 * @file A parser for LogStash Configuration ".conf" files
 * @author Agani Daniel Strong <adhueywilan@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'logstash',
  
  extras: $ => [
    $.whitespace,
    $.comment
  ],
  
  conflicts: $ => [
    [$.block, $.expression_value],
  ],

  rules: {
    // The entry point of the grammar
    source_file: $ => repeat($.pipeline),

    pipeline: $ => choice(
      $.input_section,
      $.filter_section,
      $.output_section
    ),

    input_section: $ => seq(
      'input',
      repeat($.block)
    ),

    filter_section: $ => seq(
      'filter',
      repeat($.block)
    ),

    output_section: $ => seq(
      'output',
      repeat($.block)
    ),

    block: $ => seq(
      optional($.plugin_name),
      '{',
      repeat($.block_content),
      '}'
    ),
    
    block_content: $ => choice(
      prec(1, $.expression),
      $.block
    ),

    expression: $ => seq(
      $.expression_key,
      "=>",
      choice(
        prec(1, $.expression_value),
        $.block
      )
    ),

    expression_key: $ => choice(
      $.string,
      alias($.plugin_name, "identifier")
    ),
    
    expression_value: $ => choice(
      $.string,
      alias($.plugin_name, "identifier"),
      $.number,
      $.boolean,
      $.array
    ),

    whitespace: $ => /[ \t\r\n]+/,
    comment: $ => /#[^\n]*/,

    string: $ => token(/"([^"\\]|\\.)*"/),
    plugin_name: $ => token(/[a-zA-Z_][a-zA-Z0-9_]*/),
    number: $ => token(/\d+(\.\d+)?/),
    boolean: $ => token(choice('true', 'false')),

    array: $ => seq(
      '[',
      repeat(seq($.expression_value, optional(','))),
      ']'
    ),
  }
});
