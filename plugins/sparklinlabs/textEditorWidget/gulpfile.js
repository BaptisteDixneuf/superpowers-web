var gulp = require("gulp");
var tasks = [ "stylus", "copy-cm-modes" ];

// Stylus
var stylus = require("gulp-stylus");
var cssimport = require("gulp-cssimport");
gulp.task("stylus", function() {
  return gulp.src("./widget/**/index.styl").pipe(stylus({ errors: true, compress: true })).pipe(cssimport()).pipe(gulp.dest("./public/widget"));
});

// TypeScript
var ts = require("gulp-typescript");
var tsProject = ts.createProject("./tsconfig.json");

gulp.task("typescript", function() {
  var tsResult = tsProject.src().pipe(ts(tsProject));
  return tsResult.js.pipe(gulp.dest("./"));
});

// Browserify
var browserify = require("browserify");
var vinylSourceStream = require("vinyl-source-stream");
function makeBrowserify(source, destination, output) {
  gulp.task(output + "-browserify", [ "typescript" ], function() {
    var bundler = browserify(source, { standalone: "TextEditorWidget" });
    bundler.transform("brfs");
    function bundle() { return bundler.bundle().pipe(vinylSourceStream(output + ".js")).pipe(gulp.dest(destination)); };
    return bundle();
  });
  tasks.push(output + "-browserify");
}

makeBrowserify("./data/index.js", "./public", "data");
makeBrowserify("./settingsEditors/index.js", "./public", "settingsEditors");
makeBrowserify("./widget/index.js", "./public/widget", "index");

// Copy CodeMirror modes
gulp.task("copy-cm-modes", function() {
  return gulp.src([ "node_modules/codemirror/mode/**/*" ]).pipe(gulp.dest("public/codemirror/mode"));
});

// All
gulp.task("default", tasks);
