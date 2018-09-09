/*
ver:2.0.3
*/
/*
    author:xinglie.lkf@alibaba-inc.com
 */
let Magix = require('magix');
let $ = require('$');
let Monitor = require('../mx-monitor/index');
let Vframe = Magix.Vframe;
Magix.applyStyle('@index.less');
module.exports = Magix.View.extend({
    tmpl: '@index.html',
    init(extra) {
        let me = this;
        me.assign(extra);
        Monitor['@{setup}']();
        me.on('destroy', () => {
            Monitor['@{remove}'](me);
            Monitor['@{teardown}']();
            if (me['@{context.menu}'] && !extra.cnt) {
                $('#' + me.id).remove();
            }
        });
    },
    assign(ops) {
        let me = this;
        let width = ops.width || 340;
        let valueKey = ops.valueKey || 'id';
        let textKey = ops.textKey || 'text';
        me['@{list}'] = ops.list;
        me['@{offset.node}'] = $(ops.offset);
        me['@{scroller.node}'] = $(ops.scroller);
        me['@{width}'] = width;
        me['@{value.key}'] = valueKey;
        me['@{text.key}'] = textKey;
        me['@{menu.disabled}'] = ops.disabled || {};
        me['@{fn.picked}'] = ops.picked;
        return true;
    },
    render() {
        let me = this;
        me.updater.digest({
            disabled: me['@{menu.disabled}'],
            list: me['@{list}'],
            width: me['@{width}'],
            valueKey: me['@{value.key}'],
            textKey: me['@{text.key}']
        });
    },
    '@{inside}'(node) {
        return Magix.inside(node, this.id);
    },
    '@{show}'(e) {
        let me = this;
        if (!me['@{ui.show}']) {
            me['@{ui.show}'] = 1;
            let node = $('#' + me.id + ' div');
            let oft = me['@{offset.node}'];
            let o = oft.offset();
            let oxy = {
                x: o.left,
                y: o.top,
                width: oft.width() + me['@{scroller.node}'].prop('scrollLeft'),
                height: oft.height()
            };
            let left = -1,
                top = -1;
            let width = node.outerWidth();
            let height = node.outerHeight();
            left = e.pageX - oxy.x;
            top = e.pageY - oxy.y;
            if ((left + width) > oxy.width) {
                left = left - width;
                if (left < 0) left = 0;
            }
            if ((top + height) > oxy.height) {
                top -= height;
                if (top < 0) top = 0;
            }
            node.css({
                left: left,
                top: top
            });
            Monitor['@{add}'](me);
        }
    },
    '@{hide}'() {
        let me = this;
        if (me['@{ui.show}']) {
            me['@{ui.show}'] = false;
            let node = $('#' + me.id + ' div');
            node.css({
                left: -10000
            });
            Monitor['@{remove}'](me);
        }
    },
    '@{hover}<mouseover,mouseout>'(e) {
        let flag = !Magix.inside(e.relatedTarget, e.eventTarget);
        if (flag) {
            let node = $(e.eventTarget);
            node[e.type == 'mouseout' ? 'removeClass' : 'addClass']('@index.less:over');
        }
    },
    '@{select}<click>'(e) {
        let me = this;
        let node = $('#' + this.id);
        let data = {
            type: 'pick',
            item: e.params.item
        };
        node.trigger(data);
        me['@{hide}']();
        let fn = me['@{fn.picked}'];
        if (fn) {
            fn(data.item);
        }
    },
    '@{prevent}<contextmenu>'(e) {
        e.preventDefault();
    }
}, {
        show(view, e, ops) {
            let node = e.eventTarget;
            if (!node.id) node.id = Magix.guid();
            let id = 'ctx_' + node.id + '_' + ops.listKey;
            let vf = Magix.Vframe.get(id);
            if (vf) {
                vf.invoke('assign', [ops]);
                vf.invoke('render');
                vf.invoke('@{show}', [e]);
            } else {
                let cnt = $(ops.cnt || 'body');
                cnt.append('<div id="' + id + '" />');
                vf = view.owner.mountVframe(id, '@moduleId', ops);
                vf.invoke('@{show}', [e]);
            }
        }
    });