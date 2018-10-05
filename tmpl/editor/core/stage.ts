import Magix, { State, Vframe, View } from 'magix';
import $ from '$';
import ClickDesc from '../const/click-desc';
import * as Dragdrop from '../../gallery/mx-dragdrop/index';
import Convert from '../../util/converter';
import Keys from '../const/keys';
import { StageSelectElements, StageElements, Clipboard } from './workaround';
import DesignerHistory from './history';
//import Store from './store';
import Service from '../../service/index';
import ImageDesigner from '../../element/image/designer';
import Table from '../../util/table';
import CNC from '../../cainiao/const';
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
export default View.extend<Editor.Dragdrop & Editor.Service>({
    mixins: [Dragdrop, Service],
    tmpl: '@stage.html',
    init() {
        let me = this;
        let updateElements = (e) => {
            let elements = State.get('@{stage&elements}');
            if (e && e.scale) {
                StageElements["@{scale.by.step}"](e.from, e.to);
                let page = State.get('page');
                page.width = page.width / e.from * e.to;
                page.height = page.height / e.from * e.to;
                page.header = page.header / e.from * e.to;
                page.footer = page.footer / e.from * e.to;
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
        State.on('@{history&status.change}', (e: Magix.TriggerEventDescriptor & { history: boolean }) => {
            if (e.history) {
                let elements = State.get('@{stage&elements}');
                me.updater.set({
                    elements
                });
                me.render();
            }
            //Store["@{save}"]();
        });
        State.on('@{stage&ui.change}', (e: Editor.StageScaleEvent) => {
            if (e.scale) {
                updateElements(e);
            } else if (!e.keepSelect) {
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
            } else if (!node) {
                if (lastHover) {
                    lastHover.addClass('@scoped.style:none');
                }
                lastHover = null;
            }
        });
        State.on('@{toolbox&drag.element.drop}', (e: Editor.ToolboxStageDropEvent) => {
            if (Magix.inside(e.dropNode, 'stage_stage')) {
                let td = StageElements["@{get.best.cell}"](e.dropNode);
                let elements = StageElements["@{add.element}"](e, false, td, e.ignoreSnapshot);
                if (elements) {
                    me.updater.digest({
                        elements
                    });
                    if (!e.ignoreSnapshot) {
                        //State.fire('@{history&save.snapshot}');
                    }
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
                State.fire('@{history&save.snapshot}');
            }
        });
        State.on('@{toolbar&item.click}', e => {
            me['@{cmd.action}'](e);
        });

        State.on('@{stage&lock.scroll}', (e: Editor.ScrollLockEvent) => {
            let bar = $('#stayBar');
            let scroll = $('#app_stage');
            if (e.locked) {
                let width = scroll.prop('scrollWidth');
                let height = scroll.prop('scrollHeight');
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
            header: page.header,
            footer: page.footer,
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
            if (e.keyCode == Keys.F) {
                e.preventDefault();
                StageElements["@{focus.select.element.td}"]();
            } else if (e.keyCode == Keys.L ||
                e.keyCode == Keys.R ||
                e.keyCode == Keys.U ||
                e.keyCode == Keys.D ||
                e.keyCode == Keys.T ||
                e.keyCode == Keys.B) {
                e.preventDefault();
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
                        time: 500
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
            if (e.keyCode == Keys.N) {
                e.preventDefault();
                State.fire('@{stage&new.page}');
            } else if (e.keyCode == Keys.V) {
                e.preventDefault();
                if (Clipboard["@{has.elements}"]()) {
                    let stage = StageElements["@{get.nearest.stage}"]();
                    Clipboard["@{paste.elements}"](stage);
                    State.fire('@{history&save.snapshot}');
                }
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
            let changed = 0;
            for (let m of elements) {
                let n = $('#' + m.id + ' [mx-view]>*')[0];
                let bound = n.getBoundingClientRect();
                let lChanged = 0;
                if (e.to == 'right') {
                    let diff = maxRight - (bound.right - pos.left);
                    if (diff != 0) {
                        changed = 1;
                        lChanged = 1;
                        m.props.x += diff;
                    }
                } else if (e.to == 'left') {
                    let diff = minLeft - (bound.left - pos.left);
                    if (diff != 0) {
                        changed = 1;
                        lChanged = 1;
                        m.props.x += diff;
                    }
                } else if (e.to == 'top') {
                    let diff = minTop - (bound.top - pos.top);
                    if (diff != 0) {
                        changed = 1;
                        lChanged = 1;
                        m.props.y += diff;
                    }
                } else if (e.to == 'bottom') {
                    let diff = maxBottom - (bound.bottom - pos.top);
                    if (diff != 0) {
                        changed = 1;
                        lChanged = 1;
                        m.props.y += diff;
                    }
                } else if (e.to == 'vcenter') {
                    let diff = minVCenter - (bound.top - pos.top + (bound.bottom - bound.top) / 2);
                    if (diff != 0) {
                        changed = 1;
                        lChanged = 1;
                        m.props.y += diff;
                    }
                } else if (e.to == 'hcenter') {
                    let diff = minHCenter - (bound.left - pos.left + (bound.right - bound.left) / 2);
                    if (diff != 0) {
                        changed = 1;
                        lChanged = 1;
                        m.props.x += diff;
                    }
                }
                if (lChanged) {
                    let vf = Vframe.get(m.id);
                    if (vf) {
                        if (vf.invoke('assign', m)) {
                            vf.invoke('render');
                        }
                    }
                }
            }
            if (changed) {
                State.fire('@{property&element.property.update}');
                State.fire('@{history&save.snapshot}');
            }
        } else if (e.action == 'put') {
            let stages = StageElements["@{get.select.elements.stage}"]();
            let page = State.get('page'), changed = 0;
            for (let stage of stages) {
                let width = 0, height = 0,
                    elements = stage.elements;
                if (stage.type == 'stage') {
                    width = page.width;
                    height = page.height;
                } else {
                    let cell = stage.table.props.rows[stage.row].cells[stage.col];
                    width = cell.width;
                    height = cell.height;
                }
                let cx = width / 2, cy = height / 2;
                if (e.shift) {
                    for (let m of elements) {
                        let props = m.props,
                            lChanged = 0;
                        if (e.to == 'hc') {
                            let ecx = props.width / 2;
                            let dx = cx - ecx;
                            if (dx != props.x) {
                                props.x = dx;
                                changed = 1;
                                lChanged = 1;
                            }
                        } else {
                            let ecy = props.height / 2;
                            let dy = cy - ecy;
                            if (dy != props.y) {
                                props.y = dy;
                                changed = 1;
                                lChanged = 1;
                            }
                        }
                        if (lChanged) {
                            let vf = Vframe.get(m.id);
                            if (vf) {
                                if (vf.invoke('assign', m)) {
                                    vf.invoke('render');
                                }
                            }
                        }
                    }
                } else {
                    let minX = Number.MAX_SAFE_INTEGER,
                        minY = Number.MAX_SAFE_INTEGER,
                        maxX = -Number.MAX_SAFE_INTEGER,
                        maxY = -Number.MAX_SAFE_INTEGER;
                    for (let m of elements) {
                        let props = m.props;
                        if (props.x < minX) {
                            minX = props.x;
                        }
                        if (props.x + props.width > maxX) {
                            maxX = props.x + props.width;
                        }
                        if (props.y < minY) {
                            minY = props.y;
                        }
                        if (props.y + props.height > maxY) {
                            maxY = props.y + props.height;
                        }
                    }
                    let dx = cx - (minX + (maxX - minX) / 2);
                    let dy = cy - (minY + (maxY - minY) / 2);
                    for (let m of elements) {
                        let props = m.props,
                            lChanged = 0;
                        if (e.to == 'hc') {
                            let sx = props.x + dx;
                            if (props.x != sx) {
                                lChanged = 1;
                                changed = 1;
                                props.x = sx;
                            }
                        } else {
                            let sy = props.y + dy;
                            if (props.y != sy) {
                                lChanged = 1;
                                changed = 1;
                                props.y = sy;
                            }
                        }
                        if (lChanged) {
                            let vf = Vframe.get(m.id);
                            if (vf) {
                                if (vf.invoke('assign', m)) {
                                    vf.invoke('render');
                                }
                            }
                        }
                    }
                }
            }
            if (changed) {
                State.fire('@{property&element.property.update}');
                State.fire('@{history&save.snapshot}');
            }
        } else if (e.action == 'avg') {
            let stages = StageElements["@{get.select.elements.stage}"]();
            if (stages.length == 1) {
                let stage = stages[0],
                    elements = stage.elements,
                    changed = 0;
                if (elements.length > 2 || e.ctrl) {
                    let maxCX = -Number.MAX_SAFE_INTEGER,
                        minCX = Number.MAX_SAFE_INTEGER,
                        maxCY = -Number.MAX_SAFE_INTEGER,
                        minCY = Number.MAX_SAFE_INTEGER,
                        tempArray = [];
                    for (let m of elements) {
                        let props = m.props;
                        let mx = props.x + props.width / 2;
                        let my = props.y + props.height / 2;
                        if (mx > maxCX) {
                            maxCX = mx;
                        }
                        if (mx < minCX) {
                            minCX = mx;
                        }
                        if (my > maxCY) {
                            maxCY = my;
                        }
                        if (my < minCY) {
                            minCY = my;
                        }
                        tempArray.push({
                            m,
                            mx,
                            my
                        });
                    }
                    if (e.to == 'av') {
                        tempArray = tempArray.sort((a, b) => a.my - b.my);
                    } else {
                        tempArray = tempArray.sort((a, b) => a.mx - b.mx);
                    }

                    let ySpace = -1,
                        xSpace = -1,
                        startIndex = 0,
                        endIndex = tempArray.length,
                        count = endIndex + 1,
                        prev = null;
                    if (e.ctrl) {
                        if (stage.type == 'stage') {
                            let page = State.get('page');
                            xSpace = page.width;
                            ySpace = page.height;
                        } else {
                            let cell = stage.table.props.rows[stage.row].cells[stage.col];
                            xSpace = cell.width;
                            ySpace = cell.height;
                        }
                        prev = {
                            props: {
                                x: 0,
                                y: 0,
                                width: 0,
                                height: 0
                            }
                        };
                    } else {
                        let first = tempArray[0];
                        let last = tempArray[tempArray.length - 1];
                        let fProps = first.m.props;
                        let lProps = last.m.props;
                        ySpace = lProps.y - fProps.y - fProps.height;
                        xSpace = lProps.x - fProps.x - fProps.width;
                        startIndex += 1;
                        endIndex -= 1;
                        count -= 2;
                        prev = first.m;
                    }
                    if (e.shift) {
                        if (e.ctrl) {
                            minCX = 0;
                            maxCX = xSpace;
                            minCY = 0;
                            maxCY = ySpace;
                        }
                        let avgY = (maxCY - minCY) / count;
                        let avgX = (maxCX - minCX) / count;
                        for (let i = startIndex; i < endIndex; i++) {
                            let m = tempArray[i].m,
                                lChanged = 0;
                            if (e.to == 'av') {
                                let centerY = prev.props.y + prev.props.height / 2;
                                centerY += avgY;
                                centerY -= m.props.height / 2;
                                if (m.props.y != centerY) {
                                    changed = 1;
                                    lChanged = 1;
                                    m.props.y = centerY;
                                }
                            } else {
                                let centerX = prev.props.x + prev.props.width / 2;
                                centerX += avgX;
                                centerX -= m.props.width / 2;
                                if (m.props.x != centerX) {
                                    changed = 1;
                                    lChanged = 1;
                                    m.props.x = centerX;
                                }
                            }
                            if (lChanged) {
                                let vf = Vframe.get(m.id);
                                if (vf) {
                                    if (vf.invoke('assign', m)) {
                                        vf.invoke('render');
                                    }
                                }
                            }
                            prev = m;
                        }
                    } else {
                        let innerHeight = 0,
                            innerWidth = 0;
                        for (let i = startIndex; i < endIndex; i++) {
                            let props = tempArray[i].m.props;
                            innerHeight += props.height;
                            innerWidth += props.width;
                        }
                        let yGap = (ySpace - innerHeight) / count;
                        let xGap = (xSpace - innerWidth) / count;
                        for (let i = startIndex; i < endIndex; i++) {
                            let m = tempArray[i].m,
                                lChanged = 0;
                            if (e.to == 'av') {
                                let oy = prev.props.y + prev.props.height + yGap;
                                if (m.props.y != oy) {
                                    changed = 1;
                                    lChanged = 1;
                                    m.props.y = oy;
                                }
                            } else {
                                let ox = prev.props.x + prev.props.width + xGap;
                                if (m.props.x != ox) {
                                    changed = 1;
                                    lChanged = 1;
                                    m.props.x = ox;
                                }
                            }
                            if (lChanged) {
                                let vf = Vframe.get(m.id);
                                if (vf) {
                                    if (vf.invoke('assign', m)) {
                                        vf.invoke('render');
                                    }
                                }
                            }
                            prev = m;
                        }
                    }
                    if (changed) {
                        State.fire('@{property&element.property.update}');
                        State.fire('@{history&save.snapshot}');
                    }
                }
            }
        } else if (e.action == 'same') {
            let elements = StageSelectElements['@{all}']();
            let maxWidth = -Number.MAX_SAFE_INTEGER,
                maxHeight = -Number.MAX_SAFE_INTEGER,
                minWidth = Number.MAX_SAFE_INTEGER,
                minHeight = Number.MAX_SAFE_INTEGER;
            for (let m of elements) {
                let props = m.props;
                if (props.width > maxWidth) {
                    maxWidth = props.width;
                }
                if (props.width < minWidth) {
                    minWidth = props.width;
                }
                if (props.height > maxHeight) {
                    maxHeight = props.height;
                }
                if (props.height < minHeight) {
                    minHeight = props.height;
                }
            }
            let changed = 0;
            for (let m of elements) {
                let props = m.props, lChanged = 0;
                if (e.to == 'maw') {
                    if (props.width != maxWidth) {
                        lChanged = 1;
                        changed = 1;
                        props.width = maxWidth;
                    }
                } else if (e.to == 'miw') {
                    if (props.width != minWidth) {
                        lChanged = 1;
                        changed = 1;
                        props.width = minWidth;
                    }
                } else if (e.to == 'mah') {
                    if (props.width != maxHeight) {
                        lChanged = 1;
                        changed = 1;
                        props.height = maxHeight;
                    }
                } else if (e.to == 'mih') {
                    if (props.width != minHeight) {
                        lChanged = 1;
                        changed = 1;
                        props.height = minHeight;
                    }
                }
                if (lChanged) {
                    if (m.type == 'table') {
                        Table["@{update.cells.metas}"](m.props, {
                            fsize: true
                        });
                    } else if (m.type == 'qrcode') {
                        if (e.to == 'mah' || e.to == 'mih') {
                            props.width = props.height;
                        } else {
                            props.height = props.width;
                        }
                    }
                    let vf = Vframe.get(m.id);
                    if (vf) {
                        if (vf.invoke('assign', m)) {
                            vf.invoke('render');
                        }
                    }
                }
            }

            if (changed) {
                State.fire('@{property&element.property.update}');
                State.fire('@{history&save.snapshot}');
            }
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
            console.log(v);
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
    '@{drop.file}<drop>'(e: JQueryEventConstructor) {
        let oe = e.originalEvent as DragEvent;
        let files = oe.dataTransfer.files;
        let ids = [], pFiles = [],
            x = e.pageX,
            y = e.pageY,
            groupId = Magix.guid('g_');
        StageElements["@{get.drop.files}"](files, fis => {
            for (let fi of fis) {
                let id = Magix.guid('file_');
                ids.push(id);
                pFiles.push(fi.file);
                State.set({
                    '@{toolbox&drag.element}': ImageDesigner,
                    '@{toolbox&drag.element.props}': {
                        locked: true,
                        barred: id,
                        groupId,
                        src: CNC.DROP_STAGE_LOADING,
                        width: fi.width,
                        height: fi.height
                    }
                });
                State.fire('@{toolbox&drag.element.drop}', {
                    dropNode: e.target,
                    pageX: x,
                    pageY: y,
                    ignoreSnapshot: 1
                });
                x += 40;
                y += 40;
            }

            if (pFiles.length) {
                State.set({
                    '@{toolbox&drag.element}': null,
                    '@{toolbox&drag.element.props}': null
                });
                State.fire('@{stage&ui.change}');
            }
            this.upload(pFiles, groupId, (groupId, exts) => {
                console.log('back', groupId, exts);
                let elements = State.get('@{stage&elements}');
                let removeElements = [];
                let map = {}, added = 0;
                for (let i = 0; i < ids.length; i++) {
                    if (exts[i]) {
                        map[ids[i]] = exts[i];
                    }
                }
                StageElements["@{walk.elements}"](elements, (e, type) => {
                    if (type == 'element') {
                        let uId = e.props.barred;
                        if (e.props.groupId == groupId) {
                            if (uId) {
                                let fInfo = map[uId];
                                if (fInfo && !fInfo.error) {
                                    added = 1;
                                    Magix.mix(e.props, fInfo);
                                    e.props.locked = false;
                                    delete e.props.barred;
                                    delete e.props.groupId;
                                } else {
                                    removeElements.push(e);
                                }
                            }
                        }
                    }
                });
                if (removeElements.length) {
                    for (let r of removeElements) {
                        StageElements["@{delete.element.by.id}"](r.id, true);
                    }
                }
                if (added) {
                    State.fire('@{history&save.snapshot}');
                }
                if (added || removeElements.length) {
                    this.updater.digest({
                        elements
                    });
                }
            });
        });
    },
    '@{stage.deactive}<focusout>'() {
        this['@{owner.node}'].addClass('@../index.less:stage-deactive');
    },
    '@{stage.active}<focusin>'() {
        this['@{owner.node}'].removeClass('@../index.less:stage-deactive');
    }
});