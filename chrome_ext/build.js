const pbjs = require("protobufjs-cli/pbjs");
const fs = require("fs");
const args = "-t static-module -o build/scripts/MigrationPayload.js ../MigrationPayload.proto".split(' ');
pbjs.main(args);

const browserify = require("browserify");

function bundle_file(in_file, out_file) {
    var b = browserify();
    b.add(in_file);
    var rs = b.bundle();
    var ws = fs.createWriteStream(out_file);
    rs.pipe(ws);
}

bundle_file('content_gen.js', 'build/scripts/content.js')
bundle_file('options_gen.js', 'build/scripts/options.js')

