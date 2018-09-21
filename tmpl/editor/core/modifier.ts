import { View, State } from 'magix';
import Convert from '../../util/converter';
import CNC from '../../cainiao/const';
export default View.extend({
    tmpl: '@modifier.html',
    init() {
        let me = this;
        me.updater.set({
            showRect: false,
            space: CNC.ELEMENT_CTRL_SPACE,
            rectX: 0,
            rectY: 0,
            rectWidth: 0,
            rectHeight: 0,
            hoverElement: State.get('@{property&hover.active.element}'),
            transformProps(props) {
                let p = {
                    rotate: props.rotate,
                    width: props.width,
                    height: props.height,
                    x: props.x,
                    y: props.y
                };
                let cell = State.get('@{property&hover.element.cell}');
                if (cell) {
                    p.x += cell.pos.x;
                    p.y += cell.pos.y;
                    if (props.useCNStyle) {
                        p.width = cell.width * 0.92;
                        p.height = cell.height * 0.92;
                    }
                }
                let t = Convert["@{stage.to.outer}"](p);
                p.x = t.x;
                p.y = t.y;
                return p;
            }
        });
        State.on('@{property&hover.element}', () => {
            me.updater.set({
                hoverElement: State.get('@{property&hover.active.element}')
            });
            me.render();
        });
    },
    render() {
        this.updater.digest();
    },
    '@{drag.rect}'(begin, end) {
        let width = Math.abs(begin.x - end.x);
        let height = Math.abs(begin.y - end.y);
        let left = Math.min(begin.x, end.x);
        let top = Math.min(begin.y, end.y);
        this.updater.digest({
            showRect: true,
            rectX: left,
            rectY: top,
            rectWidth: width,
            rectHeight: height
        });
    },
    '@{drag.end}'() {
        this.updater.digest({
            showRect: false
        });
    }
});