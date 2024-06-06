import fileinclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";
import formatHTML from "gulp-format-html";
import rename from 'gulp-rename';
import path from 'path';
import through2 from 'through2';
import replace from 'gulp-replace';



function updatePaths() {
    return through2.obj(function (file, _, cb) {


        if (file.isBuffer()) {
            const fileContents = file.contents.toString();
            const newContents = fileContents.replace(/(href|src|srcset)="([^"]+)"/g, (match, p1, p2) => {
                if (!p2.startsWith('/') && !p2.startsWith('http')) {
                    const newPath = path.join('../', p2).replace(/\\/g, '/');
                    return `${p1}="${newPath}"`;
                }
                return match;
            });
            file.contents = Buffer.from(newContents);
        }
        cb(null, file);
    });
}

export const html = () => {
    return app.gulp
        .src(app.path.src.html)
        .pipe(app.plugins.if(app.isBuild, formatHTML()))
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: "HTML",
                    message: "Error: <%= error.message %>",
                })
            )
        )
        .pipe(fileinclude())
        .pipe(app.plugins.replace(/@img\//g, "img/"))
        .pipe(app.plugins.if(app.isBuild, webpHtmlNosvg()))
        .pipe(app.plugins.if(app.isBuild, app.plugins.replace('srcset="img/', function handleReplace(match) {
            return 'srcset="img/1x1.webp"' + ' ' + 'data-' + match;
        })))
        .pipe(app.plugins.if(app.isBuild, app.plugins.replace('src="img/', function handleReplace(match) {
            return 'src="img/1x1.png"' + ' ' + 'data-' + match;
        })))

        .pipe(
            app.plugins.if(
                app.isBuild,
                versionNumber({
                    value: "%DT%",
                    append: {
                        key: "_v",
                        cover: 0,
                        to: ["css", "js"],
                    },
                    output: {
                        file: "gulp/version.json",
                    },
                })
            )
        )
        .pipe(app.plugins.if(app.isBuild, formatHTML()))
        .pipe(app.plugins.if(
            function (file) {
                return file.basename !== 'index.html';
            },
            updatePaths()
        ))
        .pipe(app.plugins.if(
            function (file) {
                return file.basename !== 'index.html';
            },
            rename(function (path) {

                const folderName = path.basename;

                path.dirname = folderName;
                path.basename = 'index';
            })
        ))

        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browsersync.stream());
};
