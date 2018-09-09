import Magix, { State } from 'magix';
import ClickDesc from './const/click-desc';
import * as Dialog from '../gallery/mx-dialog/index';
import CNC from '../cainiao/const';
import DesignerHistory from './core/history';
//import Elements from '../element/index';
Magix.applyStyle('@index.less');
Magix.View.merge(Dialog);
Magix.View.merge({
    '@{throttle}'(fn, timespan) {
        timespan = timespan || 150;
        let last = Date.now();
        let timer;
        return (...args) => {
            let now = Date.now();
            clearTimeout(timer);
            if (now - last > timespan) {
                last = now;
                fn.apply(this, args);
            } else {
                timer = setTimeout(() => {
                    fn.apply(this, args);
                }, timespan - (now - last));
            }
        };
    }
});
export default Magix.View.extend({
    tmpl: '@index.html',
    init() {
        // this.leaveTip('编辑区有改变且未保存，确认离开吗？', () => {
        //     return true;
        // });
        let stage = {
            page: {
                'xmlns': CNC.CLOUD_PRINT_NAME_SPACE,
                'xmlns:xsi': CNC.XSI_NAME_SPACE,
                'xsi:schemaLocation': CNC.SCHEMA_LOCATION_NAME_SPACE,
                'xmlns:editor': CNC.EDITOR_NAME_SPACE,
                width: CNC.PAGE_WIDTH_DEFAULT * CNC.SCALE_DEFAULT,
                height: CNC.PAGE_HEIGHT_DEFAULT * CNC.SCALE_DEFAULT,
                splitable: false
            },
            '@{stage&scale}': CNC.SCALE_DEFAULT,
            '@{toolbox&drag.element}': null,//工具栏选中的元素
            '@{stage&elements}': [],//画布上展示的元素
            '@{property&hover.active.element}': null,//属性栏鼠标悬停
            '@{stage&select.elements}': [],//画布上选中的元素
            '@{stage&select.elements.map}': {}//画面上选中元素的hashmap
        };
        DesignerHistory["@{set.default}"](stage);
        State.set(stage);
    },
    render() {
        this.updater.digest();
    },
    '$doc<mousedown,mouseup>'(e) {
        let me = this;
        if (e.type == 'mousedown') {
            me['@{last.x}'] = e.pageX;
            me['@{last.y}'] = e.pageY;
        } else {
            let offsetX = e.pageX - me['@{last.x}'];
            let offsetY = e.pageY - me['@{last.y}'];
            if (offsetX > 5 || offsetY > 5) {
                me['@{prevent.click}'] = true;
            }
        }
    },
    '$doc<click>'(e) {
        let me = this;
        if (me['@{prevent.click}']) {
            delete me['@{prevent.click}'];
            return;
        }
        //不考虑删除的节点
        if (Magix.inside(e.target, document.body)) {
            let clickDesc = ClickDesc.OUTER;
            if (Magix.inside(e.target, 'app')) {
                if (Magix.inside(e.target, 'toolbox_list')) {
                    clickDesc = ClickDesc.TOOLBOX;
                    //先不考虑工具栏的点击
                    return;
                } else if (Magix.inside(e.target, 'canvas_' + me.id)) {
                    clickDesc = ClickDesc.CANVAS;
                } else if (Magix.inside(e.target, 'property_' + me.id)) {
                    clickDesc = ClickDesc.PROPERTY;
                }
                State.fire('@{document&clicked}', {
                    zone: clickDesc
                });
            }
        }
    },
    '$doc<toolboxtoggle>'(e) {
        this.updater.digest({
            anim: true,
            collapse: e.collapse
        });
    }
});