import webpack from 'webpack-stream'

export const js = () => {
    return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "JS",
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(webpack({
            mode: app.isDev ? 'development' : 'production',
            output: {
                filename: 'app.min.js',
            }
        }))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.plugins.browsersync.stream());
}
export const jsWP = () => {
    return app.gulp.src(app.path.src.js, { sourcemaps: false })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "JS",
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'app.min.js',
            }
        }))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.gulp.dest(app.path.build.jsWP))
        .pipe(app.plugins.browsersync.stream());
}

export const copyJsLibs = () => {
    return app.gulp.src(app.path.src.jsLibs)
        .pipe(app.gulp.dest(app.path.build.jsLibs))
}
export const jsFormSubmit = () => {
    return app.gulp.src(app.path.src.jsFormSubmit)
        .pipe(app.gulp.dest(app.path.build.js))
}

export const jsFormSubmitWP = () => {
    return app.gulp.src(app.path.src.jsFormSubmit)
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.gulp.dest(app.path.build.jsWP))
}
