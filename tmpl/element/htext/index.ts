import { View, State } from 'magix';
import Convert from '../../util/converter';
export default View.extend({
    tmpl: '@index.html',
    init(data) {
        this.assign(data);
        this.updater.set({
            flexMap: {
                'left': 'flex-start',
                'center': 'center',
                'right': 'flex-end',
                'bottom': 'flex-end',
                'top': 'flex-start',
                'middle': 'center'
            },
            toHTML: Convert["@{pre.to.html}"]
        });
        let update = (e) => {
            this.updater.digest({
                lang: e.lang
            });
        };
        State.on('@{lang.change}', update);
        this.on('destroy', () => {
            State.off('@{lang.change}', update);
        });
    },
    assign(data) {
        this['@{data}'] = data;
        this.updater.set(data.props);
        this.updater.set({
            scale: State.get('@{stage&scale}')
        });
        return data.forceUpdate;
    },
    render() {
        this.updater.digest();
        if (this.updater.get('editable')) {
            let node = $('#area_' + this.id);
            node.focus();
            let range = document.createRange();
            range.selectNodeContents(node[0]);
            range.collapse(false);
            var sel = window.getSelection();
            //判断光标位置，如不需要可删除
            if (sel.anchorOffset != 0) {
                return;
            };
            sel.removeAllRanges();
            sel.addRange(range);
        }
    },
    '@{editing}<input>'(e) {
        let text = Convert["@{html.to.pre}"](e.eventTarget.innerHTML);
        let data = this['@{data}'];
        let { props } = data;
        props.text = text;
    },
    '@{edit.end}<focusout>'(e) {
        let data = this['@{data}'];
        let { id, props } = data;
        props.editable = false;

        State.fire('@{property&element.property.update}');
        State.fire('@{property&element.property.change}', {
            data: props,
            eId: id
        });
        State.fire('@{history&save.snapshot}');
    }
});