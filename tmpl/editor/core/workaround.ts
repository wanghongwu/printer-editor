import Magix, { Vframe, State } from 'magix';
import Convert from '../../util/converter';
import Transform from '../../util/transform';
import * as Menu from '../../gallery/mx-menu/index';
import { Contextmenu } from './contextmenu';
//import CNC from '../../cainiao/const';
import $ from '$';
import Table from '../../util/table';
let ToMap = Magix.toMap;
let Has = Magix.has;
let Assign = Magix.mix;

let IsLineCross = (line1, line2) => {
    let s1 = line1.start,
        e1 = line1.end,
        s2 = line2.start,
        e2 = line2.end;
    let d1 = ((e1.x - s1.x) * (s2.y - s1.y) - (e1.y - s1.y) * (s2.x - s1.x)) * ((e1.x - s1.x) * (e2.y - s1.y) - (e1.y - s1.y) * (e2.x - s1.x));
    let d2 = ((e2.x - s2.x) * (s1.y - s2.y) - (e2.y - s2.y) * (s1.x - s2.x)) * ((e2.x - s2.x) * (e1.y - s2.y) - (e2.y - s2.y) * (e1.x - s2.x));
    return d1 < 0 && d2 < 0;
};
// let RectIntersect = (rect1, rect2) => {
//     return Math.abs((rect1.left.x + rect1.right.x) / 2 -
//         (rect2.left.x + rect2.right.x) / 2) <
//         ((rect1.right.x + rect2.right.x - rect1.left.x - rect2.left.x) / 2) &&
//         Math.abs((rect1.top.y + rect1.bottom.y) / 2 -
//             (rect2.top.y + rect2.bottom.y) / 2) <
//         ((rect1.bottom.y + rect2.bottom.y - rect1.top.y - rect2.top.y) / 2);
// };
// let ScrollElementIntoView = id => {
//     let stage = $('#app_stage');
//     let o = stage.offset();
//     let rect = {
//         x: o.left,
//         y: o.top,
//         width: stage.width(),
//         height: stage.height()
//     };
//     let n = $('#' + id);
//     if (n.length) {
//         o = n.offset();
//         let r2 = {
//             x: o.left,
//             y: o.top,
//             width: n.width(),
//             height: n.height()
//         };
//         console.log(rect, r2);
//     }
// };
export let StageSelectElements = {
    '@{set}'(element?: any) {
        let selectElements = State.get('@{stage&select.elements}');
        let oldCount = selectElements.length;
        if (oldCount || element) {
            let first = oldCount > 1 ? null : selectElements[0];
            selectElements.length = 0;
            let fireEvent = false;
            if (element) {
                selectElements.push(element);
                fireEvent = element != first;
            } else if (oldCount) {
                fireEvent = true;
            }
            if (fireEvent) {
                State.set({
                    '@{stage&select.elements.map}': ToMap(selectElements, 'id')
                });
                State.fire('@{stage&select.elements.change}');
                State.fire('@{history&save.snapshot}');
                // if (selectElements.length == 1) {
                //     ScrollElementIntoView(selectElements[0].id);
                // }
            }
        }
    },
    '@{add}'(element) {
        let selectElements = State.get('@{stage&select.elements}');
        let find = false;
        for (let e of selectElements) {
            if (e.id === element.id) {
                find = true;
                break;
            }
        }
        if (!find) {
            selectElements.push(element);
            State.set({
                '@{stage&select.elements.map}': ToMap(selectElements, 'id')
            });
            State.fire('@{stage&select.elements.change}');
            State.fire('@{history&save.snapshot}');
        }
    },
    '@{remove}'(element) {
        let selectElements = State.get('@{stage&select.elements}');
        let find = false, index = -1;
        for (let e of selectElements) {
            index++;
            if (e.id === element.id) {
                find = true;
                break;
            }
        }
        if (find) {
            selectElements.splice(index, 1);
            State.set({
                '@{stage&select.elements.map}': ToMap(selectElements, 'id')
            });
            State.fire('@{stage&select.elements.change}');
            State.fire('@{history&save.snapshot}');
        }
    },
    '@{set.all}'(elements) {
        let selectElements = State.get('@{stage&select.elements}');
        selectElements.length = 0;
        selectElements.push.apply(selectElements, elements);
        State.set({
            '@{stage&select.elements.map}': ToMap(selectElements, 'id')
        });
        State.fire('@{stage&select.elements.change}');
        State.fire('@{history&save.snapshot}');
    },
    '@{count}'() {
        let selectElements = State.get('@{stage&select.elements}');
        return selectElements.length;
    },
    '@{all}'() {
        let selectElements = State.get('@{stage&select.elements}');
        return selectElements;
    }
};


export let StageElements = {
    '@{add.element}'(e?: any, clicked?: boolean, td?: any) {
        let element = State.get('@{toolbox&drag.element}');
        if (element) {
            let elements = State.get('@{stage&elements}');
            let scale = State.get('@{stage&scale}');
            let { xy,
                collection,
                focus,
                collType
            } = StageElements["@{get.best.collection}"](e, clicked, td);
            let props = element.getProps(xy.x, xy.y);
            props.zIndex = collection.length + 1;
            let extProps = State.get('@{toolbox&drag.element.props}');
            if (extProps) {
                Assign(props, extProps);
            }
            StageElements["@{scale.element}"](element, props, scale);
            let m = {
                id: Magix.guid('e_'),
                ctor: element,
                type: element.type,
                props
            };
            if (element.type == 'vtext' || element.type == 'htext') {
                props.supportCNStyle = collType == 'td';
            } else if (element.type == 'table') {
                Table["@{update.cells.metas}"](props);
            }
            collection.push(m);
            if (focus) {
                StageSelectElements['@{set}'](m);
            }
            return elements;
        }
    },
    '@{get.select.elements.stage}'() {
        let selectElementsMap = State.get('@{stage&select.elements.map}');
        let stagesAdded = {},
            stages = [];
        let walk = (es,
            tb?: { id: string },
            rowIndex?: number,
            colIndex?: number) => {
            for (let e of es) {
                if (Has(selectElementsMap, e.id)) {
                    let sId = tb ? [tb.id, rowIndex, colIndex].join('-') : 'stage';
                    if (!stagesAdded[sId]) {
                        stages.push(stagesAdded[sId] = {
                            type: tb ? 'td' : 'stage',
                            table: tb,
                            row: rowIndex,
                            col: colIndex,
                            elements: []
                        });
                    }
                    stagesAdded[sId].elements.push(e);
                }
                if (e.type == 'table') {
                    let ri = 0;
                    for (let r of e.props.rows) {
                        if (r.tag == 'tr') {
                            let ci = 0;
                            for (let d of r.cells) {
                                if (d.tag == 'td') {
                                    if (d.children) {
                                        walk(d.children, e, ri, ci);
                                    }
                                }
                                ci++;
                            }
                        }
                        ri++;
                    }
                }
            }
        };
        let elements = State.get('@{stage&elements}');
        walk(elements);
        return stages;
    },
    '@{focus.select.element.td}'() {
        let stages = this['@{get.select.elements.stage}']();
        if (stages.length === 1) {
            let f = stages[0];
            if (f.type == 'td') {
                let table = f.table;
                table.props.rowIndex = f.row;
                table.props.colIndex = f.col;
                State.fire('@{property&element.property.change}', {
                    eId: table.id,
                    data: table.props
                });
                //State.fire('@{property&element.property.update}');
                StageSelectElements["@{set}"](table);
            }
        }
    },
    '@{walk.elements}'(elements, cb) {
        let walk = es => {
            for (let e of es) {
                cb(e, 'element');
                if (e.type == 'table') {
                    let rowIndex = 0;
                    for (let r of e.props.rows) {
                        cb(r, 'row', {
                            row: rowIndex
                        });
                        if (r.tag == 'tr') {
                            let colIndex = 0;
                            for (let d of r.cells) {
                                cb(d, 'td', {
                                    row: rowIndex,
                                    col: colIndex
                                });
                                if (d.tag == 'td') {
                                    if (d.children) {
                                        walk(d.children);
                                    }
                                }
                                colIndex++;
                            }
                        }
                        rowIndex++;
                    }
                }
            }
        };
        walk(elements);
    },
    '@{get.best.collection}'(e, clicked, td) {
        let current = StageSelectElements["@{all}"]();
        let first = current[0],
            //获取相对编辑区域的坐标
            xy = Convert["@{real.to.stage.coord}"]({
                x: e.pageX,
                y: e.pageY
            }),
            collection = State.get('@{stage&elements}'),
            focus = true,
            collType = 'stage';
        if (clicked &&
            current.length == 1 &&
            first.type == 'table' &&
            first.props.rowIndex > -1) {
            let { rows, rowIndex, colIndex } = first.props;
            let row = rows[rowIndex];
            if (row) {
                let cell = row.cells[colIndex];
                if (cell) {
                    if (!cell.children) {
                        cell.children = [];
                    }
                    collection = cell.children;
                    collType = 'td';
                    xy = {
                        x: 5,
                        y: 5
                    };
                    focus = false;
                }
            }
        } else if (!clicked && td) {
            let offset = $(td.node).offset();
            xy = {
                x: e.pageX - offset.left,
                y: e.pageY - offset.top
            };
            collection = td.children;
            collType = 'td';
        }
        return { collection, xy, focus, collType };
    },
    '@{get.best.cell}'(node) {
        let elements = State.get('@{stage&elements}'),
            td = null;
        let walk = es => {
            for (let e of es) {
                let n = Magix.node(e.id);
                if (Magix.inside(node, n)) {
                    if (e.type == 'table') {
                        let props = e.props;
                        let rows = props.rows;
                        for (let i = rows.length; i--;) {
                            let row = rows[i];
                            if (row.cells) {
                                for (let j = row.cells.length; j--;) {
                                    let n = Magix.node('entity_' + e.id + '_c_' + i + '_' + j);
                                    let c = row.cells[j];
                                    if (Magix.inside(node, n)) {
                                        if (!c.children) c.children = [];
                                        td = {
                                            node: n,
                                            dashed: `#entity_${e.id}_dashed_${i}_${j}`,
                                            children: c.children
                                        };
                                        walk(td.children);
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
            }
        };
        walk(elements);
        return td;
    },
    '@{get.nearest.stage}'() {
        let selectElements = StageSelectElements['@{all}'](),
            c = selectElements.length;
        if (c === 1) {
            let first = selectElements[0];
            let { rows, rowIndex, colIndex } = first.props;
            if (rowIndex > -1 && colIndex > -1) {
                let cell = rows[rowIndex].cells[colIndex];
                return {
                    coll: cell.children,
                    type: 'td',
                    width: cell.width,
                    height: cell.height
                };
            }
        }
        let stages = this['@{get.select.elements.stage}'](),
            elements = State.get('@{stage&elements}'),
            stage = {
                coll: elements,
                type: 'stage',
                width: Number.MAX_SAFE_INTEGER,
                height: Number.MAX_SAFE_INTEGER
            };
        if (stages.length === 1) {
            let first = stages[0];
            if (first.type == 'td') {
                let cell = first.table.props.rows[first.row].cells[first.col];
                stage = {
                    coll: cell.children,
                    type: 'td',
                    width: cell.width,
                    height: cell.height
                };
            }
        }
        return stage;
    },
    '@{multi.select}'(e, element) {
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
            if (!element.props.locked &&
                !(element.props.xLocked || element.props.yLocked)) {
                let elements = StageSelectElements['@{all}'](),
                    map = {},
                    elementsToTables = {},
                    tables = [];
                if (element.type == 'table') {
                    tables.push(element);
                }
                let exists = false;
                for (let i = elements.length; i--;) {
                    let m = elements[i];
                    if (m.id == element.id) {
                        exists = true;
                    }
                    if (m.props.locked ||
                        m.props.xLocked ||
                        m.props.yLocked) {
                        elements.splice(i, 1);
                    } else {
                        if (m.type == 'table') {
                            tables.push(m);
                        }
                    }
                }
                if (exists && elements.length > 1) {
                    StageSelectElements["@{remove}"](element);
                    return;
                }
                let walk = (children, tableId) => {
                    for (let c of children) {
                        if (c.type != '#script') {
                            if (tableId) {
                                map[c.id] = 1;
                                elementsToTables[c.id] = tableId;
                            }
                            if (c.type == 'table') {
                                for (let r of c.props.rows) {
                                    if (r.tag == 'tr') {
                                        for (let d of r.cells) {
                                            if (d.tag == 'td') {
                                                if (d.children) {
                                                    walk(d.children, c.id);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                walk(tables, 0);
                if (Has(map, element.id)) {//选择的元素在选中的表格内，取消表格的选择
                    let sId = element.id;
                    do {
                        let tId = elementsToTables[sId];
                        if (tId) {
                            map[tId] = 1;
                            sId = tId;
                        } else {
                            break;
                        }
                    } while (true);
                }
                for (let i = elements.length; i--;) {
                    let m = elements[i];
                    if (Has(map, m.id)) {
                        elements.splice(i, 1);
                    }
                }
                StageSelectElements['@{add}'](element);
            }
        } else {
            StageSelectElements['@{set}'](element);
        }
    },
    '@{get.elements.location}'(cell?: { children: { props: object, type: string }[], width: number, height: number }) {
        let elements = cell && cell.children || State.get('@{stage&elements}');
        let locations = [],
            props, rotate;
        for (let e of elements) {
            props = e.props;
            if (e.type == '#script' ||
                props.locked) {
                continue;
            }
            rotate = props.rotate || 0;
            let rect = {
                x: props.x,
                y: props.y,
                width: props.width,
                height: props.height
            };
            if (props.useCNStyle && cell) {
                rect.width = cell.width * 0.92;
                rect.height = cell.height * 0.92;
            }
            let tsed = Transform["@{rotate.rect}"](rect, rotate);
            let lt = tsed.point[0];
            let rt = tsed.point[2];
            let lb = tsed.point[6];
            let rb = tsed.point[4];
            //let p = GetDegPoint(props.width / 2, props.height / 2, rotate);
            // let c = {
            //     x: props.x + p.x,
            //     y: props.y + p.y
            // };
            let tl = lt, tt = lt, tr = lt, tb = lt;
            for (let p of [rt, lb, rb]) {
                if (p.x < tl.x) {
                    tl = p;
                }
                if (p.x > tr.x) {
                    tr = p;
                }
                if (p.y < tt.y) {
                    tt = p;
                }
                if (p.y > tb.y) {
                    tb = p;
                }
            }
            locations.push({
                element: e,
                left: tl,
                top: tt,
                right: tr,
                bottom: tb,
                points: [lt, rt, lb, rb],
                lines: [{
                    start: lt,
                    end: rt
                }, {
                    start: rt,
                    end: rb
                }, {
                    start: rb,
                    end: lb
                }, {
                    start: lb,
                    end: lt
                }]
            });
        }
        return locations;
    },
    '@{adjust.z.index}'(to, element, collection) {
        //3 top 4 bottom 5 to up 6 to down
        let index = -1,
            props = element.props;
        let compare = Transform["@{get.sorted.elements}"](collection);
        let total = compare.length
        for (let i = compare.length; i--;) {
            let e = compare[i];
            if (e.id === element.id) {
                index = i;
                break;
            }
        }
        //下面是真实移动，但为了能保留xml中的script语句，我们要改成逻辑移动z-index

        /*if (to == 3) {
            elements.push(element);
        } else if (to == 4) {
            elements.unshift(element);
        } else if (to == 5) {
            elements.splice(index + 1, 0, element);
        } else if (to == 6) {
            if (index === 0) index = 1;
            elements.splice(index - 1, 0, element);
        }*/
        if (to == 3) {
            for (let i = index + 1; i < total; i++) {
                compare[i].props.zIndex = i;
            }
            props.zIndex = total;
        } else if (to == 4) {
            for (let i = 0; i < index; i++) {
                compare[i].props.zIndex = i + 2;
            }
            props.zIndex = 1;
        } else if (to == 5) {
            let next = compare[index + 1];
            if (next) {
                let z = props.zIndex;
                let nz = next.props.zIndex;
                next.props.zIndex = z;
                props.zIndex = nz;
            }
        } else if (to == 6) {
            let pre = compare[index - 1];
            if (pre) {
                let z = props.zIndex;
                let nz = pre.props.zIndex;
                pre.props.zIndex = z;
                props.zIndex = nz;
            }
        }
        return collection;
    },
    '@{select.all}'(elements) {
        let added = [];
        for (let m of elements) {
            if (m.type != '#script' &&
                !m.props.locked &&
                !m.props.xLocked &&
                !m.props.yLocked) {
                added.push(m);
            }
        }
        StageSelectElements['@{set.all}'](added);
    },
    '@{delete.select.elements}'(update?: boolean) {
        let elements = StageSelectElements['@{all}']();
        let map = ToMap(elements, 'id');
        let stageElements = State.get('@{stage&elements}');
        let walk = (es) => {
            let updateZIndex = false;
            for (let i = es.length; i--;) {
                let e = es[i];
                if (e.type != '#script') {
                    if (Has(map, e.id)) {
                        es.splice(i, 1);
                        updateZIndex = true;
                    } else {
                        if (e.type == 'table') {
                            for (let r of e.props.rows) {
                                if (r.tag == 'tr') {
                                    for (let c of r.cells) {
                                        if (c.tag == 'td') {
                                            if (c.children) {
                                                walk(c.children);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (updateZIndex) {
                for (let i = es.length; i--;) {
                    let e = es[i];
                    if (e.type != '#script') {
                        e.props.zIndex = i + 1;
                    }
                }
            }
        };
        walk(stageElements);
        if (update) {
            elements.length = 0;
            State.fire('@{stage&select.elements.change}');
            return stageElements;
        }
    },
    '@{delete.element.by.id}'(id, silent) {
        let stageElements = State.get('@{stage&elements}');
        let walk = (es) => {
            let updateZIndex = false;
            for (let i = es.length; i--;) {
                let e = es[i];
                if (e.type != '#script') {
                    if (id == e.id) {
                        es.splice(i, 1);
                        updateZIndex = true;
                    } else {
                        if (e.type == 'table') {
                            for (let r of e.props.rows) {
                                if (r.tag == 'tr') {
                                    for (let c of r.cells) {
                                        if (c.tag == 'td') {
                                            if (c.children) {
                                                walk(c.children);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (updateZIndex) {
                for (let i = es.length; i--;) {
                    let e = es[i];
                    if (e.type != '#script') {
                        e.props.zIndex = i + 1;
                    }
                }
            }
        };
        walk(stageElements);
        if (!silent) {
            let elements = StageSelectElements['@{all}']();
            elements.length = 0;
            State.fire('@{stage&select.elements.change}');
        }
    },
    '@{scale.element}'(element, props, scale, withXY?: boolean) {
        if (withXY) {
            props.x *= scale;
            props.y *= scale;
        }
        props.width *= scale;
        props.height *= scale;
        if (element.type == 'table') {
            for (let r of props.rows) {
                if (r.tag == 'tr') {
                    for (let c of r.cells) {
                        if (c.tag == 'td') {
                            c.width *= scale;
                            c.height *= scale;
                            if (c.children) {
                                StageElements["@{scale.elements}"](c.children, scale, withXY);
                            }
                        }
                    }
                }
            }
        }
    },
    '@{scale.elements}'(elements, scale, withXY?: boolean) {
        for (let m of elements) {
            if (m.type != '#script') {
                StageElements["@{scale.element}"](m, m.props, scale, withXY);
            }
        }
    },
    '@{scale.by.step}'(from, to) {
        let elements = State.get('@{stage&elements}');
        let r = to / from;
        StageElements["@{scale.elements}"](elements, r, true);
    },
    '@{select.or.move.elements}'(event, view) {
        let element = event.params;
        let elements = StageSelectElements['@{all}']();
        if (event.button !== undefined && event.button != 0) {//如果不是左键
            let exist = false;
            for (let m of elements) {
                if (m.id === element.id) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {//如果在当前选中的元素内找不到当前的，则激活当前
                StageSelectElements['@{set}'](element);
            }
            return;
        }
        if (event.shiftKey || event.ctrlKey || event.metaKey) {//多选
            StageElements["@{multi.select}"](event, element);
        } else {
            let startInfos = [],
                exist = false;
            for (let e of elements) {
                if (element.id == e.id) {
                    exist = true;
                }
                startInfos.push({
                    x: e.props.x,
                    y: e.props.y
                });
            }
            if (!exist) {
                StageSelectElements['@{set}'](element);
                startInfos.length = 0;
                startInfos.push({
                    x: element.props.x,
                    y: element.props.y
                });
                elements.length = 0;
                elements.push(element);
            }
            let moved = false,
                elementMoved = false;
            view.dragdrop(event.eventTarget, evt => {
                moved = true;
                let offsetX = evt.pageX - event.pageX;
                let offsetY = evt.pageY - event.pageY;
                let index = 0;
                for (let e of elements) {
                    if (!e.props.locked &&
                        !(e.props.xLocked || e.props.yLocked)) {
                        elementMoved = true;
                        let s = startInfos[index++];
                        e.props.x = s.x + offsetX;
                        e.props.y = s.y + offsetY;
                        let vf = Vframe.get(e.id);
                        if (vf) {
                            if (vf.invoke('assign', [e, { move: true }])) {
                                vf.invoke('render');
                            }
                        }
                    }
                }
                State.fire('@{stage&select.elements.change}');
            }, () => {
                if (!moved) {
                    StageSelectElements['@{set}'](element);
                } else if (elementMoved) {
                    State.fire('@{history&save.snapshot}');
                }
            });
        }
    },
    '@{context.menu}'(view, event, tableId, coll, picked) {
        let elements = StageSelectElements['@{all}']();
        let lang = Magix.config('lang');
        let list = Contextmenu.stage(lang) as {
            spliter?: boolean
            id?: number,
            text?: string
        }[];
        let listKey = 1;
        let disabled = {};
        let copyList = Clipboard["@{get.copy.list}"]();
        //console.log(copyList);
        coll = Transform["@{get.sorted.elements}"](coll);
        disabled[Contextmenu.allId] = !coll.length;
        disabled[Contextmenu.pasteId] = !copyList.length;
        if (elements.length === 1) {
            let e = elements[0];
            let locked = e.props.locked;
            if (tableId && elements[0].id == tableId) {
                listKey = 4;
                list = Contextmenu.tableCell(lang);
                disabled[Contextmenu.cellTopId] = locked;
                disabled[Contextmenu.cellBottomId] = locked;
                disabled[Contextmenu.cellLeftId] = locked;
                disabled[Contextmenu.cellRightId] = locked;
                disabled[Contextmenu.cellDeleteColId] = locked;
                disabled[Contextmenu.cellDeleteRowId] = locked;
            } else {
                listKey = 2;
                list = Contextmenu.singleElement(lang);
                let moveLocked = locked || e.props.useCNStyle;
                let count = coll.length;
                let atTop = count ? coll[count - 1].id == e.id : true;
                let atBottom = count ? coll[0].id == e.id : true;
                disabled[Contextmenu.cutId] = locked;
                disabled[Contextmenu.topId] = atTop || moveLocked;
                disabled[Contextmenu.bottomId] = atBottom || moveLocked;
                disabled[Contextmenu.upId] = atTop || moveLocked;
                disabled[Contextmenu.downId] = atBottom || moveLocked;
            }
        } else if (elements.length > 1) {
            listKey = 3;
            list = Contextmenu.multipleElement(lang);
        }
        Menu.show(view, event, {
            cnt: '#outer_cm',
            offset: '#stage_outer',
            scroller: '#app_stage',
            width: 150,
            disabled,
            list,
            listKey: lang + listKey,
            picked
        });
    },
    '@{handle.key.tab}'(e) {
        let elements = StageSelectElements['@{all}']();
        let stageElements = State.get('@{stage&elements}');
        let all = Transform["@{get.sorted.elements}"](stageElements);
        //多选2个以上的我们取消多选，然后从头选择一个
        let c = elements.length;
        let current = null;
        if (c === 0 || c > 1) {
            current = all[e.shiftKey ? 0 : all.length - 1];
        } else {
            let findCurrent = null,
                findNext = null,
                findPrev = null,
                lastOne = null,
                lockPrev = false,
                id = elements[0].id;
            let find = es => {
                for (let e of es) {
                    if (e.type != '#script') {
                        if (e.id == id) {
                            lockPrev = true;
                            findCurrent = e;
                        } else {
                            if (findCurrent && !findNext) {
                                findNext = e;
                            } else if (!lockPrev) {
                                findPrev = e;
                            } else {
                                lastOne = e;
                            }
                        }
                        if (e.type == 'table') {
                            let { rows, rowIndex, colIndex } = e.props;
                            let haveFocused = 0;
                            if (rowIndex > -1 && colIndex > -1) {
                                let cell = rows[rowIndex].cells[colIndex];
                                if (cell.children) {
                                    let dc = Transform["@{get.sorted.elements}"](cell.children);
                                    if (dc.length) {
                                        haveFocused = 1;
                                        find(dc);
                                    }
                                }
                            }
                            if (!haveFocused) {
                                for (let r of rows) {
                                    if (r.tag == 'tr') {
                                        for (let d of r.cells) {
                                            if (d.tag == 'td') {
                                                if (d.children) {
                                                    let dc = Transform["@{get.sorted.elements}"](d.children);
                                                    find(dc);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            find(all);
            if (e.shiftKey) {
                if (!findPrev) {
                    current = all[all.length - 1];
                    if (current.type == 'table' && lastOne) {
                        current = lastOne;
                    }
                } else {
                    current = findPrev;
                }
            } else {
                if (!findNext) {
                    current = all[0];
                } else {
                    current = findNext;
                }
            }
            console.log(findPrev, findCurrent, findNext);
            /*let idx = -1,
                id = elements[0].id;
            for (let a = all.length; a--;) {
                if (all[a].id === id) {
                    idx = a;
                    break;
                }
            }
            if (e.shiftKey) {
                idx += 1;
                if (idx >= all.length) {
                    idx = 0;
                }
            } else {
                idx -= 1;
                if (idx < 0) {
                    idx = all.length - 1;
                }
            }
            current = all[idx];*/
        }
        StageSelectElements["@{set}"](current);
    },
    '@{get.intersect.elements}'(elementLocations, rect, bak) {
        let selected = [], find,
            rectLines = [{
                start: {
                    x: rect.x,
                    y: rect.y
                },
                end: {
                    x: rect.x + rect.width,
                    y: rect.y
                }
            }, {
                start: {
                    x: rect.x + rect.width,
                    y: rect.y
                },
                end: {
                    x: rect.x + rect.width,
                    y: rect.y + rect.height
                }
            }, {
                start: {
                    x: rect.x + rect.width,
                    y: rect.y + rect.height
                },
                end: {
                    x: rect.x,
                    y: rect.y + rect.height
                }
            }, {
                start: {
                    x: rect.x,
                    y: rect.y + rect.height
                },
                end: {
                    x: rect.x,
                    y: rect.y
                }
            }];
        for (let e of elementLocations) {
            find = false;
            if (!bak || !bak[e.element.id]) {
                for (let p of e.points) {
                    if (p.x >= rect.x &&
                        p.y >= rect.y &&
                        p.x <= (rect.x + rect.width) &&
                        p.y <= (rect.y + rect.height)) {
                        selected.push(e.element);
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    /*mc-uncheck*/
                    for (let l of e.lines) {
                        /*mc-uncheck*/
                        for (let rl of rectLines) {
                            if (IsLineCross(l, rl)) {
                                find = true;
                                selected.push(e.element);
                                break;
                            }
                        }
                        if (find) {
                            break;
                        }
                    }
                }
            } else if (bak) {
                selected.push(e.element);
            }
        }
        return selected;
    }
};
let Clone = (from, to) => {
    return $.extend(true, to, from);
};
export let Clipboard = {
    '@{has.elements}'() {
        let list = this['@{copy.list}'] || [];
        return list.length;
    },
    '@{get.copy.list}'() {
        let list = this['@{copy.list}'] || [];
        return list;
    },
    '@{copy.elements}'() {
        let me = this;
        let list = [];
        let elements = StageSelectElements['@{all}']();
        for (let m of elements) {
            list.push(m);
        }
        me['@{copy.list}'] = list;
    },
    '@{cut.elements}'() {
        //编辑锁定的不能剪切
        let elements = StageSelectElements['@{all}']();
        if (elements.length == 1 && elements[0].props.locked) {
            return;
        }
        this['@{copy.elements}']();
        this['@{is.cut}'] = true;
    },
    '@{paste.elements}'(stage: any, xy?: { x: number, y: number }) {
        let me = this;
        let list = me['@{copy.list}'];
        let elements = stage.coll;
        if (list) {
            let selected = [];
            let index = 0, diffX = 0, diffY = 0;
            let hasSameXY = props => {
                for (let c of elements) {
                    if (c.props.x == props.x && c.props.y == props.y) {
                        return 1;
                    }
                }
                return 0;
            };
            let setXY = props => {
                if (index === 0) {
                    if (xy) {
                        diffX = props.x - xy.x;
                        diffY = props.y - xy.y;
                        props.x = xy.x;
                        props.y = xy.y;
                    } else {
                        let oldX = props.x;
                        let oldY = props.y;
                        while (hasSameXY(props)) {
                            props.x += 20;
                            props.y += 20;
                        }
                        if (props.x > stage.width) {
                            props.x = stage.width - props.width / 2;
                        } else if ((props.x + props.width) < 0) {
                            props.x = -props.width / 2;
                        }
                        if (props.y > stage.height) {
                            props.y = stage.height - props.height / 2;
                        } else if ((props.y + props.height) < 0) {
                            props.y = -props.height / 2
                        }
                        while (hasSameXY(props)) {
                            props.x -= 4;
                            props.y -= 4;
                        }
                        diffX = oldX - props.x;
                        diffY = oldY - props.y;
                    }
                } else {
                    props.x -= diffX;
                    props.y -= diffY;
                }
            };
            for (let m of list) {
                let nm = Clone(m, {});
                let props = nm.props;
                setXY(props);
                index++;
                let n = {};
                let walk = (from, to) => {
                    Assign(to, from);
                    if (from.type != '#script') {
                        to.id = Magix.guid('e_');
                        to.props = {};
                        Assign(to.props, from.props);
                        if ((from.type == 'htext' ||
                            from.type == 'vtext')) {
                            if (to.props.useCNStyle && stage.type == 'td') {
                                to.props.x = 0.76;
                                to.props.y = 0.76;
                            } else {
                                to.props.zIndex = elements.length + 1;
                                to.props.locked = false;
                                to.props.supportCNStyle = stage.type == 'td';
                                if (to.props.useCNStyle) {
                                    to.props.xLocked = false;
                                    to.props.yLocked = false;
                                    to.props.widthLocked = false;
                                    to.props.heightLocked = false;
                                    to.props.useCNStyle = false;
                                    to.props.width = to.props._width || (from.type == 'htext' ? 94.49 : 22.68);
                                    to.props.height = to.props._height || (from.type == 'htext' ? 18.9 : 128.5);
                                }
                            }
                        }
                    }
                    if (from.type == 'table') {
                        to.props.rows = [];
                        for (let r of from.props.rows) {
                            let record = { ...r };
                            if (r.tag == 'tr') {
                                let cells = [];
                                for (let c of r.cells) {
                                    let ci = { ...c, children: [] };
                                    if (c.tag == 'td') {
                                        if (c.children) {
                                            for (let cc of c.children) {
                                                let x = {};
                                                walk(cc, x);
                                                ci.children.push(x);
                                            }
                                        }
                                    }
                                    cells.push(ci);
                                }
                                record.cells = cells;
                            }
                            to.props.rows.push(record);
                        }
                    }
                };
                walk(nm, n);
                elements.push(n);
                selected.push(n);
                if (me['@{is.cut}']) {
                    StageElements["@{delete.element.by.id}"](m.id, true);
                }
            }

            if (me['@{is.cut}']) {
                delete me['@{is.cut}'];
                delete me['@{copy.list}'];
            }
            StageSelectElements['@{set.all}'](selected);
            State.fire('@{stage&elements.change}');
            State.fire('@{stage&select.elements.change}');
        }
    }
}