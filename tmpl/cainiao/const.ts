export default {
    ELEMENT_CTRL_SPACE: 3,//元素控制器空隙
    RESIZER_SIZE: 3,//调整器半径大小
    EDITOR_NAME_SPACE: 'http://cloudprint.cainiao.com/schema/editor',
    XSI_NAME_SPACE: 'http://www.w3.org/2001/XMLSchema-instance',
    SCHEMA_LOCATION_NAME_SPACE: 'http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd',
    CLOUD_PRINT_NAME_SPACE: 'http://cloudprint.cainiao.com/print',
    PAGE_WIDTH_MAX: 1200,//page最大宽度，单位是mm
    PAGE_WIDTH_MIN: 1,//最小宽度，单位是mm
    PAGE_HEIGHT_MAX: 1200,//最大高度，单位是mm
    PAGE_HEIGHT_MIN: 1,//最小高度，单位是mm
    PAGE_WIDTH_DEFAULT: 793.7,//默认宽，单位是px
    PAGE_HEIGHT_DEFAULT: 1122.51,//默认高，单位是px //以上单位不一致只是配置上的，方便程序读取
    SCALE_DEFAULT: 1,//默认缩放级别
    SCALE_MAX: 5,//最大缩放级别
    SCALE_MIN: 0.5,//最小缩放级别
    SCALE_STEP: 0.25,//一次缩放比率
    LINE_TYPES: [{ text: '实线', value: 'solid' },//线条类型
    { text: '虚线', value: 'dashed' },
    { text: '点线', value: 'dotted' }],
    FONT_FAMILIES: [{ "value": 'SimSun', "text": '宋体' },//字体集合
    { "value": 'SimHei', "text": '黑体' },
    { "value": "Arial", "text": "Arial" },
    { "value": "Times New Roman", "text": "Times New Roman" },
    { "value": "Tahoma", "text": "Tahoma" },
    { "value": "webdings", "text": "webdings" },
    { "value": "Arial Black", "text": "Arial Black" },
    { "value": "Arial Narrow", "text": "Arial Narrow" },
    { "value": "Arial Unicode MS", "text": "Arial Unicode MS" }],
    FONT_WEIGHTS: ['normal', 'bold', 'light'],//加粗
    DIRECTIONS: ['ltr', 'rtl'],//阅读方向
    QRCODES: [{ text: 'qrcode', value: 'qrcode' },//二维码类型
    { text: 'pdf417', value: 'pdf417' },
    { text: 'Maxicode', value: 'maxicode' },
    { text: 'Data Matrix', value: 'datamatrix' }],
    QRCODES_MAXICODE_SCHEMA: [2, 3, 4, 5, 6],//schema
    BARCODES: [{ value: 'code128', text: 'code128' },//条形码类型
    { value: 'code93', text: 'code93' },
    { value: 'code39', text: 'code39' },
    { value: 'upca', text: 'UPC-A' },
    { value: 'upce', text: 'UPC-E' },
    { value: 'ean8', text: 'EAN8' },
    { value: 'ean13', text: 'EAN13' },
    { value: 'itf14', text: 'ITF14' },
    { value: 'c25inter', text: 'Interleaved 2 of 5' }],
    TABLE_ROWS_HEIGHT: 20,//表格默认行高，单位px
    TABLE_CELLS_WIDTH: 200,//表格默认宽度，单位px
    HISTORY_MAX: 100,//历史记录最大数量
    PAGES: [{
        text: 'A1',
        width: 594,
        height: 841
    }, {//常用尺寸
        text: 'A2',
        width: 420,
        height: 594
    }, {
        text: 'A3',
        width: 297,
        height: 420
    }, {
        text: 'A4',//下面单位是mm
        width: 210,
        height: 297
    }, {
        text: 'A5',
        width: 148,
        height: 210
    }, {
        text: 'A6',
        width: 105,
        height: 148
    }, {
        text: 'A7',
        width: 74,
        height: 105
    }, {
        text: 'B1',
        width: 707,
        heihgt: 1000
    }, {
        text: 'B2',
        width: 500,
        height: 707
    }, {
        text: 'B3',
        width: 353,
        height: 500
    }, {
        text: 'B4',
        width: 250,
        height: 353
    }, {
        text: 'B5',
        width: 176,
        height: 250
    }, {
        text: 'B6',
        width: 125,
        height: 176
    }, {
        text: 'B7',
        width: 88,
        height: 125
    }, {
        text: 'C1',
        width: 648,
        height: 917
    }, {
        text: 'C2',
        width: 458,
        height: 648
    }, {
        text: 'C3',
        width: 324,
        height: 458
    }, {
        text: 'C4',
        width: 229,
        height: 324
    }, {
        text: 'C5',
        width: 162,
        height: 229
    }, {
        text: 'C6',
        width: 114,
        height: 162
    }, {
        text: 'C7',
        width: 81,
        height: 114
    }]
};