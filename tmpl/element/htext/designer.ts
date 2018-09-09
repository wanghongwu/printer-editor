import Designer from '../../editor/core/designer';
import PropsDesc from '../../editor/const/props-desc';
import Convert from '../../util/converter';
import CNC from '../../cainiao/const';
let WriteCNAdapter = (b, prop) => {
    if (b) {
        prop._x = prop.x;
        prop._y = prop.y;
        prop._width = prop.width;
        prop._height = prop.height;
        prop.x = 0.76;
        prop.y = 0.76;
        prop.width = -3.77;
        prop.height = -3.77;
    } else {
        prop.x = prop._x;
        prop.y = prop._y;
        prop.width = prop._width;
        prop.height = prop._height;
    }
    prop.xLocked = b;
    prop.yLocked = b;
    prop.widthLocked = b;
    prop.heightLocked = b;
    prop.zIndex = 0;
    return b;
};
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
        title: '横排文本',
        type: 'htext',
        modifier: {
            rotate: true,
            resize: true,
            resizeX: true,
            resizeY: true,
            resizeXY: true
        },
        writeAdapter: WriteCNAdapter,
        getProps(x, y) {
            return {
                zIndex: 0,
                x,
                y,
                width: 94.49,
                height: 18.9,
                locked: false,
                rotate: 0,
                alpha: 1,
                supportCNStyle: false,
                useCNStyle: false,
                fontFamily: 'SimHei',
                fontSize: 8,
                lineHeight: ['', 'mm'],
                fontStyle: [],
                align: ['left', 'top'],
                letterSpacing: 0,
                fontWeight: 'normal',
                text: '',
                alias: '',
                direction: 'ltr',
                color: '-1',
                tip: '横排文本'
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
            tip: '文本长度',
            key: 'width',
            type: PropsDesc.NUMBER,
            min: 0.01,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '文本高度',
            key: 'height',
            type: PropsDesc.NUMBER,
            min: 0.01,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '菜鸟逻辑',
            key: 'useCNStyle',
            ifKey: 'supportCNStyle',
            ifValue: true,
            type: PropsDesc.BOOLEAN,
            refresh: true,
            write: WriteCNAdapter
        }, {
            tip: '旋转角度',
            key: 'rotate',
            type: PropsDesc.NUMBER,
            min: -360,
            max: 360
        }, {
            tip: '透明度',
            key: 'alpha',
            type: PropsDesc.NUMBER,
            min: '0',
            max: 1,
            fixed: 1,
            step: 0.1
        }, {
            tip: '字体',
            key: 'fontFamily',
            type: PropsDesc.DROPDOWN,
            textKey: 'text',
            valueKey: 'value',
            items: CNC.FONT_FAMILIES
        }, {
            tip: '字号',
            key: 'fontSize',
            type: PropsDesc.NUMBER,
            min: '0'
        }, {
            tip: '字间距',
            key: 'letterSpacing',
            type: PropsDesc.NUMBER,
            min: '0'
        }, {
            tip: '行高',
            key: 'lineHeight',
            type: PropsDesc.LINEHEIGHT,
            min: '0'
        }, {
            tip: '颜色',
            key: 'color',
            type: PropsDesc.DROPDOWN,
            textKey: 'text',
            valueKey: 'value',
            items: [{ text: '默认', value: '-1' }, { text: '黑底白字', value: 1 }]
        }, {
            tip: '字体粗细',
            key: 'fontWeight',
            type: PropsDesc.DROPDOWN,
            items: CNC.FONT_WEIGHTS
        }, {
            tip: '输出方向',
            key: 'direction',
            type: PropsDesc.DROPDOWN,
            items: CNC.DIRECTIONS,
        }, {
            tip: '样式',
            key: 'fontStyle',
            type: PropsDesc.FONTSTYLE
        }, {
            tip: '排列',
            key: 'align',
            type: PropsDesc.FONTALIGN
        }, {
            tip: '文本内容',
            key: 'text',
            type: PropsDesc.TEXTAREA
        }, {
            tip: '文本别名',
            key: 'alias',
            type: PropsDesc.INPUT
        }, {
            type: PropsDesc.SPLITER
        }, {
            tip: '编辑锁定',
            type: PropsDesc.BOOLEAN,
            key: 'locked',
            role: 'free'
        }, {
            tip: '组件树名称',
            key: 'tip',
            type: PropsDesc.INPUT,
            role: 'free'
        }],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="stroke:#fff;stroke-width:2" d="M 15 20 L 45 20 M 15 30 L 30 30 M 15 40 L 38 40" /></svg>`
    });