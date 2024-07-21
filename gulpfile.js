import gulp from "gulp";

import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";



import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss, scssWP, copyCssLibs } from "./gulp/tasks/scss.js";
import { normalize } from "./gulp/tasks/scss.js";
import { js, jsWP, jsFormSubmit, jsFormSubmitWP, copyJsLibs } from "./gulp/tasks/js.js";
import { images, favicon } from "./gulp/tasks/images.js";
import {
    otf2ttf,
    ttfToWoff,
    copyWoff,
    fontsStyle,
} from "./gulp/tasks/fonts.js";
import { zip } from "./gulp/tasks/zip.js";
import { json } from "./gulp/tasks/json.js";
import { php } from "./gulp/tasks/php.js";

global.app = {
    isBuild: process.argv.includes("--build"),
    isDev: !process.argv.includes("--build"),
    path: path,
    gulp: gulp,
    plugins: plugins,
};

let isWpDev = false;

function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, isWpDev ? scssWP : scss);
    gulp.watch(path.watch.normalize, normalize);
    gulp.watch(path.watch.js, isWpDev ? jsWP : js);
    gulp.watch(path.watch.jsFormSubmit, isWpDev ? jsFormSubmitWP : jsFormSubmit);
    gulp.watch(path.watch.json, json);
    gulp.watch(path.watch.images, images);
    gulp.watch(path.watch.php, php);
}

const fonts = gulp.series(otf2ttf, ttfToWoff, copyWoff, fontsStyle);

const mainTasks = gulp.series(

    fonts,
    gulp.parallel(copy, html, normalize, scss, copyCssLibs, favicon, js, jsFormSubmit, copyJsLibs, json, images)
);

const wpTasks = gulp.series(
    fonts,
    gulp.parallel(copy, html, normalize, scssWP, copyCssLibs, favicon, jsWP, jsFormSubmitWP, copyJsLibs, json, images)
);

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);

const wpDev = gulp.series(reset, wpTasks, gulp.parallel(() => { isWpDev = true }, watcher, server));

export { dev };
export { build };
export { deployZIP };



gulp.task("default", dev);
gulp.task("wpDev", wpDev);
