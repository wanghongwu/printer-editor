import Designer from '../../editor/core/designer';
import PropsDesc from '../../editor/const/props-desc';
import Convert from '../../util/converter';
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
        title: '图片',
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
                width: 200,
                height: 200,
                tip: '图片',
                rotate: 0,
                src: '//img.alicdn.com/tfs/TB1E1OSryAnBKNjSZFvXXaTKXXa-200-200.png',
                locked: false,
                alpha: 1,
                x,
                y
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
            tip: '选择图片',
            key: 'src',
            type: PropsDesc.IMAGE,
            updateSize: true
        }, {
            tip: '宽',
            key: 'width',
            max: 2800,
            type: PropsDesc.NUMBER,
            min: 1,
            fixed: 2,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
        }, {
            tip: '高',
            key: 'height',
            type: PropsDesc.NUMBER,
            min: 1,
            fixed: 2,
            max: 2800,
            read: Convert["@{pixel.to.millimeter}"],
            write: Convert["@{millimeter.to.pixel}"]
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
            tip: '还原宽高',
            type: PropsDesc.ORIGINSIZE
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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="32" height="28" x="14" y="16" style="fill:none;stroke-width:2;stroke:#fff" rx="2" ry="2"/><circle cx="22" cy="24" r="4" style="fill:#fff" /><path style="stroke:#fff;stroke-width:2;fill:none" d="M 14 42 L 22 34 L 36 39 L 46 26" /></svg>`
    });