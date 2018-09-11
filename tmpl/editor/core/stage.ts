import Magix, { State, Vframe, View } from 'magix';
import $ from '$';
import ClickDesc from '../const/click-desc';
import * as Dragdrop from '../../gallery/mx-dragdrop/index';
import Convert from '../../util/converter';
import Keys from '../const/keys';
import { StageSelectElements, StageElements, Clipboard } from './workaround';
import DesignerHistory from './history';
import Store from './store';
//import UIDesc from '../const/ui-desc';
//const ToFloat = Convert["@{to.float}"];


// let TransformPoint = (x, y, m1a, m1b, m2a, m2b) => {
//     return {
//         x: m1a * x + m2a * y,
//         y: m1b * x + m2b * y
//     };
// };
// let GetMatrixByDeg = deg => {
//     return {
//         m1a: Math.cos(Math.PI / 180 * deg),
//         m1b: Math.sin(Math.PI / 180 * deg),
//         m2a: -Math.sin(Math.PI / 180 * deg),
//         m2b: Math.cos(Math.PI / 180 * deg)
//     };
// };
// let GetDegPoint = (x, y, deg) => {
//     let m = GetMatrixByDeg(deg);
//     return TransformPoint(x, y, m.m1a, m.m1b, m.m2a, m.m2b);
// };
// let RectIntersect = (rect1, rect2) => {
//     return Math.abs((rect1.left.x + rect1.right.x) / 2 -
//         (rect2.left.x + rect2.right.x) / 2) <
//         ((rect1.right.x + rect2.right.x - rect1.left.x - rect2.left.x) / 2) &&
//         Math.abs((rect1.top.y + rect1.bottom.y) / 2 -
//             (rect2.top.y + rect2.bottom.y) / 2) <
//         ((rect1.bottom.y + rect2.bottom.y - rect1.top.y - rect2.top.y) / 2);
// };
// let GetSelectedElements = (elementLocations, rect) => {
//     let selected = [];
//     for (let e of elementLocations) {
//         if (RectIntersect(e, rect)) {
//             selected.push(e.element);
//         }
//     }
//     return selected;
// };
Magix.applyStyle('@stage.less');
export default View.extend<Editor.Dragdrop>({
    mixins: [Dragdrop],
    tmpl: '@stage.html',
    init() {
        let me = this;
        let updateElements = (e) => {
            let elements = State.get('@{stage&elements}');
            if (e && e.scale) {
                StageElements["@{scale.by.step}"](e.from, e.to);
                me.updater.set({
                    elements
                });
            } else {
                me.updater.digest({
                    elements
                });
            }
        };
        State.on('@{history&save.snapshot}', (e: Editor.HistorySaveSanpshotEvent) => {
            if (e.key) {
                DesignerHistory["@{save}"](e.key, e.time);
            } else {
                DesignerHistory["@{save}"]();
            }
        });
        State.on('@{history&status.change}', () => {
            let elements = State.get('@{stage&elements}');
            me.updater.set({
                elements
            });
            me.render();
            Store["@{save}"]();
        });
        State.on('@{stage&ui.change}', (e: Editor.StageScaleEvent) => {
            if (e.scale) {
                updateElements(e);
            } else {
                StageSelectElements['@{set}']();
            }
            me.render();
        });
        State.on('@{stage&elements.change}', updateElements);
        State.on('@{document&clicked}', (e: Editor.ClickedZoneEvent) => {
            if (e.zone != ClickDesc.CANVAS &&
                e.zone != ClickDesc.PROPERTY) {
                StageSelectElements['@{set}']();
            }
        });
        let lastHover = null;
        State.on('@{toolbox&drag.hover.element.change}', (e: Editor.ToolboxToStageHoverElementChangeEvent) => {
            let node = e.hoverNode;
            if (Magix.inside(node, 'stage_stage')) {
                let td = StageElements["@{get.best.cell}"](node);
                if (!td || td.dashed != lastHover) {
                    if (lastHover) {
                        lastHover.addClass('@scoped.style:none');
                    }
                }
                if (td && td.dashed && td.dashed != lastHover) {
                    lastHover = $(td.dashed);
                    lastHover.removeClass('@scoped.style:none');
                }
            }
        });
        State.on('@{toolbox&drag.element.drop}', (e: Editor.ToolboxStageDropEvent) => {
            if (Magix.inside(e.dropNode, 'stage_stage')) {
                lastHover = null;
                let td = StageElements["@{get.best.cell}"](e.dropNode);
                let elements = StageElements["@{add.element}"](e, false, td);
                if (elements) {
                    me.updater.digest({
                        elements
                    });
                }
            }
        });
        State.on('@{toolbox&element.clicked}', () => {
            let scale = State.get('@{stage&scale}');
            let stage = $('#stage_stage');
            let offset = stage.offset();
            let rnd = Math.random() * 80 * scale;
            let e = {
                pageX: offset.left + rnd + me['@{owner.node}'].prop('scrollLeft'),
                pageY: offset.top + rnd + me['@{owner.node}'].prop('scrollTop')
            };
            let elements = StageElements["@{add.element}"](e, true);
            if (elements) {
                me.updater.digest({
                    elements
                });
            }
        });
        State.on('@{toolbar&item.click}', e => {
            me['@{cmd.action}'](e);
        });

        State.on('@{stage&lock.scroll}', (e: Editor.ScrollLockEvent) => {
            let bar = $('#stayBar');
            let scroll = $('#app_stage');
            if (e.locked) {
                let width = scroll.prop('scrollWidth') + 100;
                let height = scroll.prop('scrollHeight') + 100;
                let page = State.get('page');
                bar.css({
                    height,
                    width,
                    marginTop: -(page.height + 100),
                    display: 'block'
                });
            } else {
                bar.hide();
            }
        });
        me.updater.set({
            elements: State.get('@{stage&elements}')
        });
        me['@{owner.node}'] = $('#' + me.id);
    },
    render() {
        let page = State.get('page');
        let me = this;
        me.updater.digest({
            width: page.width,
            height: page.height
        });
    },
    '@{start.drag}<mousedown>'(e) {
        let me = this,
            nodeId = e.target.id;
        if (nodeId == `stage_outer` ||
            nodeId == `stage_stage` ||
            nodeId == 'cx_' + me.id) {
            let bak = null;
            if (!e.shiftKey) {
                StageSelectElements['@{set}']();
            } else {
                bak = {};
                let old = StageSelectElements['@{all}']();
                for (let e of old) {
                    bak[e.id] = 1;
                }
            }
            let beginXY = Convert["@{real.to.outer.coord}"]({
                x: e.pageX,
                y: e.pageY
            });
            let modifier = Vframe.get('m_' + me.id);
            let moved = false;
            let finished = false;
            let elementLocations = StageElements["@{get.elements.location}"]();
            me.dragdrop(e.eventTarget, me['@{throttle}'](evt => {
                if (finished) return;
                moved = true;
                let currentXY = Convert["@{real.to.outer.coord}"]({
                    x: evt.pageX,
                    y: evt.pageY
                });
                modifier.invoke('@{drag.rect}', [beginXY, currentXY]);

                let width = Math.abs(beginXY.x - currentXY.x);
                let height = Math.abs(beginXY.y - currentXY.y);
                let left = Math.min(beginXY.x, currentXY.x);
                let top = Math.min(beginXY.y, currentXY.y);
                let rect = Convert["@{outer.to.stage}"]({
                    x: left,
                    y: top
                }) as {
                        x: number,
                        y: number,
                        width?: number,
                        height?: number
                    };
                rect.width = width;
                rect.height = height;
                let elements = StageElements["@{get.intersect.elements}"](elementLocations, rect, bak);
                let ids = JSON.stringify(elements, ['id']);
                if (ids != me['@{last.ids}']) {
                    me['@{last.ids}'] = ids;
                    StageSelectElements['@{set.all}'](elements);
                }
            }, 50), () => {
                if (moved) {
                    delete me['@{last.ids}'];
                    finished = true;
                    modifier.invoke('@{drag.end}');
                }
            });
        }
    },
    '@{element.start.drag}<mousedown>'(e) {
        if (e.from == 'element_table') return;
        StageElements["@{select.or.move.elements}"](e, this);
    },
    '@{stage.keydown}<keydown>'(e: KeyboardEvent) {
        let target = e.target;
        if ($(target).data('role') == 'text-element') {
            return;
        }
        if (!e.metaKey &&
            !e.shiftKey &&
            !e.altKey &&
            !e.ctrlKey) {
            console.log(e.keyCode);
            if (e.keyCode == Keys.L ||
                e.keyCode == Keys.R ||
                e.keyCode == Keys.U ||
                e.keyCode == Keys.D ||
                e.keyCode == Keys.T ||
                e.keyCode == Keys.B) {
                State.fire('@{stage&move.table.focus}', {
                    key: e.keyCode
                });
            }
        }
        let elements = StageSelectElements['@{all}']();
        let stageElements = State.get('@{stage&elements}');
        if (e.keyCode == Keys.TAB) {
            e.preventDefault();
            StageElements["@{handle.key.tab}"](e);
            return;
        }
        if (elements.length) {
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                let changed = false, propsChanged = false;
                if (e.keyCode == Keys.DELETE) {
                    changed = true;
                    StageElements["@{delete.select.elements}"]();
                } else {
                    let step = e.shiftKey ? 10 : 1;
                    for (let m of elements) {
                        if (!m.props.locked) {
                            if (e.keyCode == Keys.UP) {
                                propsChanged = true;
                                m.props.y -= step;
                            } else if (e.keyCode == Keys.DOWN) {
                                propsChanged = true;
                                m.props.y += step;
                            } else if (e.keyCode == Keys.LEFT) {
                                propsChanged = true;
                                m.props.x -= step;
                            } else if (e.keyCode == Keys.RIGHT) {
                                propsChanged = true;
                                m.props.x += step;
                            }
                        }
                        if (propsChanged) {
                            let vf = Vframe.get(m.id);
                            if (vf) {
                                if (vf.invoke('assign', m)) {
                                    vf.invoke('render');
                                }
                            }
                        }
                    }
                }
                if (propsChanged || changed) {
                    if (changed) {
                        elements.length = 0;
                    }
                    State.fire('@{property&element.property.update}');
                    State.fire('@{history&save.snapshot}', {
                        key: '@{history&move.elements.by.keyboard}',
                        time: 300
                    });
                }
                if (changed) {
                    this.updater.digest({
                        elements: stageElements
                    });
                }
            } else if (e.ctrlKey || e.metaKey) {
                if (e.keyCode == Keys.C) {
                    e.preventDefault();
                    Clipboard["@{copy.elements}"]();
                }
            }
        }
        if ((e.ctrlKey || e.metaKey)) {
            if (e.keyCode == Keys.V) {
                e.preventDefault();
                let stage = StageElements["@{get.nearest.stage}"]();
                Clipboard["@{paste.elements}"](stage);
                State.fire('@{history&save.snapshot}');
            } else if (e.keyCode == Keys.A) {
                e.preventDefault();
                let stage = StageElements["@{get.nearest.stage}"]();
                if (stage.coll.length) {
                    StageElements["@{select.all}"](stage.coll);
                }
            } else if (e.keyCode == Keys.X) {
                e.preventDefault();
                Clipboard["@{cut.elements}"]();
            } else if (e.keyCode == Keys.Z) {
                e.preventDefault();
                if (e.shiftKey) {
                    DesignerHistory["@{redo}"]();
                } else {
                    DesignerHistory["@{undo}"]();
                }
            } else if (e.keyCode == Keys.Y) {
                e.preventDefault();
                DesignerHistory["@{redo}"]();
            }
        }
    },
    '@{cmd.action}'(e: Editor.ToolbarAlignActionEvent) {
        if (e.action == 'align') {
            let me = this;
            let node = $('#' + me.id);
            let pos = node.offset();
            let elements = StageSelectElements['@{all}']();
            let maxRight = -Number.MAX_SAFE_INTEGER;
            let minLeft = Number.MAX_SAFE_INTEGER;
            let minTop = Number.MAX_SAFE_INTEGER;
            let maxBottom = -Number.MAX_SAFE_INTEGER;
            let minVCenter = Number.MAX_SAFE_INTEGER;
            let minHCenter = Number.MAX_SAFE_INTEGER;
            for (let m of elements) {
                let n = $('#' + m.id + ' [mx-view]>*')[0];
                let bound = n.getBoundingClientRect();
                if (e.to == 'right') {
                    if (bound.right > maxRight) {
                        maxRight = bound.right;
                    }
                } else if (e.to == 'left') {
                    if (bound.left < minLeft) {
                        minLeft = bound.left;
                    }
                } else if (e.to == 'top') {
                    if (bound.top < minTop) {
                        minTop = bound.top;
                    }
                } else if (e.to == 'bottom') {
                    if (bound.bottom > maxBottom) {
                        maxBottom = bound.bottom;
                    }
                } else if (e.to == 'vcenter') {
                    let half = (bound.bottom - bound.top) / 2;
                    if ((bound.top + half) < minVCenter) {
                        minVCenter = bound.top + half;
                    }
                } else if (e.to == 'hcenter') {
                    let half = (bound.right - bound.left) / 2;
                    if ((bound.left + half) < minHCenter) {
                        minHCenter = bound.left + half;
                    }
                }
            }
            maxRight -= pos.left;
            minLeft -= pos.left;
            minTop -= pos.top;
            maxBottom -= pos.top;
            minVCenter -= pos.top;
            minHCenter -= pos.left;

            for (let m of elements) {
                let n = $('#' + m.id + ' [mx-view]>*')[0];
                let bound = n.getBoundingClientRect();
                if (e.to == 'right') {
                    let diff = maxRight - (bound.right - pos.left);
                    m.props.x += diff | 0;
                } else if (e.to == 'left') {
                    let diff = minLeft - (bound.left - pos.left);
                    m.props.x += diff | 0;
                } else if (e.to == 'top') {
                    let diff = minTop - (bound.top - pos.top);
                    m.props.y += diff | 0;
                } else if (e.to == 'bottom') {
                    let diff = maxBottom - (bound.bottom - pos.top);
                    m.props.y += diff | 0;
                } else if (e.to == 'vcenter') {
                    let diff = minVCenter - (bound.top - pos.top + (bound.bottom - bound.top) / 2);
                    m.props.y += diff | 0;
                } else if (e.to == 'hcenter') {
                    let diff = minHCenter - (bound.left - pos.left + (bound.right - bound.left) / 2);
                    m.props.x += diff | 0;
                }
                let vf = Vframe.get(m.id);
                if (vf) {
                    if (vf.invoke('assign', m)) {
                        vf.invoke('render');
                    }
                }
            }
            State.fire('@{property&element.property.update}');
            State.fire('@{history&save.snapshot}');
        }
    },
    '@{prevent}<contextmenu>'(e: Editor.TableTriggeredEvent) {
        e.preventDefault();
        //如果是从表格弹出的右键，由表格全权处理
        if (e.from == 'element_table') {
            return;
        }
        let selected = StageSelectElements['@{all}']();
        let stageElements = State.get('@{stage&elements}');
        let me = this;
        me['@{context.event}'] = Convert["@{real.to.stage.coord}"]({
            x: e.pageX,
            y: e.pageY
        });
        StageElements["@{context.menu}"](me, e, null, stageElements, v => {
            if (v.id == 0) {
                StageElements["@{select.all}"](stageElements);
            } else if (v.id == 1) {
                Clipboard["@{copy.elements}"]();
            } else if (v.id == 14) {
                Clipboard["@{cut.elements}"]();
            } else if (v.id == 2) {
                Clipboard["@{paste.elements}"]({
                    coll: stageElements,
                    collType: 'stage',
                    width: Number.MAX_SAFE_INTEGER,
                    height: Number.MAX_SAFE_INTEGER
                }, me['@{context.event}']);
                State.fire('@{history&save.snapshot}');
            } else if (v.id == 7) {
                let elements = StageElements["@{delete.select.elements}"](true);
                me.updater.digest({
                    elements
                });
                State.fire('@{history&save.snapshot}');
            } else {
                let elements = StageElements["@{adjust.z.index}"](v.id, selected[0], stageElements);
                me.updater.digest({
                    elements
                });
                State.fire('@{history&save.snapshot}');
            }
        });
    },
    '@{stage.deactive}<focusout>'() {
        this['@{owner.node}'].addClass('@../index.less:stage-deactive');
    },
    '@{stage.active}<focusin>'() {
        this['@{owner.node}'].removeClass('@../index.less:stage-deactive');
    }
});