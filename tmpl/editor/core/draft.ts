/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
export default Magix.View.extend({
    tmpl: '@draft.html',
    init(data) {
        this.assign(data);
    },
    assign(data) {
        this.updater.set(data);
        return true;
    },
    render() {
        this.updater.digest();
    },
    '@{update}'(data) {
        this.updater.digest(data);
    }
});