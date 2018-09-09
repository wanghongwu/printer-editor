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
        title: '垂直直线',
        type: 'vline',
        modifier: {
            resize: true,
            resizeY: true
        },
        getProps(x, y) {
            return {
                zIndex: 0,
                x: 0 + x,
                y: 0 + y,
                rotate: 0,
                width: 1.33,
                type: 'solid',
                height: 75.59,
                locked: false,
                tip: '垂直直线'
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
            tip: '线条高度',
            key: 'height',
            type: PropsDesc.NUMBER,
            min: 0.01,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '线条宽度',
            key: 'width',
            type: PropsDesc.NUMBER,
            min: 0.01,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.pt}"],
            write: Convert["@{pt.to.pixel}"]
        }, {
            tip: '线条样式',
            key: 'type',
            type: PropsDesc.DROPDOWN,
            textKey: 'text',
            valueKey: 'value',
            items: CNC.LINE_TYPES
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
            type: PropsDesc.INPUT,
            role: 'free'
        }],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M 29 10 L 29 50" style="stroke:#fff;stroke-width:2"/></svg>`
    });