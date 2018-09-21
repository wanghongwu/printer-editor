import Magix, { View, State, Vframe } from 'magix';
import $ from '$';
import { StageSelectElements, StageElements, Clipboard } from '../../editor/core/workaround';
import * as Dragdrop from '../../gallery/mx-dragdrop/index';
import Table from '../../util/table';
import CNC from '../../cainiao/const';
import Keys from '../../editor/const/keys';
import Convert from '../../util/converter';
const KeysMap = {
    [Keys.L]: 'left',
    [Keys.R]: 'right',
    [Keys.U]: 'top',
    [Keys.D]: 'bottom',
    [Keys.T]: 'top',
    [Keys.B]: 'bottom'
};
const MenusMap = {
    8: 'rt',
    9: 'rb',
    10: 'r',
    11: 'cb',
    12: 'ca',
    13: 'c'
};
Magix.applyStyle('@index.less');
export default View.extend<Editor.Dragdrop>({
    tmpl: '@index.html',
    mixins: [Dragdrop],
    init(data) {
        this.assign(data);
        this['@{owner.node}'] = $('#' + this.id);
        let watchKeydown = e => {
            let props = data.props;
            let update = Table["@{move.focus}"](props, KeysMap[e.key]);
            if (update) {
                State.fire('@{property&element.property.change}', {
                    data: props,
                    eId: data.id
                });
                State.fire('@{property&element.property.update}');
            }
        };
        State.on('@{stage&move.table.focus}', watchKeydown);
        this.on('destroy', () => {
            State.off('@{stage&move.table.focus}', watchKeydown);
        });
    },
    '@{lost.select}'() {
        let data = this['@{data}'];
        data.props.rowIndex = -1;
        data.props.colIndex = -1;
        this.assign(data);
        setTimeout(this.wrapAsync(() => {
            this.render();
        }), 0);
    },
    assign(data) {
        this['@{data}'] = data;
        let unchanged = {} as { rows?: number };
        if (data.onlyMove) {
            console.log('only move');
            unchanged.rows = 1;
        }
        this.updater.set(data.props, unchanged);
        this.updater.set({
            size: CNC.RESIZER_SIZE,
            scale: State.get('@{stage&scale}')
        });
        return data.forceUpdate;
    },
    render() {
        this.updater.digest();
    },
    '@{table.mouse.down}<mousedown>'(e) {
        if (e.from == 'element_table') return;
        e.from = 'element_table';
        StageElements["@{select.or.move.elements}"](e, this);
    },
    '@{select.cell}<mousedown>'(e) {
        if (e.from == 'element_table') return;
        e.from = 'element_table';
        let { row, col } = e.params;
        let me = this;
        let data = me['@{data}'];
        data.props.rowIndex = row;
        data.props.colIndex = col;
        me.assign(data);
        me.render();
        State.fire('@{property&element.property.update}');
        StageSelectElements["@{set}"](data);
        let modifier = Vframe.get('m_app_stage');
        let beginXY = Convert["@{real.to.outer.coord}"]({
            x: e.pageX,
            y: e.pageY
        });
        let target = $(e.eventTarget);
        let nearXY = Convert["@{real.to.nearest.coord}"](target, {
            x: e.pageX,
            y: e.pageY,
            find: 0
        });
        let moved = false;
        let finished = false;
        let cell = data.props.rows[row].cells[col];
        if (!cell.children) {
            cell.children = [];
        }
        let elementLocations = StageElements["@{get.elements.location}"](cell);
        //console.log(elementLocations);
        me.dragdrop(e.eventTarget, me['@{throttle}'](evt => {
            if (finished) return;
            moved = true;
            let currentXY = Convert["@{real.to.outer.coord}"]({
                x: evt.pageX,
                y: evt.pageY
            });
            modifier.invoke('@{drag.rect}', [beginXY, currentXY]);
            let cNearXY = Convert["@{real.to.nearest.coord}"](target, {
                x: evt.pageX,
                y: evt.pageY,
                find: 0
            });
            let width = Math.abs(beginXY.x - currentXY.x);
            let height = Math.abs(beginXY.y - currentXY.y);
            let left = Math.min(nearXY.x, cNearXY.x);
            let top = Math.min(nearXY.y, cNearXY.y);
            let rect = {
                x: left,
                y: top,
                width,
                height
            };
            let elements = StageElements["@{get.intersect.elements}"](elementLocations, rect, {});
            let ids = JSON.stringify(elements, ['id']);
            if (ids != me['@{last.ids}']) {
                me['@{last.ids}'] = ids;
                if (elements.length) {
                    StageSelectElements['@{set.all}'](elements);
                } else {
                    data.props.rowIndex = row;
                    data.props.colIndex = col;
                    me.assign(data);
                    setTimeout(me.wrapAsync(() => {
                        me.render();
                    }), 0);
                    StageSelectElements["@{set}"](data);
                }
            }
        }, 50), () => {
            if (moved) {
                delete me['@{last.ids}'];
                finished = true;
                modifier.invoke('@{drag.end}');
            }
        });
    },
    '@{start.resize}<mousedown>'(e) {
        if (e.from == 'element_table') return;
        e.from = 'element_table';
        let { props, id } = this['@{data}'];
        if (props.locked) return;
        let rows = props.rows;
        let {
            cell,
            type,
            ri: rowIndex,
            ci: colIndex } = e.params;
        if (!cell) {
            cell = Table["@{get.cell.by.pure.location}"](rows, rowIndex, colIndex);
        }
        let beginX = e.pageX, beginY = e.pageY;
        let startHeight = cell.height;
        let startWidth = cell.width;
        let moved = false;
        if (!cell.id) {
            cell.id = Magix.guid('td_');
        }
        State.fire('@{stage&lock.scroll}', {
            locked: 1
        });
        let ref = {} as { rowHeights?: number[], colWidths?: number[] };
        if (props.lockSize) {
            Table["@{update.cells.metas}"](props, ref);
        }
        this.dragdrop(e.eventTarget, (evt) => {
            let dx = evt.pageX - beginX;
            let dy = evt.pageY - beginY;
            let ndy = 0, ndx;
            if (props.lockSize) {
                let rowspan = cell.rowspan || 1;
                let next = ref.rowHeights[cell.row + rowspan];
                ndy = next - dy;
                if (ndy < 0) {
                    dy = next;
                    ndy = 0;
                } else if (ndy > next + startHeight) {
                    ndy = next + startHeight - 1;
                }
                let colspan = cell.colspan || 1;
                let nextCol = ref.colWidths[cell.col + colspan];
                ndx = nextCol - dx;
                if (ndx < 0) {
                    dx = nextCol;
                    ndx = 0;
                } else if (ndx > nextCol + startWidth) {
                    ndx = nextCol + startWidth;
                }
            }
            let h = Math.max(startHeight + dy, 0);
            let w = Math.max(0, startWidth + dx);
            if (type == 'row') {
                if (h != cell.height) {
                    moved = true;
                    cell.height = h;
                }
            } else if (type == 'col') {
                if (w != cell.width) {
                    moved = true;
                    cell.width = w;
                }
            }
            Table["@{update.cells.metas}"](props, {
                col: cell,
                changeType: type,
                nextRow: ndy,
                nextCol: ndx
            });
            State.fire('@{property&element.property.change}', {
                data: props,
                eId: id
            });
            State.fire('@{property&element.property.update}');
        }, () => {
            if (moved) {
                State.fire('@{history&save.snapshot}');
            }
            State.fire('@{stage&lock.scroll}');
        });
    },
    '@{table.prevent}<contextmenu>'(e: MouseEvent & {
        from?: string
        params: {
            row: number
            col: number
        },
        eventTarget: HTMLElement
    }) {
        if (e.from == 'element_table') return;
        e.from = 'element_table';
        e.preventDefault();
        let selected = StageSelectElements['@{all}']();
        let me = this;
        let data = me['@{data}'];
        let { id, props } = data;
        let { row: rowIndex, col: colIndex } = e.params;
        let { rows } = props;
        let row = rows[rowIndex];
        let height = CNC.TABLE_ROWS_HEIGHT,
            width = CNC.TABLE_CELLS_WIDTH;
        let children = [];
        if (row && row.cells[colIndex]) {
            let cell = row.cells[colIndex];
            height = cell.height;
            width = cell.width;
            if (cell.children) {
                children = cell.children;
            } else {
                cell.children = children = [];
            }
        }
        let cells = [];
        for (let c of children) {
            if (c.type != '#script' &&
                !c.props.useCNStyle) {
                cells.push(c);
            }
        }
        let offset = $(e.eventTarget).offset();
        me['@{context.event}'] = {
            x: e.pageX - offset.left,
            y: e.pageY - offset.top
        };
        StageElements["@{context.menu}"](me, e, id, cells, v => {
            if (v.id == 0) {
                if (cells.length) {
                    StageSelectElements['@{set.all}'](cells);
                }
            } else if (v.id == 1) {
                Clipboard["@{copy.elements}"]();
            } else if (v.id == 14) {
                Clipboard["@{cut.elements}"]();
            } else if (v.id == 2) {
                Clipboard["@{paste.elements}"]({
                    coll: children,
                    collType: 'td',
                    width,
                    height
                }, me['@{context.event}']);
                State.fire('@{history&save.snapshot}');
            } else if (v.id == 7) {
                let elements = StageElements["@{delete.select.elements}"](true);
                me.updater.digest({
                    elements
                });
                State.fire('@{history&save.snapshot}');
            } else if (v.id >= 3 && v.id <= 6) {
                StageElements["@{adjust.z.index}"](v.id, selected[0], cells);
                me.updater.digest(props);
                State.fire('@{history&save.snapshot}');
            } else if (v.id >= 8 && v.id <= 13) {
                Table["@{operate.row.or.col}"](props, MenusMap[v.id]);
                State.fire('@{property&element.property.update}');
                State.fire('@{property&element.property.change}', {
                    data: props,
                    eId: id
                });
                State.fire('@{history&save.snapshot}');
            } /*else if (v.id >= 15 && v.id <= 18) {
                Table["@{operate.cell}"](props, MenuCellsMap[v.id]);
                State.fire('@{property&element.property.update}');
                State.fire('@{property&element.property.change}', {
                    data: props,
                    eId: id
                });
                State.fire('@{history&save.snapshot}');
            }*/
        });
    },
    '@{delete.table}<click>'() {
        let { id } = this['@{data}'];
        StageElements["@{delete.element.by.id}"](id, false);
        State.fire('@{stage&elements.change}');
        State.fire('@{history&save.snapshot}');
    }
});