import Magix, { State } from 'magix';
import $ from '$';
import * as Monitor from '../../gallery/mx-monitor/index';
import Convert from '../../util/converter';
import CNC from '../../cainiao/const';
import DesignerHistory from '../core/history';
Magix.applyStyle('@toolbar.less');
export default Magix.View.extend({
    tmpl: '@toolbar.html',
    init() {
        let me = this;
        me['@{owner.node}'] = $('#' + me.id);
        let update = me['@{throttle}'](() => {
            me.render();
        }, 100);
        State.on('@{stage&select.elements.change}', update);
        State.on('@{history&status.change}', update);
        Monitor['@{setup}']();
        me.on('destroy', () => {
            Monitor['@{remove}'](me);
            Monitor['@{teardown}']();
        });
        me.updater.set({
            CNC,
            toMM: Convert["@{pixel.to.millimeter}"]
        });
    },
    render() {
        let page = State.get('page');
        this.updater.digest({
            selectCount: State.get('@{stage&select.elements}').length,
            page,
            hs: DesignerHistory["@{query.status}"](),
            scale: State.get('@{stage&scale}')
        });
    },
    '@{inside}'(node) {
        if (Magix.inside(node, 'app')) {
            return Magix.inside(node, 'bg_' + this.id) ||
                Magix.inside(node, 'bgt_' + this.id);
        }
        return true;
    },
    '@{save}<click>'() {
        let elements = State.get('@{stage&elements}');
        let stage = {
            elements,
            page: State.get('page')
        };
        let me = this;
        me.mxDialog('@./code', {
            width: 1100,
            enter(json) {
                if (json.pageChange) {
                    State.set({
                        page: json.page
                    });
                    State.fire('@{stage&ui.change}');
                    me.render();
                }
                let e = State.get('@{stage&elements}');
                e.length = 0;
                e.push.apply(e, json.elements);
                e = State.get('@{stage&select.elements}');
                e.length = 0;
                State.fire('@{stage&elements.change}');
                State.fire('@{stage&select.elements.change}');
                State.fire('@{history&save.snapshot}');
            },
            stage
        });
    },
    '@{show}'() {
        let me = this;
        if (!me['@{bg.shown}']) {
            me['@{bg.shown}'] = true;
            me.updater.digest({
                showBg: true
            });
            Monitor['@{add}'](me);
        }
    },
    '@{hide}'() {
        let me = this;
        if (me['@{bg.shown}']) {
            me['@{bg.shown}'] = false;
            me.updater.digest({
                showBg: false
            });
            Monitor['@{remove}'](me);
        }
    },
    '@{set.stage}<click>'() {
        let me = this;
        if (!me['@{bg.shown}']) {
            me['@{show}']();
        } else {
            me['@{hide}']();
        }
    },
    '@{set.page}<click>'(e) {
        let page = e.params.page;
        let width = Convert["@{millimeter.to.pixel}"](page.width);
        let height = Convert["@{millimeter.to.pixel}"](page.height);
        let pi = this.updater.get('page');
        pi.width = width;
        pi.height = height;
        this.render();
        State.fire('@{stage&ui.change}');
        State.fire('@{history&save.snapshot}');
    },
    '@{set.value}<change,input>'(e) {
        let me = this;
        let key = e.params.key;
        let page = me.updater.get('page');
        let v;
        if (key == 'splitable') {
            v = e.target.checked;
        } else {
            v = e.value === '' ? '' : Convert["@{millimeter.to.pixel}"](e.value);
        }
        page[key] = v;
        me.render();
        State.fire('@{stage&ui.change}');
        if (e.type == 'input') {
            State.fire('@{history&save.snapshot}', {
                key: '@{history&change.page.size}',
                time: 300
            });
        } else {
            State.fire('@{history&save.snapshot}');
        }
    },
    '@{align}<click>'(e) {
        State.fire('@{toolbar&item.click}', {
            action: 'align',
            to: e.params.to
        });
    },
    '@{new}<click>'() {
        let e = State.get('@{stage&elements}');
        if (e.length > 0) {
            this.confirm('确认清空新建？', () => {
                e.length = 0;
                e = State.get('@{stage&select.elements}');
                e.length = 0;
                State.fire('@{stage&elements.change}');
                State.fire('@{stage&select.elements.change}');
            });
            State.fire('@{history&save.snapshot}');
        }
    },
    '@{do.zoom}<click>'(e) {
        let { out } = e.params;
        let step = CNC.SCALE_STEP;
        let scale = State.get('@{stage&scale}');
        let old = scale;
        let changed = false;
        if (out) {
            if (scale > CNC.SCALE_MIN) {
                scale -= step;
                changed = true;
            }
        } else {
            if (scale < CNC.SCALE_MAX) {
                scale += step;
                changed = true;
            }
        }
        if (changed) {
            State.set({
                '@{stage&scale}': scale
            });
            let page = State.get('page');
            page.width = page.width / old * scale;
            page.height = page.height / old * scale;
            this.render();
            State.fire('@{stage&ui.change}', {
                scale: true,
                from: old,
                to: scale
            });
            State.fire('@{history&save.snapshot}');
        }
    },
    '@{set.history}<click>'(e) {
        let { type } = e.params;
        if (type == 'redo') {
            DesignerHistory["@{redo}"]();
        } else {
            DesignerHistory["@{undo}"]();
        }
    }
});