import $ from '$';
import Magix, { State } from 'magix';
import Elements from '../../element/index';
import * as Dragdrop from '../../gallery/mx-dragdrop/index';
import Service from '../../service/index';
Magix.applyStyle('@toolbox.less');
let DEId = Magix.guid('de_');
let DragEffect = {
    '@{update}'(element) {
        let node = $('#' + DEId);
        if (!node.length) {
            $(document.body).append(`<div class="@toolbox.less:drag-effect" id="${DEId}"/>`);
            node = $('#' + DEId);
        }
        node.html(element.icon);
    },
    '@{show}'(e) {
        let node = $('#' + DEId);
        node.css({
            left: e.pageX + 10,
            top: e.pageY + 18
        });
    },
    '@{hide}'() {
        let node = $('#' + DEId);
        node.css({
            left: -1e3,
            top: -1e3
        });
    }
};
export default Magix.View.extend<Editor.Dragdrop>({
    mixins: [Dragdrop, Service],
    tmpl: '@toolbox.html',
    init() {
        State.on('@{lang.change}', (e: Editor.LangChangeEvent) => {
            this.updater.digest({
                lang: e.lang
            });
        });
    },
    render() {
        this.updater.digest({
            designers: Elements,
            keyword: '',
            preList: []
        });
        this.fetch({
            name: '@{get.components}',
            params: {
                biz_id: Magix.config('bizId')
            }
        }, (err, bag) => {
            let list = bag.get('data', []);
            if (list.length) {
                this.updater.digest({
                    preList: list
                });
            }
        });
    },
    '@{start.drag}<mousedown>'(e: MagixGallery.IViewDOMEvent) {
        let { element, props, pre, name } = e.params;
        DragEffect['@{update}'](element);
        if (pre) {
            if (!props) props = {};
            props.allowEdit = 0;
            //|| props.alias
            props.tip = props.tip || name;
        }
        State.set({
            '@{toolbox&drag.element}': element,
            '@{toolbox&drag.element.props}': props
        });
        let moved = false, hoverNode = null;
        this.dragdrop(e.eventTarget, (event) => {
            DragEffect['@{show}'](event);
            moved = true;
            let n = Dragdrop.fromPoint(event.clientX, event.clientY);
            if (n != hoverNode) {
                hoverNode = n;
                State.fire('@{toolbox&drag.hover.element.change}', {
                    hoverNode
                });
            }
        }, (event) => {
            hoverNode = null;
            State.fire('@{toolbox&drag.hover.element.change}');
            if (!moved) {
                State.fire('@{toolbox&element.clicked}');
                State.set({
                    '@{toolbox&drag.element}': null,
                    '@{toolbox&drag.element.props}': null
                });
                return;
            }
            DragEffect['@{hide}']();
            if (event) {
                let node = Dragdrop.fromPoint(event.clientX, event.clientY);
                State.fire('@{toolbox&drag.element.drop}', {
                    dropNode: node,
                    pageX: event.pageX,
                    pageY: event.pageY
                });
                State.set({
                    '@{toolbox&drag.element}': null,
                    '@{toolbox&drag.element.props}': null
                });
            }
        });
    },
    '@{toggle.collapse}<click>'() {
        let updater = this.updater;
        let collapse = !updater.get('collapse');
        updater.digest({
            collapse
        });
        $(document).trigger({
            type: 'toolboxtoggle',
            collapse
        });
    },
    '@{search}<input>'(e) {
        let me = this;
        clearTimeout(me['@{search.timer}']);
        let updater = me.updater;
        updater.set({
            keyword: e.eventTarget.value
        });
        me['@{search.timer}'] = setTimeout(me.wrapAsync(() => {
            updater.digest();
        }), 300);
    }
});