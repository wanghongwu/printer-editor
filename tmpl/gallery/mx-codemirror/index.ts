/*
    author:xinglie.lkf@alibaba-inc.com
*/
'top,raw@./vendor/cm.js';
'top,raw@./vendor/mm.js';
'top,raw@./vendor/xml.js';
'top,raw@./vendor/js.js';
'top,raw@./vendor/hm.js';
'top,raw@./vendor/he.js';
import Magix from 'magix';
import $ from '$';
Magix.applyStyle('global@./vendor/cm.css');
export default Magix.View.extend({
    render() {
        let cm = CodeMirror.fromTextArea(Magix.node(this.id), {
            lineNumbers: true,
            mode: 'application/x-ejs',
            lineWrapping: true
        });
        let root = $('#' + this.id);
        cm.on('blur', e => {
            root.trigger({
                type: 'change',
                value: e.getValue()
            });
        });
        this.on('destroy', () => {
            console.log('code mirror destroyed');
            cm.toTextArea();
        });
    }
});