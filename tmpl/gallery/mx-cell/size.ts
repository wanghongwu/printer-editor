/*
    author:xinglie.lkf@alibaba-inc.com
*/
import $ from '$';
import Magix from 'magix';
import Convert from '../../util/converter';
import Table from '../../util/table';
import CNC from '../../cainiao/const';
Magix.applyStyle('@size.less');
export default Magix.View.extend({
    tmpl: '@size.html',
    init(data) {
        this.assign(data);
        this['@{owner.node}'] = $('#' + this.id);
    },
    assign(data) {
        let { rows, rowIndex, colIndex } = data.props;
        let row = rows[rowIndex];
        if (!row) {
            console.error(`can not find ${rowIndex} row,use first as default`);
            row = rows[0];
        }
        let col = row.cells[colIndex];
        if (!col) {
            console.error(`can not find ${colIndex} cell,use first as default`);
            col = row.cells[0];
        }
        this.updater.set({
            col,
            props: data.props,
            mSize: CNC.TABLE_MIN_SIZE,
            read: Convert["@{pixel.to.millimeter}"],
            disabled: data.disabled
        });
        return true;
    },
    render() {
        this.updater.digest();
    },
    '@{set.auto}<change>'(e) {
        let { props, col } = this.updater.get();
        let auto = e.eventTarget.checked;
        col.autoHeight = auto;
        if (auto) {
            col.height = CNC.TABLE_ROWS_HEIGHT;
        }
        // if (!col.id) {
        //     col.id = Magix.guid('td_');
        // }
        Table["@{update.cells.metas}"](props);
        this['@{owner.node}'].trigger('change');
    },
    '@{set}<input,change>'(e) {
        let { type } = e.params;
        let { props, col } = this.updater.get();
        let num = Convert["@{millimeter.to.pixel}"](e.value);
        if (type == 'row') {
            col.height = num;
        } else if (type == 'col') {
            col.width = num;
        }
        if (!col.id) {
            col.id = Magix.guid('td_');
        }
        Table["@{update.cells.metas}"](props, { col });
        this['@{owner.node}'].trigger('change');
    }
});