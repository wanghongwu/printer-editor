import Designer from '../../editor/core/designer';
import PropsDesc from '../../editor/const/props-desc';
import Convert from '../../util/converter';
import CNC from '../../cainiao/const';
import I18n from '../../i18n/index';
let Base = Designer.prototype;
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
export default Designer.extend({
    init() {
        let me = this;
        me.updater.set({
            elementPath: '@./index'
        });
        Base.init.apply(me, arguments);
    }
}, {
        title: '@{element.text.v}',
        type: 'vtext',
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
                x,
                y,
                zIndex: 0,
                width: 22.68,
                height: 128.5,
                locked: false,
                rotate: 0,
                alpha: 1,
                supportCNStyle: false,
                useCNStyle: false,
                autoFontSize: false,
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
                tip: I18n('@{element.text.v}'),
                allowEdit: 1
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
            tip: '@{element.text.width}',
            key: 'width',
            type: PropsDesc.NUMBER,
            min: '0',
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '@{element.text.height}',
            key: 'height',
            type: PropsDesc.NUMBER,
            min: '0',
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, /*{
            tip: '@{element.text.cnstyle}',
            key: 'useCNStyle',
            ifShow: data => data.supportCNStyle,
            type: PropsDesc.BOOLEAN,
            refresh: true,
            write: WriteCNAdapter
        },*/ {
            tip: '@{element.rotate}',
            key: 'rotate',
            type: PropsDesc.NUMBER,
            min: -360,
            max: 360
        }, {
            tip: '@{element.alpha}',
            key: 'alpha',
            type: PropsDesc.NUMBER,
            min: '0',
            max: 1,
            fixed: 2,
            step: 0.1
        }, {
            tip: '@{element.text.ff}',
            key: 'fontFamily',
            type: PropsDesc.DROPDOWN,
            textKey: 'text',
            valueKey: 'value',
            items: CNC.FONT_FAMILIES
        }, {
            tip: '@{element.text.fsize}',
            key: 'fontSize',
            type: PropsDesc.NUMBER,
            min: '0',
            step: 1,
            fixed: 2
        }, {
            tip: '@{element.text.auto.fsize}',
            key: 'autoFontSize',
            type: PropsDesc.BOOLEAN,
            write(v, prop) {
                prop.fontSizeLocked = v;
                return v;
            }
        }, {
            tip: '@{element.text.lspacing}',
            key: 'letterSpacing',
            type: PropsDesc.NUMBER,
            min: '0'
        }, {
            tip: '@{element.text.lineheight}',
            key: 'lineHeight',
            type: PropsDesc.LINEHEIGHT,
            min: '0'
        }, {
            tip: '@{element.text.color}',
            key: 'color',
            type: PropsDesc.DROPDOWN,
            textKey: 'text',
            valueKey: 'value',
            items: [
                { text: '@{element.text.color.default}', value: '-1' },
                { text: '@{element.text.color.wob}', value: 1 }
            ]
        }, {
            tip: '@{element.text.weight}',
            key: 'fontWeight',
            type: PropsDesc.DROPDOWN,
            items: CNC.FONT_WEIGHTS
        }, {
            tip: '@{element.text.dir}',
            key: 'direction',
            type: PropsDesc.DROPDOWN,
            items: CNC.DIRECTIONS
        }, {
            tip: '@{element.text.style}',
            key: 'fontStyle',
            type: PropsDesc.FONTSTYLE
        }, {
            tip: '@{element.text.align}',
            key: 'align',
            type: PropsDesc.FONTALIGN
        }, {
            tip: '@{element.text.content}',
            key: 'text',
            type: PropsDesc.TEXTAREA,
            styleVTop: 1,
            ifShow: data => data.allowEdit > 0
        }, {
            tip: '@{element.text.alias}',
            key: 'alias',
            type: PropsDesc.INPUT,
            ifShow: data => data.allowEdit > 0,
            refresh: true,
            sync: 'tip'
        }, {
            type: PropsDesc.SPLITER
        }, {
            tip: '@{element.lock}',
            type: PropsDesc.BOOLEAN,
            key: 'locked',
            role: 'free'
        }, {
            tip: '@{element.name}',
            key: 'tip',
            type: PropsDesc.INPUT,
            role: 'free'
        }],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path style="stroke:#fff;stroke-width:2" d="M 20 15 L 20 45 M 31 17 L 31 30 M 40 15 L 40 38" /></svg>`
    });