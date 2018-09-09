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
            transformCoord(props) {
                let xy = {
                    x: props.x,
                    y: props.y
                };
                return Convert["@{stage.to.outer}"](xy);
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