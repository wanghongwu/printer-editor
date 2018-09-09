let Magix = require('magix');
let $ = require('$');
'ref@./index.less';
Magix.applyStyle('@index.less');
module.exports = Magix.View.extend({
    tmpl: '@list.html',
    init(data) {
        let me = this;
        me['@{done.callback}'] = data.done;
        me['@{dialog}'] = data.dialog;
    },
    render() {
        let me = this;
        me.updater.digest();
    },
    '@{cancel}<click>'() {
        this['@{dialog}'].close();
    },
    '@{enter}<click>'() {
        let url = $('#' + this.id + ' input').val().trim();
        let img = new Image();
        let done = this['@{done.callback}'];
        img.onerror = () => {
            this.alert('加载图片失败，请重试～～');
        };
        img.onload = () => {
            let w = img.width;
            let h = img.height;
            this['@{dialog}'].close();
            done({
                src:url,
                width: w,
                height: h
            });
        };
        img.src = url;
    },
    '@{use}<click>'(e) {
        let me = this;
        let img = new Image();
        let root = Magix.config('picRoot');
        let done = me['@{done.callback}'];
        let src = e.params.src;
        img.onerror = () => {
            me.alert('加载图片失败，请重试～～');
        };
        img.onload = () => {
            let w = img.width;
            let h = img.height;
            me['@{dialog}'].close();
            done({
                src,
                width: w,
                height: h
            });
        };
        img.src = root + src;
    }
});