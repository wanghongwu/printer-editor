/*
    author:xinglie.lkf@alibaba-inc.com
*/
import $ from '$';
import Magix from 'magix';
import Convert from '../../util/converter';
import Table from '../../util/table';
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
            row,
            col,
            props: data.props,
            read: Convert["@{pixel.to.millimeter}"],
            disabled: data.disabled
        });
        return true;
    },
    render() {
        this.updater.digest();
    },
    '@{set}<input>'(e) {
        let { type } = e.params;
        let num = Convert["@{millimeter.to.pixel}"](e.value);
        let { props, row } = this.updater.get();
        if (type == 'row') {
            row.height = num;
        } else if (type == 'col') {
            for (let r of props.rows) {
                let c = r.cells[props.colIndex];
                if (c) {
                    c.width = num;
                }
            }
        }
        Table["@{table.fix}"](props);
        this['@{owner.node}'].trigger('change');
    }
});