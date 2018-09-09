/*
ver:2.0.3
*/
/*
    author:xinglie.lkf@taobao.com
 */
var Magix = require('magix');
module.exports = Magix.View.extend({
    tmpl: '@prompt.html',
    init(extra) {
        var me = this;
        me['@{dialog}'] = extra.dialog;
        me['@{string.body}'] = extra.body;
        me['@{string.title}'] = extra.title || '提示';
        me['@{fn.enter.callback}'] = extra.enterCallback;
        me['@{fn.calcel.callback}'] = extra.cancelCallback;
    },
    render() {
        var me = this;
        me.updater.digest({
            body: me['@{string.body}'],
            title: me['@{string.title}']
        });
    },
    '@{enter}<click>'() {
        var me = this;
        me['@{dialog}'].close();
        if (me['@{fn.enter.callback}']) {
            let node = Magix.node('ipt_' + me.id);
            Magix.toTry(me['@{fn.enter.callback}'], [node.value.trim()]);
        }
    },
    '@{cancel}<click>'() {
        var me = this;
        me['@{dialog}'].close();
        if (me['@{fn.calcel.callback}']) {
            Magix.toTry(me['@{fn.calcel.callback}']);
        }
    }
});