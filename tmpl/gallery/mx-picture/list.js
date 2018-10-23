let Magix = require('magix');
let $ = require('$');
import I18n from '../../i18n/index';
import Service from '../../service/index';
'ref@./index.less';
Magix.applyStyle('@index.less');
module.exports = Magix.View.extend({
    tmpl: '@list.html',
    mixins: [Service],
    init(data) {
        let me = this;
        me['@{done.callback}'] = data.done;
        me['@{dialog}'] = data.dialog;
    },
    render() {
        let me = this;
        me.fetch({
            name: '@{get.images}',
            params: {
                biz_id: Magix.config('bizId')
            }
        }, (err, bag) => {
            me.updater.digest({
                keyword: '',
                list: bag.get('data', []),
                error: err
            });
        });
    },
    '@{cancel}<click>'() {
        this['@{dialog}'].close();
    },
    '@{enter}<click>'() {
        let url = $('#' + this.id + ' input').val().trim();
        let img = new Image();
        let done = this['@{done.callback}'];
        img.onerror = () => {
            this.alert(I18n('@{property.load.img.error}'));
        };
        img.onload = () => {
            let w = img.width;
            let h = img.height;
            this['@{dialog}'].close();
            done({
                src: url,
                width: w,
                height: h
            });
        };
        img.src = url;
    },
    '@{use}<click>'(e) {
        let me = this;
        let img = new Image();
        let done = me['@{done.callback}'];
        let src = e.params.src;
        img.onerror = () => {
            me.alert(I18n('@{property.load.img.error}'));
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
        img.src = src;
    },
    '@{search}<input>'(e) {
        let me = this;
        clearTimeout(me['@{search.timer}']);
        let updater = me.updater;
        updater.set({
            keyword: e.eventTarget.value
        });
        me['@{search.timer}'] = setTimeout(me.wrapAsync(() => {
            updater.digest();
        }), 300);
    },
    '@{upload.files}'(files) {
        let req = this.request();
        req.all({
            name: '@{file.upload}',
            files,
            params: {
                biz_id: Magix.config('bizId'),
                temp_id: Magix.config('tempId')
            }
        }, (err) => {
            if (err) {
                this.alert(err.msg);
            } else {
                this.render();
            }
        });
    },
    '@{paste.upload}<paste>'(e) {
        e.preventDefault();
        let clipboardData = e.originalEvent.clipboardData;
        let files = [];
        if (clipboardData && clipboardData.items) {
            for (let i of clipboardData.items) {
                if (i.type.indexOf('image/') === 0) {
                    files.push(i.getAsFile());
                }
            }
        }
        if (!files.length) {
            this.alert(I18n('@{paste.unfound.images}'));
            return;
        }
        this['@{upload.files}'](files);
    },
    '@{drop.upload}<drop>'(e) {
        this['@{check.drag.status}'](e.eventTarget);
        let oe = e.originalEvent;
        let files = oe.dataTransfer.files;
        this['@{upload.files}'](files);
    },
    '@{select.upload}<change>'(e) {
        let target = e.eventTarget;
        let files = target.files;
        this['@{upload.files}'](files);
        target.outerHTML = target.outerHTML;
    },
    '@{check.drag.status}'(target) {
        let me = this;
        if (!me['@{user.focused}']) {
            $(target).removeClass('@index.less:s-active');
        }
    },
    '@{drag.leave}<dragleave>'(e) {
        this['@{check.drag.status}'](e.eventTarget);
    },
    '@{drag.enter}<dragenter>'(e) {
        let me = this;
        let userFocused = document.activeElement == e.eventTarget;
        if (!userFocused) {
            $(e.eventTarget).addClass('@index.less:s-active');
            me['@{user.focused}'] = userFocused;
        }
    }
});