import { View, State } from 'magix';
export default View.extend({
    tmpl: '@index.html',
    init(data) {
        this.assign(data);
    },
    assign(data) {
        this.updater.set(data.props);
        this.updater.set({
            scale: State.get('@{stage&scale}')
        });
        return data.forceUpdate;
    },
    render() {
        this.updater.digest();
    }
});