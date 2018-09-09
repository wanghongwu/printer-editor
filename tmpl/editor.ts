//#loader=none;
if (typeof DEBUG == 'undefined') DEBUG = true;
'@./lib/sea.js';
'@./lib/jquery.js';
define('$', (require, exports) => {
    jQuery.__esModule = true;;
    jQuery.default = jQuery;
    return jQuery;
});
'@./lib/magix.js';
$(() => {
    let node = document.getElementById('boot') as HTMLScriptElement;
    let src = node.src.replace('/editor.js', '');
    let Env = {
        cdn: src
    };
    seajs.config({
        paths: {
            element: Env.cdn + '/element',
            editor: Env.cdn + '/editor',
            gallery: Env.cdn + '/gallery',
            util: Env.cdn + '/util'
        }
    });
    seajs.use('magix', (Magix: Magix) => {
        Magix.applyStyle('@scoped.style');
        Magix.boot({
            defaultPath: '/index',
            defaultView: 'editor/index',
            rootId: 'app',
            error(e: Error) {
                setTimeout(() => {
                    throw e;
                }, 0);
            }
        });
    });
});