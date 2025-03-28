package tree_sitter_logstash_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_logstash "github.com/StrongTheDev/tree-sitter-logstash/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_logstash.Language())
	if language == nil {
		t.Errorf("Error loading LogStash Configuration grammar")
	}
}
