/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
import $ from '$';
import Table from '../../util/table';
Magix.applyStyle('@../mx-font/style.less');
export default Magix.View.extend({
    tmpl: '@focus.html',
    init(data) {
        this.assign(data);
        this['@{owner.node}'] = $('#' + this.id);
    },
    assign(data) {
        this['@{props}'] = data.props;
        this.updater.set({
            disabled: data.disabled
        });
        return true;
    },
    render() {
        this.updater.digest();
    },
    '@{set}<click>'(e) {
        let key = e.params.key;
        let props = this['@{props}'];
        let update = Table["@{move.focus}"](props, key);
        if (update) {
            this['@{owner.node}'].trigger('change');
        }
    }
});