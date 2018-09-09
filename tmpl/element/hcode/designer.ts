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
        title: '横向条码',
        type: 'hcode',
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
                width: 151.18,
                alpha: 1,
                rotate: 0,
                height: 90.71,
                locked: false,
                text: '',
                showText: false,
                type: 'code128',
                tip: '横向条码'
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
            tip: '条码宽度',
            key: 'width',
            type: PropsDesc.NUMBER,
            min: 0.01,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '条码高度',
            key: 'height',
            type: PropsDesc.NUMBER,
            min: 0.01,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '透明度',
            type: PropsDesc.NUMBER,
            fixed: 1,
            step: 0.1,
            max: 1,
            min: '0',
            key: 'alpha'
        }, {
            tip: '内容',
            type: PropsDesc.TEXTAREA,
            key: 'text'
        }, {
            tip: '码式',
            type: PropsDesc.DROPDOWN,
            textKey: 'text',
            valueKey: 'value',
            key: 'type',
            items: CNC.BARCODES
        }, {
            tip: '显示文字',
            type: PropsDesc.BOOLEAN,
            key: 'showText'
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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="4" height="30" x="10" y="15" style="fill:#fff;"/><rect width="2" height="30" x="16" y="15" style="fill:#fff;"/><rect width="2" height="30" x="20" y="15" style="fill:#fff;"/><rect width="8" height="30" x="24" y="15" style="fill:#fff;"/><rect width="2" height="30" x="35" y="15" style="fill:#fff;"/><rect width="3" height="30" x="39" y="15" style="fill:#fff;"/><rect width="2" height="30" x="43" y="15" style="fill:#fff;"/><rect width="4" height="30" x="46" y="15" style="fill:#fff;"/></svg>`
    });