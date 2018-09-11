import Magix, { View, State } from 'magix';
import PropsDesc from '../const/props-desc';
import Transform from '../../util/transform';
import Table from '../../util/table';
import $ from '$';
Magix.applyStyle('@property.less');
export default View.extend({
    tmpl: '@property.html',
    init() {
        let me = this;
        let update = me['@{throttle}'](() => {
            me.render();
        }, 100);
        State.on('@{stage&select.elements.change}', update);
        State.on('@{property&element.property.update}', update);
    },
    render() {
        let elements = State.get('@{stage&select.elements}');
        if (elements.length === 1) {
            let { ctor, props, id } = elements[0];
            this.updater.digest({
                hasElement: true,
                title: ctor.title,
                desc: PropsDesc,
                props: ctor.props,
                data: props,
                eId: id
            });
        } else {
            this.updater.digest({
                elements: Transform["@{get.sorted.elements}"](State.get('@{stage&elements}')),
                hasElement: false
            });
        }
    },
    '@{cell.change}<change>'(e) {
        let updater = this.updater;
        let data = updater.get('data');
        let eId = updater.get('eId');
        State.fire('@{property&element.property.change}', {
            data,
            eId
        });
        this.render();
        State.fire('@{history&save.snapshot}');
    },
    '@{set.cell.share}<click>'(e) {
        let updater = this.updater;
        let data = updater.get('data');
        let eId = updater.get('eId');
        let u = Table["@{update.cells.metas}"](data, {
            share: e.params.type
        });
        if (u) {
            State.fire('@{property&element.property.change}', {
                data,
                eId
            });
            this.render();
            State.fire('@{history&save.snapshot}');
        }
    },
    '@{prop.change}<input,change>'(e) {
        let updater = this.updater;
        let data = updater.get('data');
        let eId = updater.get('eId');
        let { key, read, bool, write, refresh, sync } = e.params;
        let resetXY = key == 'width' || key == 'height',
            old;
        if (resetXY) {
            old = Transform["@{get.rect.xy}"](data, data.rotate);
        }
        let value;
        if (bool) {
            value = e.eventTarget.checked;
        } else {
            value = read ? e[read] : $(e.eventTarget).val();
        }
        if (write) {
            value = write(value, data);
        }
        if (sync) {
            data[sync] = value;
        }
        data[key] = value;
        if (resetXY) {
            let n = Transform["@{get.rect.xy}"](data, data.rotate);
            data.x += old.x - n.x;
            data.y += old.y - n.y;
            refresh = true;
        }
        if (bool || refresh) {
            this.render();
        }
        State.fire('@{property&element.property.change}', {
            data,
            eId
        });
        State.fire('@{history&save.snapshot}');
    },
    '@{image.change}<change>'(e) {
        let updater = this.updater;
        let scale = State.get('@{stage&scale}');
        let data = updater.get('data');
        let eId = updater.get('eId');
        let params = e.params;
        let pic = e.pic;
        data[params.key] = pic.src;
        if (params.updateSize) {
            data.width = pic.width * scale;
            data.height = pic.height * scale;
        }
        this.render();
        State.fire('@{property&element.property.change}', {
            data,
            eId
        });
        State.fire('@{history&save.snapshot}');
    },
    '@{set.origin.size}<click>'() {
        let updater = this.updater;
        let data = updater.get('data');
        let eId = updater.get('eId');
        let scale = State.get('@{stage&scale}');
        let src = data.src;
        let img = new Image();
        let me = this;
        let old = Transform["@{get.rect.xy}"](data, data.rotate);
        img.onerror = () => {
            me.alert('获取图片尺寸失败，请重试～～');
        };
        img.onload = () => {
            data.width = img.width * scale;
            data.height = img.height * scale;
            let n = Transform["@{get.rect.xy}"](data, data.rotate);
            data.x += old.x - n.x;
            data.y += old.y - n.y;
            this.render();
            State.fire('@{property&element.property.change}', {
                data,
                eId
            });
            State.fire('@{history&save.snapshot}');
        };
        img.src = src;
    },
    '@{sort.finish}<dragfinish>'(e) {
        let lis = $(e.eventTarget).find('li');
        let elements = State.get('@{stage&elements}');
        let map = Magix.toMap(elements, 'id');
        let c = elements.length;
        for (let li of lis) {
            let id = li.getAttribute('data-eid');
            map[id].props.zIndex = c--;
        }
        this.render();
        State.fire('@{stage&elements.change}');
        State.fire('@{history&save.snapshot}');
    },
    '@{del}<click>'(e) {
        let elements = State.get('@{stage&elements}');
        elements.splice(e.params.i, 1);
        this.updater.digest({
            elements
        });
        State.set({
            '@{property&hover.active.element}': null
        });
        State.fire('@{property&hover.element}');
        State.fire('@{stage&elements.change}');
        State.fire('@{history&save.snapshot}');
    },
    '@{fake.active}<mouseover,mouseout>'(e) {
        let flag = Magix.inside(e.relatedTarget, e.eventTarget);
        if (!flag) {
            State.set({
                '@{property&hover.active.element}': e.params.element
            });
            State.fire('@{property&hover.element}');
        }
    }
});