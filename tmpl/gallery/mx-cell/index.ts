/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
import $ from '$';
import Table from '../../util/table';
Magix.applyStyle('@../mx-font/style.less');
export default Magix.View.extend({
    tmpl: '@index.html',
    init(data) {
        this.assign(data);
        this['@{owner.node}'] = $('#' + this.id);
    },
    assign(data) {
        this.updater.set({
            props: data.props,
            disabled: data.disabled
        });
        return true;
    },
    render() {
        this.updater.digest();
    },
    '@{set}<click>'(e) {
        let me = this,
            updater = me.updater,
            data = updater.get();
        if (me.updater.get('disabled')) {
            return;
        }
        Table["@{operate.row.or.col}"](data.props, e.params.type);
        me['@{owner.node}'].trigger('change');
    }
});