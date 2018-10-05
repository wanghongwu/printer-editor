/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
import Serializer from '../../cainiao/serializer';
import Service from '../../service/index';
Magix.applyStyle('@template.less');
export default Magix.View.extend({
    tmpl: '@template.html',
    mixins: [Service],
    init(data) {
        this['@{page}'] = JSON.stringify(data.page);
        this['@{dialog.entity}'] = data.dialog;
        this['@{enter.fn}'] = data.enter;
    },
    render() {
        this.fetch({
            name: '@{get.templates}',
            params: {
                biz_id: Magix.config('bizId')
            }
        }, (err, bag) => {
            this.updater.digest({
                selected: '-1',
                error: err,
                templates: bag.get('data', [])
            });
        });
    },
    // '@{choose}<click>'(e) {
    //     let t = e.params.t;
    //     this.updater.digest({
    //         selected: t.id,
    //         code: t.code
    //     });
    // },
    '@{enter}<click>'(e) {
        let me = this;
        let xml = e.params.t.code;
        let json;
        try {
            json = Serializer.decode(xml);
            json.xLines = [];
            json.yLines = [];
        } catch (e) {
            me.alert(e.message);
            return;
        }
        if (me['@{page}'] != JSON.stringify(json.page)) {
            json.pageChange = true;
        }
        this['@{enter.fn}'](json);
        this['@{dialog.entity}'].close();
    },
    '@{cancel}<click>'() {
        this['@{dialog.entity}'].close();
    }
});