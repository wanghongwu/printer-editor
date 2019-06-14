//thx https://github.com/ckeditor/ckeditor5-table
import CNC from '../cainiao/const';
import Magix from 'magix';
let GetCells = (rows, options: {
    startRow?: number
    endRow?: number
    column?: number
} = {}) => {
    let spannedCells = {};
    let { startRow, endRow, column } = options;
    let markSpannedCell = (row, col, ref) => {
        if (!spannedCells[row]) {
            spannedCells[row] = {};
        }
        let rowSpans = spannedCells[row];
        rowSpans[col] = ref;
    };
    let recordSpans = (row, col, rowspan, colspan) => {
        let ref = { row, cell: col };
        for (let i = col + 1; i < col + colspan; i++) {
            markSpannedCell(row, i, ref);
        }
        for (let j = row + 1; j < row + rowspan; j++) {
            for (let i = col; i < col + colspan; i++) {
                markSpannedCell(j, i, ref);
            }
        }
    };
    let isSpanned = (row, col) => {
        if (spannedCells[row]) {
            return spannedCells[row][col];
        }
        return 0;
    };
    let skipCell = (row, col, colspan) => {
        let skipRow = startRow !== undefined && row < startRow;
        if (skipRow) return 1;
        if (column !== undefined) {
            let current = column == col;
            let prev = col < column && col + colspan > column;
            return !current && !prev;
        }
        return 0;
    };
    let rowIndex = 0, colIndex = 0, cellIndex = 0;
    let cells = [];
    for (; ;) {
        let r = rows[rowIndex];
        if (!r || (endRow !== undefined && rowIndex > endRow)) {
            break;
        }
        let out = {
            row: rowIndex,
            col: colIndex,
            cell: cellIndex
        } as {
            row: number
            col: number
            data: boolean
            td: object
            rowspan: number
            colspan: number
            cell: number
            ref?: any
        }, ref;
        if ((ref = isSpanned(rowIndex, colIndex))) {
            if (!skipCell(rowIndex, colIndex, 1)) {
                out.ref = ref;
                cells.push(out);
            }
            colIndex++;
        } else {
            if (!r.cells || !r.cells[cellIndex]) {
                if (rowIndex === 0) {
                    cells.$c = colIndex;
                }
                rowIndex++;
                colIndex = 0;
                cellIndex = 0;
            } else {
                let c = r.cells[cellIndex];
                let colspan = c.colspan || 1;
                let rowspan = c.rowspan || 1;
                out.rowspan = rowspan;
                out.colspan = colspan;
                if (rowspan > 1 || colspan > 1) {
                    recordSpans(rowIndex, colIndex, rowspan, colspan);
                }
                if (!skipCell(rowIndex, colIndex, colspan)) {
                    out.data = true;
                    out.td = r.cells[cellIndex];
                    cells.push(out);
                }
                colIndex++;
                cellIndex++;
            }
        }
    }
    return cells;
};
let AddCellId = cell => {
    if (!cell.id) {
        cell.id = Magix.guid('td_');
    }
};
let GetNewRows = rows => {
    let newRows = [];
    for (let r of rows) {
        let cells = [];
        if (r.tag == 'tr') {
            let newRecord = {
                tag: r.tag,
                cells
            }
            if (r.cells) {
                for (let c of r.cells) {
                    if (c.tag == 'td') {
                        cells.push(c);
                    }
                }
            }
            newRows.push(newRecord);
        }
    }
    return newRows;
};
let FindCell = (cells, current, index, step) => {
    let located = null;
    do {
        let c = cells[index += step];
        if (c) {
            if (c.ref) {
                c = c.ref;
            }
            if (c.row != current.row || c.cell != current.cell) {
                located = c;
                break;
            }
        } else {
            break;
        }
    } while (true);
    return located;
};
let FindRowIndex = (rows, cell) => {
    for (let i = 0; i < rows.length; i++) {
        let r = rows[i];
        if (r.cells) {
            for (let c of r.cells) {
                if (c.tag == 'td' && c.id == cell.id) {
                    return i;
                }
            }
        }
    }
    return -1;
};
let FindCellByPureCol = (row, col) => {
    let index = -1,
        cells = row.cells,
        cell,
        i = 0;
    if (cells) {
        let count = 0,
            ci = 0;
        for (; i < cells.length; i++) {
            let c = cells[i];
            if (c.tag == 'td') {
                if (col == count) {
                    index = i;
                    cell = c;
                    break;
                }
                count++;
                ci = i;
            }
        }
        if (index == -1) {
            if (col == (1 + count)) {
                index = ci + 1;
            } else {
                index = i;
            }
        }
    }
    return { index, cell };
};
let FindRowIndexByPureRow = (rows, row) => {
    let index = -1, count = 0, i = 0, ci = 0;
    for (; i < rows.length; i++) {
        let r = rows[i];
        if (r.tag == 'tr') {
            if (count == row) {
                index = i;
                break;
            }
            count++;
            ci = i;
        }
    }
    if (index == -1) {
        if ((count + 1) == row) {
            index = ci + 1;
        } else {
            index = i;
        }
    }
    return index;
};
let CreateRows = (count, height) => {
    let row = {
        tag: 'tr',
        cells: []
    };
    for (let i = 0; i < count; i++) {
        row.cells.push({
            tag: 'td',
            hasBorder: true,
            height: height
        });
    }
    return row;
};

let FocusCell = (props, cell) => {
    let { rowIndex, colIndex, rows } = props;
    let update = false;
    if (cell) {
        AddCellId(cell);
        for (let i = 0; i < rows.length; i++) {
            let r = rows[i],
                stop = false;
            if (r.tag == 'tr') {
                if (r.cells) {
                    for (let j = 0; j < r.cells.length; j++) {
                        let c = r.cells[j];
                        if (c.tag == 'td' && c.id == cell.id) {
                            if (rowIndex != i || colIndex != j) {
                                update = true;
                                props.rowIndex = i;
                                props.colIndex = j;
                            }
                            stop = true;
                            break;
                        }
                    }
                }
            }
            if (stop) {
                break;
            }
        }
    }
    return update;
};
let BreakSpanEvenly = (span, numberOfCells) => {
    if (span < numberOfCells) {
        return { newCellsSpan: 1, updatedSpan: 1 };
    }

    let newCellsSpan = Math.floor(span / numberOfCells);
    let updatedSpan = (span - newCellsSpan * numberOfCells) + newCellsSpan;

    return { newCellsSpan, updatedSpan };
};
let GetHorCell = (props, dir) => {
    let { rows, rowIndex, colIndex } = props;
    let cells = rows[rowIndex].cells;
    let start = colIndex,
        horCell = null,
        cell = cells[start];
    if (dir == 'left') {
        while (--start >= 0) {
            let c = cells[start];
            if (c && c.tag == 'td') {
                horCell = c;
                break;
            }
        }
    } else if (dir == 'right') {
        while (++start < cells.length) {
            let c = cells[start];
            if (c && c.tag == 'td') {
                horCell = c;
                break;
            }
        }
    }
    if (!horCell) {
        return null;
    }
    let cellOnLeft = dir == 'right' ? cell : horCell;
    let cellOnRight = dir == 'right' ? horCell : cell;
    let newRows = GetNewRows(rows);
    AddCellId(cellOnLeft);
    AddCellId(cellOnRight);
    let newRowIndex = FindRowIndex(newRows, cell);
    let leftCellColumn = -1,
        rightCellColumn = -1;
    let pCells = GetCells(newRows, {
        startRow: newRowIndex,
        endRow: newRowIndex
    });
    for (let c of pCells) {
        if (c.data) {
            if (c.td.id == cellOnLeft.id) {
                leftCellColumn = c.col;
            } else if (c.td.id == cellOnRight.id) {
                rightCellColumn = c.col;
            }
        }
    }
    let leftCellSpan = cellOnLeft.colspan || 1;
    let cellsTouching = leftCellColumn + leftCellSpan == rightCellColumn;
    return cellsTouching ? horCell : null;

};
let GetVerCell = (props, dir) => {
    let { rows, rowIndex, colIndex } = props;
    let newRows = GetNewRows(rows);
    let cells = rows[rowIndex].cells;
    let cell = cells[colIndex];
    AddCellId(cell);
    let newRowIndex = FindRowIndex(newRows, cell);
    if ((dir == 'down' && newRowIndex == newRows.length - 1) ||
        (dir == 'up' && newRowIndex === 0)) {
        return;
    }
    let rowspan = cell.rowspan || 1;
    let rowOfCellToMerge = dir == 'down' ? newRowIndex + rowspan : newRowIndex;
    let pCells = GetCells(newRows, {
        endRow: rowOfCellToMerge
    });
    let mergeColumn = -1,
        mergeCell = null;
    for (let c of pCells) {
        if (c.data) {
            if (c.td.id == cell.id) {
                mergeColumn = c.col;
            }
        }
    }
    for (let c of pCells) {
        if (c.data) {
            if (c.col == mergeColumn) {
                let rowspan = c.rowspan || 1;
                if ((dir == 'down' && c.row == rowOfCellToMerge) ||
                    (dir == 'up' && c.row + rowspan == rowOfCellToMerge)) {
                    mergeCell = c.td;
                    break;
                }
            }
        }
    }
    return mergeCell;
};
let GetMergeableCell = (props, dir) => {
    let { rows, rowIndex, colIndex } = props;
    let isHor = (dir == 'left' || dir == 'right');
    let cellToMerge = isHor ? GetHorCell(props, dir) : GetVerCell(props, dir);
    if (!cellToMerge) return;
    let span = isHor ? 'rowspan' : 'colspan';
    let cell = rows[rowIndex].cells[colIndex];
    let spanNumber = cell[span] || 1;
    let mergeSpan = cellToMerge[span] || 1;
    if (spanNumber == mergeSpan) {
        return cellToMerge;
    }
};
let FindFocusCell = (props, key) => {
    let { rows, rowIndex, colIndex } = props;
    if (rowIndex < 0 || colIndex < 0) return;
    let currentCell = rows[rowIndex].cells[colIndex];
    AddCellId(currentCell);
    let newRows = GetNewRows(rows);
    let cells = GetCells(newRows),
        focusedCell = null;
    for (let i = 0; i < cells.length; i++) {
        let c = cells[i];
        if (c.data) {
            let nc = newRows[c.row].cells[c.cell];
            if (nc.id == currentCell.id) {
                if (key == 'left') {
                    if (c.col > 0) {
                        let prev = FindCell(cells, c, i, -1);
                        if (prev) {
                            focusedCell = newRows[prev.row].cells[prev.cell];
                        }
                    }
                } else if (key == 'right') {
                    if (c.col < cells.$c - 1) {
                        let next = FindCell(cells, c, i, 1);
                        if (next) {
                            focusedCell = newRows[next.row].cells[next.cell];
                        }
                    }
                } else if (key == 'top') {
                    let prev = FindCell(cells, c, i, -cells.$c);
                    if (prev) {
                        focusedCell = newRows[prev.row].cells[prev.cell];
                    }
                } else if (key == 'bottom') {
                    let next = FindCell(cells, c, i, cells.$c);
                    if (next) {
                        focusedCell = newRows[next.row].cells[next.cell];
                    }
                }
                break;
            }
        }
    }
    return focusedCell;
};
let FindNearestCell = (rows, current, toTop) => {
    if (toTop) {
        while (current > 0) {
            current--;
            if (rows[current].tag == 'tr') {
                return current + 1;
            }
        }
        return 0;
    } else {
        while (current < rows.length) {
            if (rows[current].tag == 'tr') {
                return current + 1;
            }
            current++;
        }
        return current;
    }
};
export default {
    '@{operate.row.or.col}'(props, type) {
        let update = false;
        if (type == 'r') {//delete row
            update = this['@{delete.rows}'](props);
        } else if (type == 'c') {//delete col
            update = this['@{delete.columns}'](props);
        } else if (type == 'rt') {//add row top
            update = this['@{insert.rows}'](props, 0);
        } else if (type == 'rb') {//add row bottom
            update = this['@{insert.rows}'](props, 1);
        } else if (type == 'cb') {//add col before
            update = this['@{insert.columns}'](props, 0);
        } else if (type == 'ca') {//add col after
            update = this['@{insert.columns}'](props, 1);
        }
        if (update) {
            this['@{update.cells.metas}'](props, {
                fsize: props.lockSize
            });
        }
        return update;
    },
    '@{operate.cell}'(props, type) {
        let update = false;
        if (type == 'sh') {
            update = this['@{hor.split.cell}'](props, 2);
        } else if (type == 'sv') {
            update = this['@{ver.split.cell}'](props, 2);
        } else if (type == 'ml') {
            update = this['@{merge.cells}'](props, 'left');
        } else if (type == 'mr') {
            update = this['@{merge.cells}'](props, 'right');
        } else if (type == 'mu') {
            update = this['@{merge.cells}'](props, 'up');
        } else if (type == 'md') {
            update = this['@{merge.cells}'](props, 'down');
        }
        if (update) {
            this['@{update.cells.metas}'](props);
        }
        return update;
    },
    '@{merge.cells}'(props, dir) {
        let update = false;
        let isHor = (dir == 'left' || dir == 'right');
        let cellToMerge = GetMergeableCell(props, dir);
        if (cellToMerge) {
            let { rows, rowIndex, colIndex } = props;
            let cell = rows[rowIndex].cells[colIndex];
            let mergeNext = dir == 'right' || dir == 'down';
            let cellToExpand = mergeNext ? cell : cellToMerge;
            let cellToRemove = mergeNext ? cellToMerge : cell;
            if (isHor) {
                cellToExpand.width += cellToRemove.width;
            } else {
                cellToExpand.height += cellToRemove.height;
            }
            AddCellId(cellToRemove);
            AddCellId(cellToExpand);
            let exists = cellToExpand.children || (cellToExpand.children = []);
            let removed = cellToRemove.children;
            if (removed) {
                for (let r of removed) {
                    r.zIndex = exists.length + 1;
                    exists.push(r);
                }
            }
            let oRowIndex = FindRowIndex(rows, cellToRemove);
            let oRow = rows[oRowIndex];
            let oCells = oRow.cells,
                hasTd = false;

            let newRows = GetNewRows(rows);
            let removeIndex = FindRowIndex(newRows, cellToRemove);
            for (let i = oCells.length; i--;) {
                let c = oCells[i];
                if (c.tag == 'td') {
                    if (c.id == cellToRemove.id) {
                        oCells.splice(i, 1);
                    } else {
                        hasTd = true;
                    }
                }
            }

            let spanAttribute = isHor ? 'colspan' : 'rowspan';
            let cellSpan = cell[spanAttribute] || 1;
            let cellToMergeSpan = cellToMerge[spanAttribute] || 1;
            cellToExpand[spanAttribute] = cellSpan + cellToMergeSpan;
            if (!hasTd) {
                let pCells = GetCells(newRows, {
                    endRow: removeIndex
                });
                for (let c of pCells) {
                    if (c.data) {
                        let rowspan = c.rowspan || 1;
                        let overlapsRemovedRow = c.row + rowspan - 1 >= removeIndex;
                        if (overlapsRemovedRow) {
                            c.td.rowspan -= 1;
                        }
                    }
                }
                rows.splice(oRowIndex, 1);
            }
            FocusCell(props, cellToExpand);
            update = true;
        }
        return update;
    },
    '@{hor.split.cell}'(props, numberOfCells) {
        let { rows, rowIndex, colIndex } = props;
        let rCells = rows[rowIndex].cells;
        if (!rCells) return;
        let update = false;
        let cell = rCells[colIndex];
        let colspan = cell.colspan || 1;
        let rowspan = cell.rowspan || 1;
        let width = cell.width / numberOfCells;
        if (colspan > 1) {
            cell.width = -1;
            let { newCellsSpan, updatedSpan } = BreakSpanEvenly(colspan, numberOfCells);
            cell.colspan = updatedSpan;
            let insert = colspan > numberOfCells ? numberOfCells - 1 : colspan - 1;
            for (let i = 0; i < insert; i++) {
                let newCell = {
                    tag: 'td',
                    hasBorder: true,
                    width: -1
                } as {
                    hasBorder?: boolean
                    colspan?: number
                    rowspan?: number
                };
                if (newCellsSpan > 1) {
                    newCell.colspan = newCellsSpan;
                }
                if (rowspan > 1) {
                    newCell.rowspan = rowspan;
                }
                rCells.splice(colIndex + 1, 0, newCell);
            }
            update = true;
        }
        if (colspan < numberOfCells) {
            cell.width = width;
            let cellsToInsert = numberOfCells - colspan;
            let newRows = GetNewRows(rows);
            let cells = GetCells(newRows);
            AddCellId(cell);
            let splitCellColumn = -1;
            for (let c of cells) {
                if (c.data && c.td.id == cell.id) {
                    splitCellColumn = c.col;
                    break;
                }
            }
            for (let c of cells) {
                if (c.data) {
                    let td = c.td;
                    let isOnSameCol = cell.id != td.id && c.col == splitCellColumn;
                    let spanOverCol = c.col < splitCellColumn && c.colspan + c.col > splitCellColumn;
                    if (isOnSameCol || spanOverCol) {
                        if (!td.colspan) td.colspan = 1;
                        td.colspan += cellsToInsert;
                    }
                }
            }
            for (let i = 0; i < cellsToInsert; i++) {
                let newCell = {
                    tag: 'td',
                    hasBorder: true,
                    width
                } as {
                    hasBorder?: boolean
                    colspan?: number
                    rowspan?: number
                };
                if (rowspan > 1) {
                    newCell.rowspan = rowspan;
                }
                rCells.splice(colIndex + 1, 0, newCell);
            }
            update = true;
        }

        return update
    },
    '@{ver.split.cell}'(props, numberOfCells) {
        let { rows, rowIndex, colIndex } = props;
        let rCells = rows[rowIndex].cells;
        if (!rCells) return;
        let update = false;
        let cell = rCells[colIndex];
        let colspan = cell.colspan || 1;
        let rowspan = cell.rowspan || 1;
        let newRows = GetNewRows(rows);
        AddCellId(cell);
        let newRowIndex = FindRowIndex(newRows, cell);
        let height = cell.height / numberOfCells;
        if (rowspan > 1) {
            cell.height = -1;
            let cells = GetCells(newRows, {
                startRow: newRowIndex,
                endRow: newRowIndex + rowspan - 1
            });
            let { newCellsSpan, updatedSpan } = BreakSpanEvenly(rowspan, numberOfCells);
            cell.rowspan = updatedSpan;
            let cellColumn = -1;
            for (let c of cells) {
                if (c.data && c.td.id == cell.id) {
                    cellColumn = c.col;
                    break;
                }
            }
            for (let c of cells) {
                let { col, row, cell } = c;
                let isAfterSplitCell = row >= newRowIndex + updatedSpan;
                let isOnSameColumn = col === cellColumn;
                let isInEvenlySplitRow = (row + newRowIndex + updatedSpan) % newCellsSpan === 0;
                if (isAfterSplitCell && isOnSameColumn && isInEvenlySplitRow) {
                    let oRowIndex = FindRowIndexByPureRow(rows, row);
                    let oRow = rows[oRowIndex];
                    let { index } = FindCellByPureCol(oRow, cell);
                    oRow.cells.splice(index, 0, {
                        tag: 'td',
                        colspan,
                        height,
                        hasBorder: true,
                        width: cell.width,
                        rowspan: newCellsSpan
                    });
                }
            }
            update = true;
        }
        if (rowspan < numberOfCells) {
            cell.height = height;
            let cellsToInsert = numberOfCells - rowspan;
            let cells = GetCells(newRows, {
                startRow: 0,
                endRow: newRowIndex
            });
            for (let c of cells) {
                if (c.data) {
                    let td = c.td;
                    let rowspan = c.rowspan || 1;
                    if (td.id != cell.id) {
                        if (c.row + rowspan > newRowIndex) {
                            let rowspanToSet = rowspan + cellsToInsert;
                            c.td.rowspan = rowspanToSet;
                        }
                    }
                }
            }
            let oRowIndex = FindRowIndexByPureRow(rows, newRowIndex);
            let rowRecord = {
                tag: 'tr',
                cells: [{
                    tag: 'td',
                    hasBorder: true,
                    width: cell.width,
                    colspan
                }]
            };
            rows.splice(oRowIndex + 1, 0, rowRecord);
            update = true;
        }
        return update;
    },
    '@{delete.columns}'(props) {
        let { rows, rowIndex, colIndex } = props;
        let rCells = rows[rowIndex].cells;
        if (!rCells) return;
        let focused = false;
        focused = FindFocusCell(props, 'left');
        if (!focused) {
            focused = FindFocusCell(props, 'right');
        }
        let cell = rCells[colIndex];
        let newRows = GetNewRows(rows);
        AddCellId(cell);
        let cells = GetCells(newRows);
        if (cells.$c <= 1) return;
        let removedColumn;
        for (let c of cells) {
            if (c.data && c.td.id == cell.id) {
                removedColumn = c.col;
                break;
            }
        }
        for (let c of cells) {
            if (c.data) {
                if (c.col <= removedColumn &&
                    c.colspan > 1 &&
                    c.col + c.colspan > removedColumn) {
                    c.td.colspan--;
                } else if (c.col == removedColumn) {
                    let oRowIndex = FindRowIndexByPureRow(rows, c.row);
                    let oCells = rows[oRowIndex].cells;
                    AddCellId(c.td);
                    for (let i = oCells.length; i--;) {
                        if (oCells[i].id == c.td.id) {
                            oCells.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        // console.log(cell);
        if (!focused) {
            props.rowIndex = -1;
            props.colIndex = -1;
        } else {
            FocusCell(props, focused);
        }
        return true;
    },
    '@{delete.rows}'(props) {
        let { rows, rowIndex, colIndex } = props;
        let rCells = rows[rowIndex].cells;
        if (!rCells) return;

        let focused = false;
        focused = FindFocusCell(props, 'top');
        if (!focused) {
            focused = FindFocusCell(props, 'bottom');
        }
        let cell = rCells[colIndex];
        let newRows = GetNewRows(rows);
        if (newRows.length <= 1) return;
        AddCellId(cell);
        let newRowIndex = FindRowIndex(newRows, cell);
        let cells = GetCells(newRows, {
            endRow: newRowIndex
        });
        let cellsToMove = {};
        for (let c of cells) {
            if (c.data) {
                if (c.row === newRowIndex) {
                    if (c.rowspan && c.rowspan > 1) {
                        cellsToMove[c.col] = {
                            td: c.td,
                            rowspan: c.rowspan - 1
                        };
                    }
                } else if (c.row < newRowIndex) {
                    if (c.row + c.rowspan > newRowIndex) {
                        c.td.rowspan--;
                    }
                }
            }
        }
        cells = GetCells(newRows, {
            endRow: newRowIndex + 1,
            startRow: newRowIndex + 1
        });
        let previousCell;
        let oRowIndex = FindRowIndexByPureRow(rows, newRowIndex);
        let oCells = rows[oRowIndex].cells;
        for (let c of cells) {
            if (cellsToMove[c.col]) {
                let { td, rowspan } = cellsToMove[c.col];
                td.children = [];
                if (previousCell) {
                    AddCellId(previousCell);
                    for (let i = oCells.length; i--;) {
                        if (oCells[i].id == previousCell.id) {
                            oCells.splice(i, 0, td);
                            break;
                        }
                    }
                } else {
                    let ri = FindRowIndexByPureRow(rows, c.row);
                    rows[ri].cells.unshift(td);
                }
                td.rowspan = rowspan;
                previousCell = td;
            } else {
                previousCell = c.td;
            }
        }
        let removed = FindRowIndexByPureRow(rows, newRowIndex);
        rows.splice(removed, 1);
        if (!focused) {
            props.rowIndex = -1;
            props.colIndex = -1;
        } else {
            FocusCell(props, focused);
        }
        return true;
    },
    '@{insert.rows}'(props, at) {
        let { rows, rowIndex, colIndex } = props;
        let rCells = rows[rowIndex].cells;
        if (!rCells) return;

        let cell = rCells[colIndex];
        let newRows = GetNewRows(rows);
        AddCellId(cell);
        let newRowIndex = FindRowIndex(newRows, cell);
        let cells = GetCells(newRows, {
            startRow: newRowIndex,
            endRow: newRowIndex
        });
        let columnsCount = cells.$c,
            moveDownwards = at === 0;
        at += newRowIndex;
        if (at === 0 || at === newRows.length) {
            let record = CreateRows(columnsCount, cell.height);
            let i = FindRowIndexByPureRow(rows, at === 0 ? at : at + 1);
            //let j = FindNearestCell(rows, i, moveDownwards);
            rows.splice(i, 0, record);
            if (moveDownwards) {
                props.rowIndex++;
            }
            return true;
        } else {
            cells = GetCells(newRows, {
                endRow: at
            });
            let cellsToInsert = 0;
            for (let c of cells) {
                if (c.data) {
                    let isBeforeInsertedRow = c.row < at;
                    let overlapsInsertedRow = c.row + c.rowspan > at;
                    if (isBeforeInsertedRow && overlapsInsertedRow) {
                        c.td.rowspan++;
                    }
                    if (c.row === at) {
                        cellsToInsert += (c.colspan || 1);
                    }
                }
            }
            let record = CreateRows(cellsToInsert, cell.height);
            let insert = FindRowIndexByPureRow(rows, at);
            //let j = FindNearestCell(rows, insert, moveDownwards);
            rows.splice(insert, 0, record);
            if (moveDownwards) {
                props.rowIndex++;
            }
            return true;
        }
    },
    '@{insert.columns}'(props, at) {
        let { rows, rowIndex, colIndex } = props;
        let rCells = rows[rowIndex].cells;
        if (!rCells) return;

        let cell = rCells[colIndex];
        let newRows = GetNewRows(rows);
        AddCellId(cell);
        let newRowIndex = FindRowIndex(newRows, cell);
        let cells = GetCells(newRows, {
            startRow: newRowIndex,
            endRow: newRowIndex
        });
        let columnsCount = cells.$c,
            moveBackwards = at === 0;
        for (let e of cells) {
            if (e.data && e.td.id == cell.id) {
                at = e.col + at;
                break;
            }
        }
        if (at === 0 || at === columnsCount) {
            for (let r of rows) {
                if (r.tag == 'tr') {
                    let { index: insert } = FindCellByPureCol(r, at === 0 ? at : at + 1);
                    r.cells.splice(insert, 0, {
                        tag: 'td',
                        hasBorder: true,
                        width: cell.width
                    });
                }
            }
            if (moveBackwards) {
                props.colIndex++;
            }
            return true;
        } else {
            cells = GetCells(newRows, {
                column: at
            });
            let skippedRows = {};
            for (let c of cells) {
                if (skippedRows[c.row] === 1) {
                    continue;
                }
                let row = FindRowIndexByPureRow(rows, c.row);
                let r = rows[row];
                let { index: insert, cell: oCell } = FindCellByPureCol(r, c.cell);
                if (c.col == at) {
                    r.cells.splice(insert, 0, {
                        tag: 'td',
                        hasBorder: true,
                        width: cell.width
                    });
                } else {
                    if (oCell) {
                        oCell.colspan++;
                    }
                    skippedRows[c.row] = 1;
                    if (c.rowspan > 1) {
                        for (let i = c.row + 1; i < c.row + c.rowspan; i++) {
                            skippedRows[i] = 1;
                        }
                    }
                }
            }
            if (moveBackwards) {
                props.colIndex++;
            }
            return true;
        }
    },
    '@{move.focus}'(props, key) {
        let focusedCell = FindFocusCell(props, key);
        let update = FocusCell(props, focusedCell);
        return update;
    },
    '@{get.cell.by.pure.location}'(rows, rowIndex, colIndex) {
        let i = 0, j = 0, cell = null;
        for (let r of rows) {
            if (r.tag == 'tr') {
                let stop = false;
                if (r.cells && rowIndex === i) {
                    for (let c of r.cells) {
                        if (c.tag == 'td') {
                            if (colIndex === j) {
                                stop = true;
                                cell = r.cells[j];
                                break;
                            }
                            j++;
                        }
                    }
                }
                if (stop) {
                    break;
                }
                i++;
            }
        }
        return cell;
    },
    '@{update.cells.metas}'(props, options = {} as {
        col?: any,
        share?: string,
        lw?: boolean,
        fsize?: boolean
        rowHeights?: number[]
        colWidths?: number[]
        nextRow?: number
        nextCol?: number,
        changeType?: string
    }) {
        if (props.__invalid) return;
        let { col, share, lw, fsize, nextRow, nextCol, changeType } = options;
        let rows = props.rows;
        let newRows = GetNewRows(rows);
        let cells = GetCells(newRows);
        let reduceRows = [],
            reduceCols = [];
        for (let c of cells) {
            if (c.data) {
                let colspan = (c.colspan || 1) - 1;
                let rowspan = (c.rowspan || 1) - 1;
                if (reduceCols[c.col] === undefined || reduceCols[c.col] > colspan) {
                    reduceCols[c.col] = colspan;
                }
                if (reduceRows[c.row] === undefined || reduceRows[c.row] > rowspan) {
                    reduceRows[c.row] = rowspan;
                }
            }
        }
        for (let c of cells) {
            if (c.data) {
                let td = c.td;
                let colspan = td.colspan;
                if (colspan > 1) {
                    for (let i = c.col; i < c.col + colspan; i++) {
                        td.colspan -= (reduceCols[i] || 0);
                    }
                }
                let rowspan = td.rowspan;
                if (rowspan > 1) {
                    let h = td.height / rowspan;
                    for (let i = c.row; i < c.row + rowspan; i++) {
                        td.rowspan -= (reduceRows[i] || 0);
                        td.height -= (reduceRows[i] || 0) * h;
                    }
                }
            }
        }
        cells = GetCells(newRows);
        let addCells = {},
            recordRows = {},
            added = 0,
            colCount = 0;
        for (let c of cells) {
            if (c.col > colCount) colCount = c.col;
            if (c.col == 0) {
                addCells[c.row] = (addCells[c.row] || 0) + (recordRows[c.row] || 0);
            }
            if (c.data) {
                let exists = addCells[c.row] || 0;
                let colspan = c.td.colspan || 1;
                let rowspan = c.td.rowspan || 1;
                for (let i = c.row + 1; i < c.row + rowspan; i++) {
                    recordRows[i] = (recordRows[i] || 0) + colspan;
                }
                addCells[c.row] = exists + colspan;
            }
        }
        let addRowIndex = 0;
        while (addRowIndex < newRows.length) {
            let exists = addCells[addRowIndex] || 0;
            let insert = colCount - exists + 1;
            if (insert > 0) {
                let oRowIndex = FindRowIndexByPureRow(rows, addRowIndex);
                while (insert > 0) {
                    added = 1;
                    rows[oRowIndex].cells.push({
                        tag: 'td',
                        hasBorder: true,
                        width: -1,
                        height: -1
                    });
                    insert--;
                }
            }
            addRowIndex++;
        }
        if (added) {
            newRows = GetNewRows(rows);
            cells = GetCells(newRows);
        }

        let colWidths = [],
            rowHeights = [],
            usedColWidth = false,
            usedRowHeight = false;
        //计算现存的列
        for (let c of cells) {
            if (c.data) {
                let ci = c.cell;
                let column = c.col;
                let cell = newRows[c.row].cells[ci];
                if (!c.colspan || c.colspan == 1) {
                    if (colWidths[column] === undefined ||
                        (cell.width > colWidths[column] && !usedColWidth) ||
                        (col && col.id == cell.id)) {
                        usedColWidth = usedColWidth || (col && col.id == cell.id);
                        colWidths[column] = cell.width;
                    }
                }
                if (!c.rowspan || c.rowspan == 1) {
                    if (rowHeights[c.row] === undefined ||
                        (cell.height > rowHeights[c.row] && !usedRowHeight) ||
                        (col && cell.id == col.id)) {
                        usedRowHeight = usedRowHeight || (col && cell.id == col.id);
                        rowHeights[c.row] = cell.height;
                    }
                }
            }
        }
        for (let c of cells) {
            if (c.data) {
                let ci = c.cell;
                let cci = c.col;
                let cell = newRows[c.row].cells[ci];
                if (cell.width >= 0 && c.colspan > 1) {
                    let hasWidth = 0, hasCells = 0;
                    for (let i = cci; i < cci + c.colspan; i++) {
                        if (colWidths[i] !== undefined && colWidths[i] >= 0) {
                            hasWidth += colWidths[i];
                            hasCells++;
                        }
                    }
                    if (hasCells < c.colspan) {
                        let w = Math.max(cell.width - hasWidth, 0) / (c.colspan - hasCells);
                        for (let i = cci; i < cci + c.colspan; i++) {
                            if (colWidths[i] === undefined || colWidths[i] < 0) {
                                colWidths[i] = w;
                            }
                        }
                    } else if ((hasWidth < cell.width && (!col || col.id == cell.id) ||
                        (hasWidth > cell.width && col && col.id == cell.id))) {
                        for (let i = cci; i < cci + c.colspan; i++) {
                            if (hasWidth > 0) {
                                colWidths[i] = colWidths[i] / hasWidth * cell.width;
                            } else {
                                colWidths[i] = cell.width / c.colspan;
                            }
                        }
                    }
                }
                if (cell.height >= 0 && c.rowspan > 1) {
                    let hasHeight = 0, hasRows = 0;
                    for (let i = c.row; i < c.row + c.rowspan; i++) {
                        if (rowHeights[i] !== undefined && rowHeights[i] >= 0) {
                            hasHeight += rowHeights[i];
                            hasRows++;
                        }
                    }
                    if (hasRows < c.rowspan) {
                        let h = Math.max(0, cell.height - hasHeight) / (c.rowspan - hasRows);
                        for (let i = c.row; i < c.row + c.rowspan; i++) {
                            if (rowHeights[i] === undefined || rowHeights[i] < 0) {
                                rowHeights[i] = h;
                            }
                        }
                    } else if ((hasHeight < cell.height && (!col || col.id == cell.id))
                        || (hasHeight > cell.height && col && col.id == cell.id)) {
                        for (let i = c.row; i < c.row + c.rowspan; i++) {
                            if (hasHeight > 0) {
                                rowHeights[i] = rowHeights[i] / hasHeight * cell.height;
                            } else {
                                rowHeights[i] = cell.height / c.rowspan;
                            }
                        }
                    }
                }
            }
        }
        if (col && props.lockSize) {
            if (changeType == 'row') {
                let rowspan = col.rowspan || 1;
                rowHeights[col.row + rowspan] = nextRow;
            }
            if (changeType == 'col') {
                let colspan = col.colspan || 1;
                colWidths[col.col + colspan] = nextCol;
            }
        }

        let width = 0,
            hasWidth = 0;
        for (let w of colWidths) {
            if (w >= 0) {
                width += w;
                hasWidth++;
            }
        }

        let height = 0,
            hasHeight = 0;
        for (let h of rowHeights) {
            if (h >= 0) {
                height += h;
                hasHeight++;
            }
        }
        if (hasWidth < colWidths.length) {
            let w = CNC.TABLE_CELLS_WIDTH;
            if (width < props.width) {
                w = (props.width - width) / (colWidths.length - hasWidth);
            }
            for (let i = colWidths.length; i--;) {
                if (colWidths[i] < 0) {
                    colWidths[i] = w;
                }
            }
        } else if (((lw || fsize) && width > props.width) ||
            (fsize && width < props.width)) {
            for (let i = colWidths.length; i--;) {
                colWidths[i] = colWidths[i] / width * props.width;
            }
        }
        if (hasHeight < rowHeights.length) {
            let h = CNC.TABLE_ROWS_HEIGHT;
            if (height < props.height) {
                h = (props.height - height) / (rowHeights.length - hasHeight);
            }
            for (let i = rowHeights.length; i--;) {
                if (rowHeights[i] < 0) {
                    rowHeights[i] = h;
                }
            }
        } else if (fsize && (height > props.height || height < props.height)) {
            for (let i = rowHeights.length; i--;) {
                rowHeights[i] = rowHeights[i] / height * props.height;
            }
        }
        width = 0;
        for (let w of colWidths) {
            width += w;
        }
        height = 0;
        for (let h of rowHeights) {
            height += h;
        }
        props.width = width;
        props.height = height;
        let shared = false;
        if (share) {
            if (share == 'x') {
                let w = width / colWidths.length;
                for (let i = colWidths.length; i--;) {
                    if (Math.abs(colWidths[i] - w) > 0.0001) {
                        shared = true;
                        colWidths[i] = w;
                    }
                }
            }
            if (share == 'y') {
                let h = height / rowHeights.length;
                for (let i = rowHeights.length; i--;) {
                    if (Math.abs(rowHeights[i] - h) > 0.0001) {
                        shared = true;
                        rowHeights[i] = h;
                    }
                }
            }
        }
        let prev = null,
            index = 0;
        for (let c of cells) {
            if (c.data) {
                let ci = c.cell;
                let rowIndex = c.row;
                let colIndex = c.col;
                let cell = newRows[rowIndex].cells[ci];
                let rowspan = cell.rowspan || 1;
                let colspan = cell.colspan || 1;
                cell.row = rowIndex;
                cell.col = colIndex;
                let w = 0, h = 0;
                for (let i = colIndex; i < colIndex + colspan; i++) {
                    w += colWidths[i];
                }
                for (let i = rowIndex; i < rowIndex + rowspan; i++) {
                    h += rowHeights[i];
                }
                if (prev && colIndex > 0) {
                    if (prev.ref) {
                        prev = prev.ref;
                    }
                    cell.left = {
                        row: prev.row,
                        col: prev.cell
                    };
                }
                if (rowIndex > 0) {
                    prev = cells[index - colWidths.length];
                    if (prev.ref) {
                        prev = prev.ref;
                    }
                    cell.top = {
                        row: prev.row,
                        col: prev.cell
                    };
                }
                cell.hasRight = (!props.lockSize ||
                    (colIndex + colspan) < colWidths.length);
                cell.hasBottom = (!props.lockSize ||
                    (rowIndex + rowspan) < rowHeights.length);
                cell.hasTop = rowIndex > 0;
                cell.width = w;
                cell.height = h;
            }
            prev = c;
            index++;
        }
        if (options) {
            options.colWidths = colWidths;
            options.rowHeights = rowHeights;
        }
        return shared;
    }
}