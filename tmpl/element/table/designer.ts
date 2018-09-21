import Designer from '../../editor/core/designer';
import PropsDesc from '../../editor/const/props-desc';
import Convert from '../../util/converter';
import CNC from '../../cainiao/const';
import I18n from '../../i18n/index';
import Table from '../../util/table';
let Base = Designer.prototype;
export default Designer.extend({
    init() {
        let me = this;
        me.updater.set({
            elementPath: '@./index'
        });
        Base.init.apply(me, arguments);
    }
}, {
        title: '@{element.table}',
        type: 'table',
        modifier: {
        },
        getProps(x, y) {
            return {
                zIndex: 0,
                x: 0 + x,
                y: 0 + y,
                rotate: 0,
                width: 3 * CNC.TABLE_CELLS_WIDTH,
                height: 2 * CNC.TABLE_ROWS_HEIGHT,
                rowIndex: -1,
                colIndex: -1,
                splitable: true,
                hideBorder: false,
                lockSize: false,
                rows: [{
                    tag: 'tr',
                    cells: [{
                        tag: 'td',
                        height: CNC.TABLE_ROWS_HEIGHT,
                        width: CNC.TABLE_CELLS_WIDTH
                    }, {
                        tag: 'td',
                        height: CNC.TABLE_ROWS_HEIGHT,
                        width: CNC.TABLE_CELLS_WIDTH
                    }, {
                        tag: 'td',
                        height: CNC.TABLE_ROWS_HEIGHT,
                        width: CNC.TABLE_CELLS_WIDTH
                    }]
                }, {
                    tag: 'tr',
                    cells: [{
                        tag: 'td',
                        height: CNC.TABLE_ROWS_HEIGHT,
                        width: CNC.TABLE_CELLS_WIDTH
                    }, {
                        tag: 'td',
                        height: CNC.TABLE_ROWS_HEIGHT,
                        width: CNC.TABLE_CELLS_WIDTH
                    }, {
                        tag: 'td',
                        height: CNC.TABLE_ROWS_HEIGHT,
                        width: CNC.TABLE_CELLS_WIDTH
                    }]
                }],
                locked: false,
                tip: I18n('@{element.table}')
            };
        },
        props: [{
            tip: '@{element.x}',
            key: 'x',
            type: PropsDesc.NUMBER,
            fixed: 2,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '@{element.y}',
            key: 'y',
            type: PropsDesc.NUMBER,
            fixed: 2,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '@{element.table.width}',
            key: 'width',
            type: PropsDesc.LABEL,
            read: Convert["@{pixel.to.millimeter}"]
        }, {
            tip: '@{element.table.height}',
            key: 'height',
            type: PropsDesc.LABEL,
            read: Convert["@{pixel.to.millimeter}"]
        }, {
            tip: '@{element.table.lockSize}',
            key: 'lockSize',
            type: PropsDesc.BOOLEAN,
            write(v, data) {
                data.lockSize = v;
                Table["@{update.cells.metas}"](data);
                return v;
            }
        }, {
            tip: '@{element.table.border}',
            key: 'hideBorder',
            type: PropsDesc.BOOLEAN
        }, {
            tip: '@{element.table.paging}',
            key: 'splitable',
            type: PropsDesc.BOOLEAN
        }, {
            tip: '@{element.table.dwidth}',
            type: PropsDesc.CELLCOLSHARE
        }, {
            tip: '@{element.table.dheight}',
            type: PropsDesc.CELLROWSHARE
        }, {
            tip: '@{element.table.pic}',
            type: PropsDesc.CELLFOCUS,
            gtKey: 'rowIndex',
            gtValue: -1
        }, {
            tip: '@{element.table.opcell}',
            styleVTop: 1,
            type: PropsDesc.CELLOPERATE,
            gtKey: 'rowIndex',
            gtValue: -1
        }, {
            tip: '@{element.table.cellsize}',
            styleVTop: 1,
            type: PropsDesc.CELLSIZE,
            gtKey: 'rowIndex',
            gtValue: -1
        }, {
            type: PropsDesc.SPLITER
        }, {
            tip: '@{element.lock}',
            key: 'locked',
            type: PropsDesc.BOOLEAN,
            role: 'free'
        }, {
            tip: '@{element.name}',
            key: 'tip',
            role: 'free',
            type: PropsDesc.INPUT
        }],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="stroke:#fff;stroke-width:2;fill:none" d="M 10 14 L 50 14 L 50 46 L 10 46 L 10 14" /><path style="stroke:#fff;stroke-width:1;fill:none" d="M 10 24 L 50 24 M 10 34 L 50 34 M 23 14 L 23 46 M 36 14 L 36 46" /></svg>`
    });