import Magix, { View, State } from 'magix';
import $ from '$';
import { StageSelectElements, StageElements, Clipboard } from '../../editor/core/workaround';
import * as Dragdrop from '../../gallery/mx-dragdrop/index';
import Table from '../../util/table';
import CNC from '../../cainiao/const';
import Keys from '../../editor/const/keys';
import Transform from '../../util/transform';
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
        this.updater.set(data.props);
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
        let data = this['@{data}'];
        data.props.rowIndex = row;
        data.props.colIndex = col;
        this.assign(data);
        this.render();
        State.fire('@{property&element.property.update}');
        StageSelectElements["@{set}"](data);
    },
    '@{start.resize}<mousedown>'(e) {
        if (e.from == 'element_table') return;
        e.from = 'element_table';
        let { props, id } = this['@{data}'];
        if (props.locked) return;
        let rows = props.rows;
        let { ri: rowIndex,
            ci: colIndex,
            pci: pureCellIndex,
            type } = e.params;
        let beginX = e.pageX, beginY = e.pageY;
        let row = rows[rowIndex];
        let startHeight = row ? row.height : 0;
        let startWidth = row ? (row.cells[colIndex] ? row.cells[colIndex].width : 0) : 0;
        let moved = false;
        this.dragdrop(e.eventTarget, (evt) => {
            let dx = evt.pageX - beginX;
            let dy = evt.pageY - beginY;
            let update = false;
            if (type == 'row') {
                let height = startHeight + dy;
                if (row) {
                    row.height = Math.max(0, height);
                    update = true;
                }
            } else if (type == 'col') {
                let width = Math.max(0, startWidth + dx);
                update = Table["@{set.col.width}"](rows, pureCellIndex, width);
            }
            if (update) {
                moved = true;
                Table["@{table.fix}"](props);
                State.fire('@{property&element.property.change}', {
                    data: props,
                    eId: id
                });
                State.fire('@{property&element.property.update}');
            }
        }, () => {
            if (moved) {
                State.fire('@{history&save.snapshot}');
            }
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
            height = row.height || CNC.TABLE_ROWS_HEIGHT;
            width = cell.width || CNC.TABLE_CELLS_WIDTH;
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
                Table["@{table.fix}"](props);
                State.fire('@{property&element.property.update}');
                State.fire('@{property&element.property.change}', {
                    data: props,
                    eId: id
                });
                State.fire('@{history&save.snapshot}');
            }
        });
    },
    '@{delete.table}<click>'() {
        let { id } = this['@{data}'];
        StageElements["@{delete.element.by.id}"](id, false);
        State.fire('@{stage&elements.change}');
        State.fire('@{history&save.snapshot}');
    }
});