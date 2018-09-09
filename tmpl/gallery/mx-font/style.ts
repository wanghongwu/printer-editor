/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
import $ from '$';
Magix.applyStyle('@style.less');
export default Magix.View.extend({
    tmpl: '@style.html',
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
        let v = me['@{current.value}'];
        let { key } = e.params;
        if (key == 'italic') {
            if (v[0]) {
                v = ['', v[1]];
            } else {
                v = ['italic', v[1]];
            }
        } else {
            if (v[1]) {
                v = [v[0], ''];
            } else {
                v = [v[0], 'underline'];
            }
        }
        me['@{current.value}'] = v;
        me.updater.digest({
            value: v
        });
        $('#' + me.id).trigger({
            type: 'input',
            value: v
        });
    }
});