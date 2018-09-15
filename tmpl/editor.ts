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
    seajs.use(['magix', 'i18n/index'], (Magix: Magix, I18n) => {
        let store = window.localStorage;
        let lang = 'zh-cn';
        if (store) {
            lang = store.getItem('l.lang') || lang;
        }
        Magix.config({
            lang
        });
        let i18n = I18n.default;
        Magix.applyStyle('@scoped.style');
        Magix.View.merge({
            ctor() {
                this.updater.set({
                    i18n
                });
            }
        });
        document.title = i18n('@{site.title}');
        Magix.State.on('@{lang.change}', (e: Editor.LangChangeEvent) => {
            document.title = i18n('@{site.title}');
            if (store) {
                store.setItem('l.lang', e.lang);
            }
        });
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