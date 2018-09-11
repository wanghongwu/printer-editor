import Designer from '../../editor/core/designer';
import PropsDesc from '../../editor/const/props-desc';
import Convert from '../../util/converter';
import CNC from '../../cainiao/const';
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
        title: '表格',
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
                tip: '表格'
            };
        },
        props: [{
            tip: 'X坐标',
            key: 'x',
            type: PropsDesc.NUMBER,
            fixed: 2,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: 'Y坐标',
            key: 'y',
            type: PropsDesc.NUMBER,
            fixed: 2,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '表格宽',
            key: 'width',
            type: PropsDesc.LABEL,
            read: Convert["@{pixel.to.millimeter}"]
        }, {
            tip: '表格高',
            key: 'height',
            type: PropsDesc.LABEL,
            read: Convert["@{pixel.to.millimeter}"]
        }, {
            tip: '隐藏边框',
            key: 'hideBorder',
            type: PropsDesc.BOOLEAN
        }, {
            tip: '分页打印',
            key: 'splitable',
            type: PropsDesc.BOOLEAN
        }, {
            tip: '均分宽',
            type: PropsDesc.CELLCOLSHARE
        }, {
            tip: '均分高',
            type: PropsDesc.CELLROWSHARE
        }, {
            tip: '单元格操作',
            type: PropsDesc.CELLOPERATE,
            gtKey: 'rowIndex',
            gtValue: -1
        }, {
            tip: '选取',
            type: PropsDesc.CELLFOCUS,
            gtKey: 'rowIndex',
            gtValue: -1
        }, {
            tip: '宽高',
            type: PropsDesc.CELLSIZE,
            gtKey: 'rowIndex',
            gtValue: -1
        }, {
            type: PropsDesc.SPLITER
        }, {
            tip: '编辑锁定',
            key: 'locked',
            type: PropsDesc.BOOLEAN,
            role: 'free'
        }, {
            tip: '组件树名称',
            key: 'tip',
            role: 'free',
            type: PropsDesc.INPUT
        }],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="stroke:#fff;stroke-width:2;fill:none" d="M 10 14 L 50 14 L 50 46 L 10 46 L 10 14" /><path style="stroke:#fff;stroke-width:1;fill:none" d="M 10 24 L 50 24 M 10 34 L 50 34 M 23 14 L 23 46 M 36 14 L 36 46" /></svg>`
    });