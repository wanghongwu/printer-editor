//converter
import $ from '$';
import { State } from 'magix';
const ToInt = n => {
    return n.toFixed(0) | 0;
};
const ToFloat = (n, f = 2) => {
    return Number(n.toFixed(f));
};
const CMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
};
export default {
    '@{to.int}': ToInt,
    '@{to.float}': ToFloat,
    '@{pixel.to.millimeter}'(px) {
        ///96dpi  25.4mm = 96px  1PX =  0.264583333mm  1mm = 3.77952px;
        let scale = State.get('@{stage&scale}');
        let r = (Number(px) * 0.26458333331386) / scale;
        return ToFloat(r);
    },
    '@{millimeter.to.pixel}'(mm) {
        ///96dpi  25.4mm = 96px  1PX =  0.264583333mm  1mm = 3.77952px;
        let scale = State.get('@{stage&scale}');
        return ToFloat(3.7795275593333 * Number(mm) * scale);
    },
    // '@{pt.to.millimeter}'(pt) {
    //     //磅（1/72 英寸）== (1/72 * 25.4)mm
    //     return ToFloat(Number(pt) * 1 / 72 * 25.4);
    // },
    '@{pt.to.pixel}'(pt) {
        return ToFloat(pt * 1.3333333333333 * State.get('@{stage&scale}'));
    },
    '@{pixel.to.pt}'(px) {
        return ToFloat(px * 0.75 / State.get('@{stage&scale}'));
    },
    '@{real.to.stage.coord}'({ x, y }) {
        let node = $('#stage_stage');
        let pos = node.offset();
        x = x - pos.left;// + oNode.prop('scrollLeft');
        y = y - pos.top;// + oNode.prop('scrollTop');
        return {
            x,
            y
        };
    },
    '@{real.to.nearest.coord}'(node, { x, y, find }) {
        let stage = find ? node.parents('[data-role="table-cell"]') : node;
        if (stage.length) {
            stage = stage.eq(0);
        } else {
            stage = $('#stage_stage');
        }
        let pos = stage.offset();
        x = x - pos.left;// + oNode.prop('scrollLeft');
        y = y - pos.top;// + oNode.prop('scrollTop');
        return {
            x,
            y
        };
    },
    '@{real.to.outer.coord}'({ x, y }) {
        let node = $('#stage_outer');
        let pos = node.offset();
        x = x - pos.left + node.prop('scrollLeft');
        y = y - pos.top + node.prop('scrollTop');
        return {
            x,
            y
        };
    },
    '@{stage.to.outer}'({ x, y }) {
        let stage = $('#stage_stage').offset();
        let outer = $('#stage_outer').offset();
        x = x + (stage.left - outer.left);
        y = y + (stage.top - outer.top);
        return {
            x,
            y
        }
    },
    '@{outer.to.stage}'({ x, y }) {
        let stage = $('#stage_stage').offset();
        let outer = $('#stage_outer').offset();
        x = x + (outer.left - stage.left);
        y = y + (outer.top - stage.top);
        return {
            x,
            y
        }
    },
    '@{pre.to.html}'(html) {
        return html.replace(/[<>&]/g, m => CMap[m]).replace(/ /g, '&nbsp;').replace(/(?:\r\n|\r|\n)/g, '<br />');
    },
    '@{html.to.pre}'(text) {
        return text.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\r\n').replace(/<br \/>/g, '\r\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/<div>([\s\S\n]*?)<\/div>/g, '\r\n$1');
    }
};