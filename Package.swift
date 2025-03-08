// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterLogstash",
    products: [
        .library(name: "TreeSitterLogstash", targets: ["TreeSitterLogstash"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterLogstash",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterLogstashTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterLogstash",
            ],
            path: "bindings/swift/TreeSitterLogstashTests"
        )
    ],
    cLanguageStandard: .c11
)
