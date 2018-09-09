/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
Magix.applyStyle('@code.less');
export default Magix.View.extend({
    tmpl: '@code.html',
    init(data) {
        console.log(data);
        this.updater.set(data);
        this['@{dialog.entity}'] = data.dialog;
        this['@{enter.fn}'] = data.enter;
    },
    render() {
        this.updater.digest();
    },
    '@{save.code}<change>'(e) {
        this.updater.set({
            xml: e.value
        });
    },
    '@{enter}<click>'(e) {
        let xml = this.updater.get('xml');
        this['@{enter.fn}'](xml);
        this['@{dialog.entity}'].close();
    },
    '@{cancel}<click>'() {
        this['@{dialog.entity}'].close();
    }
});