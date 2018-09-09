import Magix, { State } from 'magix';
import Elements from '../../element/index';
import $ from '$';
import * as Dragdrop from '../../gallery/mx-dragdrop/index';
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
    mixins: [Dragdrop],
    tmpl: '@toolbox.html',
    render() {
        this.updater.digest({
            elements: Elements.list
        });
    },
    '@{start.drag}<mousedown>'(e: MagixGallery.IViewDOMEvent) {
        let element = e.params.element;
        DragEffect['@{update}'](element);
        State.set({
            '@{toolbox&drag.element}': element
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
            if (!moved) {
                State.fire('@{toolbox&element.clicked}');
                State.set({
                    '@{toolbox&drag.element}': null
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
                    '@{toolbox&drag.element}': null
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
    }
});