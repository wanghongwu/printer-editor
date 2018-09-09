import CNC from '../cainiao/const';
export default {
    '@{operate.row.or.col}'(props, type) {
        let { rows, rowIndex, colIndex } = props;
        let update = false;
        if (type == 'r') {//delete row
            let row = rows[rowIndex];
            if (row && rows.length > 1) {//行存在且大于1我们才真正删除
                rows.splice(rowIndex, 1);
                update = true;
                if (props.rowIndex > 0) props.rowIndex--;
            }
        } else if (type == 'c') {//delete col
            let exists = true;
            for (let r of rows) {
                if (r.cells.length <= 1 || !r.cells[colIndex]) {
                    exists = false;
                    break;
                }
            }
            if (exists) {
                for (let r of rows) {
                    r.cells.splice(colIndex, 1);
                }
                update = true;
                if (props.colIndex > 0) props.colIndex--;
            }
        } else if (type == 'rt') {//add row top
            let row = rows[rowIndex];
            if (row) {
                update = true;
                let cloned = {
                    tag: 'tr',
                    height: CNC.TABLE_ROWS_HEIGHT,
                    cells: []
                };
                for (let c of row.cells) {
                    if (c.tag == 'td') {
                        cloned.cells.push({
                            tag: 'td',
                            width: c.width
                        });
                    }
                }
                rows.splice(rowIndex, 0, cloned);
                props.rowIndex++;
            }
        } else if (type == 'rb') {//add row bottom
            let row = rows[rowIndex];
            if (row) {
                update = true;
                let cloned = {
                    tag: 'tr',
                    height: CNC.TABLE_ROWS_HEIGHT,
                    cells: []
                };
                for (let c of row.cells) {
                    if (c.tag == 'td') {
                        cloned.cells.push({
                            tag: 'td',
                            width: c.width
                        });
                    }
                }
                rows.splice(rowIndex + 1, 0, cloned);
            }
        } else if (type == 'cb') {//add col before
            for (let r of rows) {
                let cell = {
                    tag: 'td',
                    width: CNC.TABLE_CELLS_WIDTH
                };
                r.cells.splice(colIndex, 0, cell);
            }
            props.colIndex++;
            update = true;
        } else if (type == 'ca') {//add col after
            for (let r of rows) {
                let cell = {
                    tag: 'td',
                    width: CNC.TABLE_CELLS_WIDTH
                };
                r.cells.splice(colIndex + 1, 0, cell);
            }
            update = true;
        }
        if (update) {
            this["@{table.fix}"](props);
        }
        return update;
    },
    '@{table.fix}'(props) {
        let rows = props.rows;
        let height = 0, width = 0;
        for (let r of rows) {
            if (r.tag != '#script') {
                height += r.height;
                let maxWidth = 0;
                for (let c of r.cells) {
                    if (c.tag != '#script') {
                        maxWidth += c.width;
                    }
                }
                if (maxWidth > width) {
                    width = maxWidth;
                }
            }
        }
        props.height = height;
        props.width = width;
    },
    '@{move.focus}'(props, key) {
        let { rows, rowIndex, colIndex } = props;
        if (rowIndex < 0 || colIndex < 0) return;
        let update = false;
        let row = rows[rowIndex];
        if (key == 'left') {
            if (row) {
                let c = row.cells[colIndex - 1];
                if (c) {
                    props.colIndex--;
                    update = true;
                }
            }
        } else if (key == 'right') {
            if (row) {
                let c = row.cells[colIndex + 1];
                if (c) {
                    props.colIndex++;
                    update = true;
                }
            }
        } else if (key == 'top') {
            let r = rows[rowIndex - 1];
            if (r) {
                props.rowIndex--;
                update = true;
            }
        } else if (key == 'bottom') {
            let r = rows[rowIndex + 1];
            if (r) {
                props.rowIndex++;
                update = true;
            }
        }
        return update;
    },
    '@{set.col.width}'(rows, colIndex, width) {
        let update = false;
        for (let r of rows) {
            if (r.tag != '#script') {
                let cells = r.cells;
                let start = -1;
                for (let c of cells) {
                    if (c.tag != '#script') {
                        start++;
                        if (start == colIndex) {
                            c.width = width;
                            update = true;
                            break;
                        }
                    }
                }
            }
        }
        return update;
    }
}