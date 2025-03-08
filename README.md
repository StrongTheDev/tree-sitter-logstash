# tree-sitter-logstash

This repository is a parser for Logstash configuration files using the tree-sitter library.

## Test it out
First, make sure that you have tree-sitter installed. If not, you can install it using cargo:

```
cargo install tree-sitter-cli
```

Other installation options are available at [the official tree-sitter website](https://tree-sitter.github.io/tree-sitter/creating-parsers/1-getting-started.html#installation).

Next, clone the repository and run the tree-sitter CLI:

```
git clone https://github.com/danielhuey/tree-sitter-logstash
cd tree-sitter-logstash
tree-sitter generate
tree-sitter parse .\test-file.conf
```

`test-file.conf` is an example configuration file that can be used to test the parser. It contains a simple Logstash configuration that logs messages to the console. Here's an example of what it looks like:

