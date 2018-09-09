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
        title: '二维码',
        type: 'qrcode',
        modifier: {
            resize: true,
            resizeXY: true
        },
        getProps(x, y) {
            return {
                zIndex: 0,
                x: 0 + x,
                y: 0 + y,
                width: 113.39,
                alpha: 1,
                rotate: 0,
                height: 113.39,
                locked: false,
                text: '',
                schema: 2,
                primary: '',
                type: 'qrcode',
                tip: '二维码'
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
            tip: '二维码宽度',
            key: 'width',
            type: PropsDesc.NUMBER,
            min: 0.01,
            max: 2800,
            fixed: 2,
            refresh: true,
            sync: 'height',
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '二维码高度',
            key: 'height',
            type: PropsDesc.NUMBER,
            min: 0.01,
            max: 2800,
            sync: 'width',
            fixed: 2,
            refresh: true,
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
            refresh: true,
            items: CNC.QRCODES
        }, {
            tip: '模式',
            type: PropsDesc.DROPDOWN,
            ifKey: 'type',
            ifValue: 'maxicode',
            key: 'schema',
            items: CNC.QRCODES_MAXICODE_SCHEMA
        }, {
            tip: 'primary',
            type: PropsDesc.INPUT,
            key: 'primary',
            ifKey: 'type',
            ifValue: 'maxicode'
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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="16" height="16" x="10" y="10" style="fill:none;stroke-width:2;stroke:#fff"/><rect width="16" height="16" x="34" y="10" style="fill:none;stroke-width:2;stroke:#fff"/><rect width="16" height="16" x="10" y="34" style="fill:none;stroke-width:2;stroke:#fff"/><rect width="6" height="6" x="15" y="15" style="fill:#fff;"/><rect width="6" height="6" x="39" y="15" style="fill:#fff;"/><rect width="6" height="6" x="15" y="39" style="fill:#fff;"/><rect width="4" height="4" x="34" y="34" style="fill:#fff;"/><rect width="4" height="4" x="46" y="34" style="fill:#fff;"/><rect width="4" height="8" x="38" y="38" style="fill:#fff;"/><rect width="4" height="4" x="34" y="46" style="fill:#fff;"/><rect width="5" height="4" x="43" y="46" style="fill:#fff;"/><rect width="4" height="8" x="46" y="42" style="fill:#fff;"/></svg>`
    });