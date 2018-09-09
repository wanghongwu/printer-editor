/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
import $ from '$';
Magix.applyStyle('@lineheight.less');
export default Magix.View.extend({
    tmpl: '@lineheight.html',
    init(data) {
        this.assign(data);
    },
    assign(data) {
        this['@{current.value}'] = data.value;
        this.updater.set({
            value: data.value,
            min: data.min,
            disabled: data.disabled
        });
        return true;
    },
    render() {
        this.updater.digest();
    },
    '@{update}<input,change>'(e) {
        e.stopPropagation();
        let { from } = e.params;
        let v = e.value;
        let old = this['@{current.value}'];
        let value;
        if (from == 'number') {
            value = [v, old[1]];
        } else {
            value = [old[0], v];
        }
        $('#' + this.id).trigger({
            type: 'input',
            value: this['@{current.value}'] = value
        });
    }
});