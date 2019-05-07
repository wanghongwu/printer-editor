/*
    author:xinglie.lkf@alibaba-inc.com
*/
'ref@./property.less';
import Magix, { State } from 'magix';
import $ from '$';
import Convert from '../../util/converter';
import { StageElements } from './workaround';
import Transform from '../../util/transform';
export default Magix.View.extend({
    tmpl: '@p-table.html',
    init(data) {
        this.assign(data);
        this.updater.set({
            sorted(ems) {
                return Transform["@{get.sorted.elements}"](ems).reverse();
            }
        });
    },
    assign(data) {
        this.updater.set(data);
        return true;
    },
    render() {
        this.updater.digest();
    },
    '@{sort.finish}<dragfinish>'(e) {
        let lis = $(e.eventTarget).children();
        let elements = e.params.cell.children;
        let map = Magix.toMap(elements, 'id');
        let c = elements.length;
        for (let li of lis) {
            let id = li.getAttribute('data-eid');
            if (id) {
                map[id].props.zIndex = c--;
            }
        }
        this.render();
        State.fire('@{stage&elements.change}');
        State.fire('@{history&save.snapshot}');
    },
    '@{del}<click>'(e) {
        StageElements["@{delete.element.by.id}"](e.params.id, true);
        this.updater.set({
            rows: this.updater.get('rows')
        }).digest();
        State.set({
            '@{property&hover.active.element}': null,
            '@{property&hover.element.cell}': null
        });
        State.fire('@{property&hover.element}');
        State.fire('@{stage&elements.change}');
        State.fire('@{history&save.snapshot}');
    },
    '@{fake.active}<mouseover,mouseout>'(e) {
        if (e.from == 'p-table') return;
        e.from = 'p-table';
        let flag = Magix.inside(e.relatedTarget, e.eventTarget);
        if (!flag) {
            let { element, cellId, cell } = e.params;
            let cellInfo = null;
            if (e.type == 'mouseover') {
                let node = $('#entity_' + cellId);
                if (!node.length) {
                    return;
                }
                let oft = node.offset();
                cellInfo = {
                    width: cell.width,
                    height: cell.height,
                    pos: Convert["@{real.to.stage.coord}"]({
                        x: oft.left + 1,
                        y: oft.top + 1
                    })
                };
            }
            State.set({
                '@{property&hover.active.element}': element,
                '@{property&hover.element.cell}': cellInfo
            });
            State.fire('@{property&hover.element}');
        }
    }
});