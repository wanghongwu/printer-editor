/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
import $ from '$';
import Convert from '../../util/converter';
import * as Dragdrop from '../../gallery/mx-dragdrop/index';
const State = Magix.State;
const ToMM = Convert["@{pixel.to.millimeter}"];
Magix.applyStyle('@axis.less');
export default Magix.View.extend<{
    syncScroll()
    rerender(draw?: boolean)
} & Editor.Dragdrop>({
    tmpl: '@axis.html',
    mixins: [Dragdrop],
    init(data) {
        let node = $('#' + data.cnt);
        node.on('scroll', () => {
            this.syncScroll();
        });
        this['@{scroll.node}'] = node;
        let updater = this.updater;
        let updateLines = () => {
            updater.set({
                xHelpers: State.get('@{stage&x.help.lines}'),
                yHelpers: State.get('@{stage&y.help.lines}')
            });
        };
        let timer = 0;
        let update = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                updateLines();
                this.rerender(true);
                this.syncScroll();
            }, 30);
        };
        updater.set({
            sLeft: 0,
            sTop: 0
        });
        updateLines();
        State.on('@{stage&ui.change}', update);
        State.on('@{history&status.change}', update);
        State.on('@{lang.change}', update);
        this['@{owner.node}'] = $('#' + this.id);
    },
    rerender(draw) {
        let node = this['@{scroll.node}'];
        let width = node.prop('scrollWidth') + 50;
        let height = node.prop('scrollHeight') + 50;
        let xStart = 0;
        let xEnd = 0;
        let axisWidth = 20;
        let yStart = 0;
        let yEnd = 0;
        let vHeight = 10;
        let vWidth = 10;
        if (draw) {
            let stage = $('#stage_stage');
            let outer = $('#stage_outer');
            let offset = stage.offset();
            let outerOffset = outer.offset();
            let left = Math.round(offset.left - outerOffset.left);
            xStart = left + axisWidth;
            xEnd = width - xStart;
            yStart = Math.round(offset.top - outerOffset.top);
            yEnd = height - yStart;
            vHeight = node.height();
            vWidth = node.width();
        }
        this.updater.digest({
            toMM: ToMM,
            scale: State.get('@{stage&scale}'),
            width,
            height,
            draw,
            xStart,
            xEnd,
            yStart,
            vHeight,
            vWidth,
            yEnd
        });
        this['@{x.axis}'] = $('#' + this.id + '_x');
        this['@{y.axis}'] = $('#' + this.id + '_y');
        this['@{y.axis.help}'] = $('#' + this.id + '_y_help');
        this['@{x.axis.help}'] = $('#' + this.id + '_x_help');
        this['@{x.line}'] = $('#' + this.id + '_x_line');
        this['@{x.line.tip}'] = this['@{x.line}'].find('span');
        this['@{y.line}'] = $('#' + this.id + '_y_line');
        this['@{y.line.tip}'] = this['@{y.line}'].find('span');
    },
    syncScroll() {
        let xNode = this['@{x.axis}'];
        let yNode = this['@{y.axis}'];
        let yHelpNode = this['@{y.axis.help}'];
        let xHelpNode = this['@{x.axis.help}'];
        let scroll = this['@{scroll.node}'];
        let top = scroll.prop('scrollTop');
        let left = scroll.prop('scrollLeft');
        xNode.prop('scrollLeft', left);
        yNode.prop('scrollTop', top);
        yHelpNode.css({
            top: -top
        });
        xHelpNode.css({
            left: -left
        });
        this.updater.set({
            sLeft: left,
            sTop: top
        });
    },
    render() {
        this.rerender();
        let timer = setInterval(() => {
            let s = $('#stage_stage');
            if (s.length) {
                clearInterval(timer);
                this.rerender(true);
            }
        }, 30);
    },
    '@{show.x.line}<mousemove>'(e) {
        let offset = this['@{owner.node}'].offset();
        let xNode = this['@{x.axis}'];
        let v = e.pageX - offset.left;
        let start = this.updater.get('xStart');
        this['@{x.line}'].css({
            display: 'block',
            left: v
        });
        let mm = ToMM(v - start + xNode.prop('scrollLeft'));
        // let fix = mm % 20;
        // // console.log(fix);
        // if (fix <= 0.17 || fix >= 19.93) {
        //     mm = ToInt(mm);
        // }
        this['@{x.line.tip}'].html(mm);
    },
    '@{hide.x.line}<mouseout>'(e) {
        if (!Magix.inside(e.relatedTarget, e.eventTarget)) {
            this['@{x.line}'].css({
                display: 'none'
            });
        }
    },
    '@{show.y.line}<mousemove>'(e) {
        let offset = this['@{owner.node}'].offset();
        let v = e.pageY - offset.top;
        let start = this.updater.get('yStart');
        let yNode = this['@{y.axis}'];
        this['@{y.line}'].css({
            display: 'block',
            top: v
        });
        let mm = ToMM(v - start - 20 + yNode.prop('scrollTop'));
        this['@{y.line.tip}'].html(mm);
    },
    '@{hide.y.line}<mouseout>'(e) {
        if (!Magix.inside(e.relatedTarget, e.eventTarget)) {
            this['@{y.line}'].css({
                display: 'none'
            });
        }
    },
    '@{add.x.help.line}<click>'(e) {
        let offset = this['@{owner.node}'].offset();
        let xNode = this['@{x.axis}'];
        let v = e.pageX - offset.left;
        let start = this.updater.get('xStart');
        let mm = ToMM(v - start + xNode.prop('scrollLeft'));
        let xHelpers = this.updater.get('xHelpers');
        xHelpers.push({
            mm,
            id: Magix.guid('x_')
        });
        this.updater.digest({
            xHelpers
        });
        State.fire('@{history&save.snapshot}');
    },
    '@{add.y.help.line}<click>'(e) {
        let offset = this['@{owner.node}'].offset();
        let v = e.pageY - offset.top;
        let start = this.updater.get('yStart');
        let yNode = this['@{y.axis}'];
        let mm = ToMM(v - start - 20 + yNode.prop('scrollTop'));
        let yHelpers = this.updater.get('yHelpers');
        yHelpers.push({
            mm,
            id: Magix.guid('x_')
        });
        this.updater.digest({
            yHelpers
        });
        State.fire('@{history&save.snapshot}');
    },
    '@{delete.help.line}<click>'(e) {
        let { type, id } = e.params;
        let key = type + 'Helpers';
        let updater = this.updater;
        let list = updater.get(key);
        for (let i = list.length; i--;) {
            let e = list[i];
            if (e.id == id) {
                list.splice(i, 1);
                break;
            }
        }
        updater.digest({
            [key]: list
        });
        State.fire('@{history&save.snapshot}');
    },
    '@{drag.help.line}<mousedown>'(e) {
        if (e.target != e.eventTarget) {
            return;
        }
        let { type, id, c: current } = e.params;
        let key = type + 'Helpers';
        let updater = this.updater;
        let list = updater.get(key);
        let item;
        for (let i of list) {
            if (i.id == id) {
                item = i;
                break;
            }
        }
        if (item) {
            let start = updater.get(type + 'Start'),
                moved = false;
            this.dragdrop(e.target, (evt) => {
                moved = true;
                let oft;
                if (type == 'x') {
                    oft = evt.pageX - e.pageX + current;
                } else {
                    oft = evt.pageY - e.pageY + current - 20;
                }
                item.mm = ToMM(oft - start);
                updater.digest({
                    [key]: list
                });
            }, () => {
                if (moved) {
                    State.fire('@{history&save.snapshot}');
                }
            });
        }
    },
    '$win<resize>'() {
        this.rerender(true);
        this.syncScroll();
    },
    '$doc<toolboxtoggle>'() {
        let me = this;
        clearTimeout(me['@{last.rerender.timer}']);
        me['@{last.rerender.timer}'] = setTimeout(() => {
            me.rerender(true);
            me.syncScroll();
        }, 160);
    }
});