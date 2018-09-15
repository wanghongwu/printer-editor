/*
ver:2.0.3
*/
/*
    author:xinglie.lkf@taobao.com
 */
let Magix = require('magix');
import I18n from '../../i18n/index';
module.exports = Magix.View.extend({
    tmpl: '@alert.html:updateby[]',
    init(extra) {
        let me = this;
        me['@{dialog}'] = extra.dialog;
        me['@{string.body}'] = extra.body;
        me['@{string.title}'] = extra.title || I18n('@{dialog.tip}');
        me['@{fn.enter.callback}'] = extra.enterCallback;
    },
    render() {
        let me = this;
        me.updater.digest({
            body: me['@{string.body}'],
            title: me['@{string.title}']
        });
    },
    '@{enter}<click>'() {
        let me = this;
        me['@{dialog}'].close();
        if (me['@{fn.enter.callback}']) {
            Magix.toTry(me['@{fn.enter.callback}']);
        }
    }
});