import Magix, { State, Vframe } from 'magix';
import ClickDesc from './const/click-desc';
import * as Dialog from '../gallery/mx-dialog/index';
import CNC from '../cainiao/const';
import DesignerHistory from './core/history';
import Store from './core/store';
import Elements from '../element/index';
import I18n from '../i18n/index';
import Cursor from './core/cursor';
import Mask from './core/mask';
import Serializer from '../cainiao/serializer';
import Service from '../service/index';
import * as Runner from '../gallery/mx-runner/index';
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
    },
    '@{delay.task}'(start, end, duration, task) {
        let diff = Math.max(duration - (end - start), 16);
        setTimeout(task, diff);
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
const IgnoreProperties = {
    id: 1,
    colIndex: 1,
    rowIndex: 1,
    locked: 1,
    lockSize: 1,
    top: 1,
    left: 1,
    hasLeft: 1,
    hasTop: 1,
    hasBottom: 1,
    hasRight: 1
};
export default Magix.View.extend({
    tmpl: '@index.html',
    mixins: [Service],
    init() {
        window.onbeforeunload = e => {
            if (this['@{is.changed}']()) {
                return I18n('@{change.and.unsaved}');
            }
        };
        State.on('@{stage&apply.stage}', (e: Editor.ApplyStageEvent) => {
            ApplyStage(e.json);
        });
        State.on('@{cursor&update}', (e: Editor.CursorChangeEvent) => {
            if (e.cursor) {
                Cursor["@{show}"](e.cursor);
            } else {
                Cursor["@{hide}"]();
            }
        });
        State.on('@{history&status.change}', () => {
            this['@{cancel.save}'](true);
        });
        this['@{cancel.save}']();
    },
    '@{start.auto.save}'() {
        if (!this['@{save.started}'] && CNC.AUTO_SAVE > 1000) {
            console.log('start');
            this['@{save.started}'] = Date.now();
            let vf = Vframe.get('draft_' + this.id);
            this['@{runner.cb}'] = () => {
                let diff = Date.now() - this['@{save.started}'];
                diff = CNC.AUTO_SAVE - diff;
                if (diff <= 0) {
                    this['@{save.content}'](true);
                } else {
                    vf.invoke('@{update}', [{
                        after: Math.round(diff / 1000)
                    }]);
                }
            };
            Runner['@{task.add}'](1000, this['@{runner.cb}']);
        }
    },
    '@{stop.auto.save}'() {
        console.log('stop');
        clearInterval(this['@{auto.save.timer}']);
        Runner['@{task.remove}'](this['@{runner.cb}']);
        delete this['@{save.started}'];
    },
    '@{cancel.save}'(checkStatus?: boolean) {
        this['@{save.sign}'] = Magix.guid('ss');
        if (checkStatus) {
            let draft = this['@{is.changed}']();
            if (draft) {
                if (!this['@{save.started}']) {
                    let vf = Vframe.get('draft_' + this.id);
                    if (vf) {
                        vf.invoke('@{update}', [{
                            saving: 0,
                            draft,
                            after: Math.round(CNC.AUTO_SAVE / 1000)
                        }]);
                    }
                }
                Store["@{save}"]();
                this['@{start.auto.save}']();
            } else {
                Store["@{clear}"]();
                this['@{stop.auto.save}']();
                let vf = Vframe.get('draft_' + this.id);
                if (vf) {
                    vf.invoke('@{update}', [{
                        saving: 0,
                        draft: 0
                    }]);
                }
            }
        }
    },
    '@{save.content}'(autoSave?: boolean) {
        if (!this['@{is.changed}']()) {
            return;
        }
        let json = {
            page: State.get('page'),
            elements: State.get('@{stage&elements}')
        };
        let sign = this['@{save.sign}'];
        let newXML = Serializer.encode(json);
        let vf = Vframe.get('draft_' + this.id);
        if (vf) {
            vf.invoke('@{update}', [{
                saving: 1,
                draft: 0
            }]);
        }
        let start = Date.now();
        this.save({
            name: '@{save.content}',
            params: {
                temp_id: Magix.config('tempId'),
                content: newXML
            }
        }, (err, bag) => {
            let end = Date.now();
            this['@{delay.task}'](start, end, 300, () => {
                if (sign == this['@{save.sign}']) {
                    this['@{stop.auto.save}']();
                    if (vf) {
                        vf.invoke('@{update}', [{
                            saving: 0,
                            draft: 0,
                            error: err
                        }]);
                    }
                    if (err) {
                        if (!autoSave) {
                            this.alert(I18n('@{save.error}') + err.msg);
                        }
                    } else {
                        Store["@{clear}"]();
                        this['@{xml.content}'] = this['@{get.snapshot}']();
                    }
                }
            });
        });
    },
    '@{is.changed}'() {
        let oldXMLJSON = this['@{xml.content}'];
        let newXMLJSON = this['@{get.snapshot}']();
        return oldXMLJSON != newXMLJSON;
    },
    '@{get.snapshot}'() {
        return JSON.stringify({
            page: State.get('page'),
            elements: State.get("@{stage&elements}")
        }, (a, b) => {
            if (Magix.has(IgnoreProperties, a)) return;
            return b;
        });
    },
    '@{check.store}'() {
        let s = Store["@{read}"]();
        let bizId = Magix.config('bizId');
        let tempId = Magix.config('tempId');
        if (s.success) {
            if (s.bizId == bizId && s.tempId == tempId) {
                this.confirm(I18n('@{find.draft}'), () => {
                    ApplyStage(s);
                    State.fire('@{stage&ui.change}', {
                        keepSelect: 1
                    });
                    State.fire('@{stage&elements.change}');
                    State.fire('@{stage&select.elements.change}');
                    let changed = this['@{is.changed}'];
                    if (changed) {
                        State.fire('@{history&save.snapshot}');
                        let vf = Vframe.get('draft_' + this.id);
                        if (vf) {
                            vf.invoke('@{update}', [{
                                draft: changed
                            }]);
                        }
                    }
                }, () => {
                    Store["@{clear}"]();
                });
            }
        }
    },
    render() {
        let { params } = Magix.parseUrl(location.search);
        let mock = Magix.config('mock');
        let tempId = params.temp_id;
        let bizId = params.biz_id;
        if (mock) {
            tempId = '-1';
            bizId = '-1';
        }
        if (!tempId || !bizId) {
            Mask["@{show}"]('@{missing.init.params}');
        } else {
            Mask["@{show}"]('@{processing}');
        }
        Magix.config({
            tempId,
            bizId
        });
        let stage = {
            page: {
                'xmlns': CNC.CLOUD_PRINT_NAME_SPACE,
                'xmlns:xsi': CNC.XSI_NAME_SPACE,
                'xsi:schemaLocation': CNC.SCHEMA_LOCATION_NAME_SPACE,
                'xmlns:editor': CNC.EDITOR_NAME_SPACE,
                width: CNC.PAGE_WIDTH_DEFAULT * CNC.SCALE_DEFAULT,
                height: CNC.PAGE_HEIGHT_DEFAULT * CNC.SCALE_DEFAULT,
                header: 0,
                footer: 0,
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
        this.updater.digest({
            lang: Magix.config('lang')
        });
        if (tempId && bizId) {
            let start = Date.now();
            this.fetch({
                name: '@{get.content}',
                params: {
                    temp_id: tempId,
                    biz_id: bizId
                }
            }, (err: { msg: string }, bag) => {
                let end = Date.now();
                this['@{delay.task}'](start, end, 500, () => {
                    if (err) {
                        Mask["@{show}"](err.msg);
                    } else {
                        let xml = bag.get('data.content', '');
                        let name = bag.get('data.temp_name', '');
                        this.updater.digest({
                            name
                        });
                        try {
                            let json = Serializer.decode(xml) as Editor.SnapshotStatus;
                            ApplyStage(json);
                            DesignerHistory["@{save.default}"]();
                            State.fire('@{stage&elements.change}');
                            State.fire('@{stage&ui.change}');
                            State.fire('@{stage&select.elements.change}');
                            this['@{xml.content}'] = this['@{get.snapshot}']();
                            this['@{check.store}']();
                            Mask["@{hide}"]();
                        } catch (e) {
                            Mask["@{show}"](e.message);
                        }
                    }
                });
            });
        }
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
        this.updater.digest({
            lang
        });
    },
    '@{save}<click>'() {
        this['@{save.content}']();
    }
});