import XCTest
import SwiftTreeSitter
import TreeSitterLogstash

final class TreeSitterLogstashTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_logstash())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading LogStash Configuration grammar")
    }
}
