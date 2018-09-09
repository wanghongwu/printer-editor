import { View } from 'magix';
export default View.extend({
    tmpl: '@index.html',
    init(data) {
        this.assign(data);
    },
    assign(data) {
        let me = this;
        this.updater.set(data.props);
        return data.forceUpdate;
    },
    render() {
        this.updater.digest();
    }
});