import Designer from '../../editor/core/designer';
import PropsDesc from '../../editor/const/props-desc';
import Convert from '../../util/converter';
import CNC from '../../cainiao/const';
let Base = Designer.prototype;
export default Designer.extend({
    init() {
        let me = this;
        me.updater.set({
            elementPath: 'element/rect/index'
        });
        Base.init.apply(me, arguments);
    }
}, {
        title: '矩形',
        type: 'rect',
        modifier: {
            resize: true,
            resizeX: true,
            resizeY: true,
            resizeXY: true
        },
        getProps(x, y) {
            return {
                zIndex: 0,
                x: 0 + x,
                y: 0 + y,
                width: 200,
                borderWidth: 1,
                borderType: 'solid',
                fill: false,
                rotate: 0,
                height: 80,
                locked: false,
                tip: '矩形'
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
            tip: '矩形宽度',
            key: 'width',
            type: PropsDesc.NUMBER,
            min: 0.01,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '矩形高度',
            key: 'height',
            type: PropsDesc.NUMBER,
            min: 0.01,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '边框宽度',
            key: 'borderWidth',
            type: PropsDesc.NUMBER,
            min: '0'
        }, {
            tip: '边框样式',
            key: 'borderType',
            type: PropsDesc.DROPDOWN,
            textKey: 'text',
            valueKey: 'value',
            items: CNC.LINE_TYPES
        }, {
            tip: '是否填充',
            key: 'fill',
            type: PropsDesc.BOOLEAN
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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="42" height="28" x="9" y="16" style="fill:none;stroke-width:2;stroke:#fff"/></svg>`
    });