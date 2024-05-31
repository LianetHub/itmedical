import fileinclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";
import formatHTML from "gulp-format-html";

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
        // .pipe(app.plugins.if(app.isBuild, app.plugins.replace('srcset="img/1x1.webp" data-srcset="img/promo', function handleReplace(match) {
        //     return 'srcset="img/promo';
        // })))
        // .pipe(app.plugins.if(app.isBuild, app.plugins.replace('src="img/1x1.png" data-src="img/promo', function handleReplace(match) {
        //     return 'src="img/promo';
        // })))
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
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browsersync.stream());
};
