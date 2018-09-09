/*
ver:2.0.3
*/
/*
    author:xinglie.lkf@alibaba-inc.com
 */
let Magix = require('magix');
let $ = require('$');
let Monitor = require('../mx-monitor/index');
require('./index');
Magix.applyStyle('@picker.less');
module.exports = Magix.View.extend({
    tmpl: '@picker.html',
    init(extra) {
        let me = this;
        Monitor['@{setup}']();
        let oNode = $('#' + me.id);
        me['@{owner.node}'] = oNode;
        me.on('destroy', () => {
            Monitor['@{remove}'](me);
            Monitor['@{teardown}']();
        });
        me.assign(extra);
    },
    assign(data) {
        let me = this;
        me['@{color}'] = data.color || data.value;
        me['@{pos.placement}'] = data.placement;
        me['@{pos.align}'] = data.align;
        me['@{show.alpha}'] = data.showAlpha;
        me['@{hide.clear}'] = (data.noClear + '') === 'true';
        return true;
    },
    '@{inside}'(node) {
        let me = this;
        return Magix.inside(node, me.id);
    },
    render() {
        let me = this;
        me.updater.digest({
            color: me['@{color}'],
            hideClear: me['@{hide.clear}'],
            viewId: me.id
        });
        me['@{input.node}'] = $('#ipt_' + me.id);
        me['@{relate.node}'] = $('#cpcnt_' + me.id);
    },
    '@{show}'() {
        let me = this;
        if (!me['@{ui.show}']) {
            let node = me['@{relate.node}'],
                ref = me['@{input.node}'];
            me['@{ui.show}'] = true;
            node.show();
            Monitor['@{add}'](me);
            let offset = ref.offset();
            let left, top;
            switch (me['@{pos.placement}']) {
                case 'top':
                    top = offset.top - node.outerHeight() - 5;
                    break;
                default:
                    top = offset.top + ref.outerHeight() + 5;
                    break;
            }
            switch (me['@{pos.align}']) {
                case 'right':
                    left = offset.left + ref.outerWidth() - node.outerWidth();
                    break;
                default:
                    left = offset.left;
                    break;
            }
            node.offset({
                left: left,
                top: top
            });
        }
    },
    '@{hide}'() {
        let me = this;
        if (me['@{ui.show}']) {
            me['@{relate.node}'].hide();
            me['@{ui.show}'] = false;
            Monitor['@{remove}'](me);
        }
    },
    '@{color.picked}<change>'(e) {
        let me = this;
        me['@{hide}']();
        me.updater.digest({
            color: e.color
        });
        me['@{owner.node}'].val(e.color).trigger({
            type: 'change',
            color: e.color
        });
    },
    '@{clear.color}<click>'() {
        let me = this;
        me.updater.digest({
            color: ''
        });
        me['@{owner.node}'].val('').trigger({
            type: 'change',
            color: ''
        });
    },
    '@{show.panel}<click>'() {
        this['@{show}']();
    },
    '@{stop}<change>'(e) {
        e.stopPropagation();
    }
});