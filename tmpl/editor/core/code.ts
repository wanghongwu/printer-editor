/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
import Serializer from '../../cainiao/serializer';
Magix.applyStyle('@code.less');
export default Magix.View.extend({
    tmpl: '@code.html',
    init(data) {
        this['@{stage}'] = data.stage;
        this['@{dialog.entity}'] = data.dialog;
        this['@{enter.fn}'] = data.enter;
    },
    render() {
        let stage = this['@{stage}'];
        let xml = Serializer.encode(stage);
        let old = JSON.stringify(stage.page);
        this['@{old.page}'] = old;
        this.updater.digest({
            xml
        });
    },
    '@{save.code}<change>'(e) {
        this.updater.set({
            xml: e.value
        });
    },
    '@{enter}<click>'() {
        let me = this;
        let xml = me.updater.get('xml');
        let json;
        try {
            json = Serializer.decode(xml);
        } catch (e) {
            me.alert(e.message);
            return;
        }
        if (me['@{old.page}'] != JSON.stringify(json.page)) {
            json.pageChange = true;
        }
        this['@{enter.fn}'](json);
        this['@{dialog.entity}'].close();
    },
    '@{cancel}<click>'() {
        this['@{dialog.entity}'].close();
    }
});