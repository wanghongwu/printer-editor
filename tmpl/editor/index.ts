import Magix, { State } from 'magix';
import ClickDesc from './const/click-desc';
import * as Dialog from '../gallery/mx-dialog/index';
import CNC from '../cainiao/const';
import DesignerHistory from './core/history';
import Store from './core/store';
import Elements from '../element/index';
import I18n from '../i18n/index';
const Assign = Magix.mix;
Magix.applyStyle('@index.less');
Magix.View.merge(Dialog, {
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
let ApplyStage = (json: Editor.SnapshotStatus) => {
    let page = State.get('page');
    let elements = State.get('@{stage&elements}');
    let select = State.get('@{stage&select.elements}');
    let xLines = State.get('@{stage&x.help.lines}');
    let yLines = State.get('@{stage&y.help.lines}');
    let { elements: lElements, map } = Elements.byJSON(json.elements);
    if (json.page) {
        Assign(page, json.page);
    }
    elements.length = 0;
    elements.push(...lElements);
    select.length = 0;
    let sMap = {};
    if (json.select) {
        for (let s of json.select) {
            let e = map[s.id];
            if (e) {
                sMap[e.id] = 1;
                select.push(e);
            }
        }
    }
    xLines.length = 0;
    if (json.xLines) {
        xLines.push(...json.xLines);
    }

    yLines.length = 0;
    if (json.yLines) {
        yLines.push(...json.yLines);
    }
    State.set({
        '@{stage&scale}': json.scale || 1,
        '@{stage&select.elements.map}': sMap
    });
};
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
                splitable: true
            },
            '@{stage&scale}': CNC.SCALE_DEFAULT,
            '@{toolbox&drag.element}': null,//工具栏选中的元素
            '@{stage&elements}': [],//画布上展示的元素
            '@{property&hover.active.element}': null,//属性栏鼠标悬停
            '@{stage&select.elements}': [],//画布上选中的元素
            '@{stage&select.elements.map}': {},//画面上选中元素的hashmap
            '@{stage&x.help.lines}': [],
            '@{stage&y.help.lines}': []
        };
        State.set(stage);
        let s = Store["@{read}"]();
        if (s && s.success) {
            ApplyStage(s);
        }
        DesignerHistory["@{save.default}"]();
        State.on('@{stage&apply.stage}', (e: Editor.ApplyStageEvent) => {
            ApplyStage(e.json);
        });
    },
    render() {
        this.updater.digest({
            lang: Magix.config('lang')
        });
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
                if (Magix.inside(e.target, 'toolbox_list') ||
                    Magix.inside(e.target, 'toolbox_prelist') ||
                    Magix.inside(e.target, 'header_btns')) {
                    //clickDesc = ClickDesc.TOOLBOX;
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
    '$doc<drop,dragover>'(e: JQueryEventConstructor) {
        e.preventDefault();
        if (e.type == 'dragover') {
            State.fire('@{toolbox&drag.hover.element.change}', {
                hoverNode: e.target
            });
        } else {
            State.fire('@{toolbox&drag.hover.element.change}');
        }
    },
    '$doc<toolboxtoggle>'(e) {
        this.updater.digest({
            anim: true,
            collapse: e.collapse
        });
    },
    '@{change.lang}<click>'() {
        let lang = Magix.config('lang');
        if (lang == 'zh-cn') {
            lang = 'en-us';
        } else {
            lang = 'zh-cn';
        }
        Magix.config({
            lang
        });
        State.fire('@{lang.change}', { lang });
        this.render();
    },
    '@{save}<click>'() {
        this.alert(I18n('@{developing}'));
    }
});