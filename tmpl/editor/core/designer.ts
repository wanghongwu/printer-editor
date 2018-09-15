import Magix, { State, Vframe } from 'magix';
import CNC from '../../cainiao/const';
import Convert from '../../util/converter';
import Transform from '../../util/transform';
import $ from '$';
import * as Dragdrop from '../../gallery/mx-dragdrop/index';
let Has = Magix.has;
const BaseIndex = {
    0: 1,
    2: 1,
    4: 1,
    6: 1,
    1: 2,
    5: 2,
    3: 3,
    7: 3
};
export default Magix.View.extend<Editor.Dragdrop>({
    tmpl: '@designer.html',
    mixins: [Dragdrop],
    init(data) {
        let me = this;
        me.assign(data);
        let selectChange = () => {
            me['@{check.status}']();
            me.render();
        };
        let propertyChange = (e: MagixGallery.IViewDOMEvent & {
            eId: string,
            data: any
        }) => {
            if (e.eId == data.id) {
                me.updater.digest({
                    props: e.data
                });
            }
        };
        State.on('@{stage&select.elements.change}', selectChange);
        State.on('@{property&element.property.change}', propertyChange);
        me.on('destroy', () => {
            State.off('@{stage&select.elements.change}', selectChange);
            State.off('@{property&element.property.change}', propertyChange);
        });
        me['@{owner.node}'] = $('#' + me.id);
    },
    '@{check.status}'() {
        let map = State.get('@{stage&select.elements.map}');
        let elements = State.get('@{stage&select.elements}');
        let count = elements.length;
        let updater = this.updater;
        let data = updater.get();
        let id = data.id;
        if (data.selected) {
            if (!Has(map, id)) {
                let vf = Vframe.get('entity_' + this.id);
                if (vf) {
                    vf.invoke('@{lost.select}');
                }
                console.log(id + ' lost select');
            }
        } else {
            if (Has(map, id)) {
                console.log(id + ' got select');
            }
        }
        updater.set({
            selected: Has(map, id),
            count
        });
    },
    assign({ id, ctor, props, type }) {
        this.updater.set({
            ctor,
            id,
            type,
            space: CNC.ELEMENT_CTRL_SPACE,
            size: CNC.RESIZER_SIZE,
            props,
        });
        this['@{check.status}']();
        return true;
    },
    render() {
        this.updater.digest();
    },
    '@{start.resize}<mousedown>'(e) {
        let me = this;
        e.stopPropagation();
        let data = me.updater.get();
        let { props, ctor } = data;
        if (props.locked) return;
        State.fire('@{stage&lock.scroll}', {
            locked: 1
        });
        let rotate = props.rotate || 0;
        let { key } = e.params;
        rotate = (rotate + 360) % 360;
        let beginWidth = props.width;
        let beginHeight = props.height;
        let beginX = props.x;
        let beginY = props.y;
        let minWidth = 0, minHeight = 0,
            maxWidth = Number.MAX_VALUE, maxHeight = Number.MAX_VALUE;
        for (let p of ctor.props) {
            if (p.key == 'width') {
                if (Magix.has(p, 'max')) {
                    maxWidth = p.max;
                }
                if (Magix.has(p, 'min')) {
                    minWidth = p.min;
                }
            } else if (p.key == 'height') {
                if (Magix.has(p, 'max')) {
                    maxHeight = p.max;
                }
                if (Magix.has(p, 'min')) {
                    minHeight = p.min;
                }
            }
        }
        let transformedRect = Transform["@{rotate.rect}"](props, rotate);
        // 获取当前点和对角线点
        let pointAndOpposite = Transform["@{get.point.and.opposite}"](transformedRect.point, key);

        let { opposite, current } = pointAndOpposite;
        // 对角线点的索引即为缩放基点索引
        let baseIndex = opposite.index;

        let oppositePoint: any = opposite.point;
        let currentPoint: any = current.point
        let oppositeX = oppositePoint.x;
        let oppositeY = oppositePoint.y;

        // 鼠标释放点距离当前点对角线点的偏移量
        let offsetWidth = Math.abs(currentPoint.x - oppositeX);
        let offsetHeight = Math.abs(currentPoint.y - oppositeY);
        let oPoint = {
            x: beginX,
            y: beginY,
            rotate,
            width: beginWidth,
            height: beginHeight
        };
        let ex = e.pageX, ey = e.pageY;
        let moved = false;
        me.dragdrop(e.eventTarget, evt => {
            let scale = {
                x: 1, y: 1
            };
            moved = true;
            let useX = offsetWidth > offsetHeight;
            let realScale = 1;
            let oX = evt.pageX - ex;
            let oY = evt.pageY - ey;
            if (baseIndex == 0 || baseIndex == 7) {
                if (useX && rotate > 90 && rotate < 270) {
                    oX = -oX;
                } else if (!useX && rotate > 180 && rotate < 360) {
                    oY = -oY;
                }
            } else if (baseIndex == 0 || baseIndex == 1) {
                if (useX && rotate > 45 && rotate < 135) {
                    oX = -oX;
                } else if (!useX && rotate > 90 && rotate < 270) {
                    oY = -oY;
                }
            }
            if (useX) {
                realScale = (oX + offsetWidth) / offsetWidth;
            } else {
                realScale = (oY + offsetHeight) / offsetHeight;
            }
            if (realScale < 0) return;
            let m = BaseIndex[baseIndex];
            if (m === 1) {
                scale.x = scale.y = realScale;
            } else if (m === 2) {
                scale.y = realScale;
            } else if (m === 3) {
                scale.x = realScale;
            }
            let newRect = Transform["@{get.new.rect}"](oPoint, scale, transformedRect, baseIndex);
            let width = Convert["@{to.float}"](newRect.width),
                height = Convert["@{to.float}"](newRect.height);
            if (width >= minWidth &&
                width <= maxWidth &&
                height >= minHeight &&
                height <= maxHeight) {
                props.x = Convert["@{to.float}"](newRect.left);
                props.y = Convert["@{to.float}"](newRect.top);
                props.width = width;
                props.height = height;
                me.updater.digest({
                    props
                });
                State.fire('@{property&element.property.update}');
            }
        }, () => {
            if (moved) {
                State.fire('@{history&save.snapshot}');
            }
            State.fire('@{stage&lock.scroll}');
        });
    },
    '@{start.rotate}<mousedown>'(e) {
        e.stopPropagation();
        let me = this;
        let props = me.updater.get('props');
        if (props.locked) return;

        let pos = Convert["@{real.to.nearest.coord}"](me['@{owner.node}'], {
            x: e.pageX,
            y: e.pageY
        });
        let c = Transform["@{element.center}"](props);
        let rotate = props.rotate;
        let sdeg = Math.atan2(pos.y - c.y, pos.x - c.x) - rotate * Math.PI / 180,
            moved = false;
        State.fire('@{stage&lock.scroll}', {
            locked: 1
        });
        me.dragdrop(e.eventTarget, (evt) => {
            let pos = Convert["@{real.to.nearest.coord}"](me['@{owner.node}'], {
                x: evt.pageX,
                y: evt.pageY
            });
            moved = true;
            let deg = Math.atan2(pos.y - c.y, pos.x - c.x);
            deg = (deg - sdeg) * 180 / Math.PI;
            props.rotate = (360 + (deg | 0)) % 360;
            me.updater.digest({
                props
            });
            State.fire('@{property&element.property.update}');
        }, () => {
            if (moved) {
                State.fire('@{history&save.snapshot}');
            }
            State.fire('@{stage&lock.scroll}');
        });
    },
    '@{text.editable}<dblclick>'(e) {
        let updater = this.updater;
        let props = updater.get('props');
        if (props.allowEdit) {
            props.editable = true;
            updater.digest({ props });
        }
    }
});