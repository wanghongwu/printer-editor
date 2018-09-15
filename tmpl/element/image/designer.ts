import Designer from '../../editor/core/designer';
import PropsDesc from '../../editor/const/props-desc';
import Convert from '../../util/converter';
import I18n from '../../i18n/index';
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
        title: '@{element.image}',
        type: 'image',
        modifier: {
            rotate: true,
            resize: true,
            resizeX: true,
            resizeY: true,
            resizeXY: true
        },
        getProps(x, y) {
            return {
                zIndex: 0,
                width: 188.98,
                height: 188.98,
                tip: I18n('@{element.image}'),
                rotate: 0,
                src: '//img.alicdn.com/tfs/TB1E1OSryAnBKNjSZFvXXaTKXXa-200-200.png',
                locked: false,
                alpha: 1,
                x,
                y
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
            tip: '@{element.image.choose}',
            key: 'src',
            type: PropsDesc.IMAGE,
            updateSize: true
        }, {
            tip: '@{element.width}',
            key: 'width',
            max: 2800,
            type: PropsDesc.NUMBER,
            min: 1,
            fixed: 2,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '@{element.height}',
            key: 'height',
            type: PropsDesc.NUMBER,
            min: 1,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
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
            fixed: 1,
            step: 0.1
        }, {
            tip: '@{element.image.size}',
            type: PropsDesc.ORIGINSIZE
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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="32" height="28" x="14" y="16" style="fill:none;stroke-width:2;stroke:#fff" rx="2" ry="2"/><circle cx="22" cy="24" r="4" style="fill:#fff" /><path style="stroke:#fff;stroke-width:2;fill:none" d="M 14 42 L 22 34 L 36 39 L 46 26" /></svg>`
    });