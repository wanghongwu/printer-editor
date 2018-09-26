import Designer from '../../editor/core/designer';
import PropsDesc from '../../editor/const/props-desc';
import Convert from '../../util/converter';
import CNC from '../../cainiao/const';
import I18n from '../../i18n/index';
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
        title: '@{element.rect}',
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
                width: 98.27,
                borderWidth: 1,
                borderType: 'solid',
                fill: false,
                rotate: 0,
                height: 98.27,
                locked: false,
                tip: I18n('@{element.rect}')
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
            tip: '@{element.rect.width}',
            key: 'width',
            type: PropsDesc.NUMBER,
            min: '0',
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '@{element.rect.height}',
            key: 'height',
            type: PropsDesc.NUMBER,
            min: '0',
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '@{element.rect.border.width}',
            key: 'borderWidth',
            type: PropsDesc.NUMBER,
            min: '0'
        }, {
            tip: '@{element.rect.border}',
            key: 'borderType',
            type: PropsDesc.DROPDOWN,
            textKey: 'text',
            valueKey: 'value',
            items: CNC.LINE_TYPES
        }, {
            tip: '@{element.rect.fill}',
            key: 'fill',
            type: PropsDesc.BOOLEAN
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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="42" height="28" x="9" y="16" style="fill:none;stroke-width:2;stroke:#fff"/></svg>`
    });