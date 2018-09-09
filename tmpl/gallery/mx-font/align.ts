/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
Magix.applyStyle('@./style.less');
export default Magix.View.extend({
    tmpl: '@align.html',
    init(data) {
        this.assign(data);
    },
    assign(data) {
        this['@{current.value}'] = data.value;
        this.updater.set({
            value: data.value,
            disabled: data.disabled
        });
        return true;
    },
    render() {
        this.updater.digest();
    },
    '@{set}<click>'(e) {
        let me = this;
        if (me.updater.get('disabled')) {
            return;
        }
        let value = me['@{current.value}'];
        let { i, v } = e.params;
        value[i] = v;
        me['@{current.value}'] = value;
        me.updater.digest({
            value
        });
        $('#' + me.id).trigger({
            type: 'input',
            value
        });
    }
});