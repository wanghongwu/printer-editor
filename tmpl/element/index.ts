/**
 * 元素列表
 */
import Magix from 'magix';
import HLine from './hline/designer';
import VLine from './vline/designer';
import HText from './htext/designer';
import VText from './vtext/designer';
import Image from './image/designer';
import Rect from './rect/designer';
import QRCode from './qrcode/designer';
import HCode from './hcode/designer';
import VCode from './vcode/designer';
import Table from './table/designer';
import UTable from '../util/table';
let List = [HLine, VLine, Rect, HText, VText, Image, HCode, VCode, QRCode, Table];
let EMap = Object.create(null);
for (let e of List) {
    EMap[e.type] = e;
}
export default {
    list: List,
    byType(type) {
        return EMap[type];
    },
    byJSON(elements) {
        let es = [],
            map = {},
            nId;
        let walk = (items, coll) => {
            for (let i of items) {
                if (i.type == '#script') {
                    coll.push(i);
                } else {
                    if (!i.props.barred) {
                        nId = Magix.guid('e_');
                        if (i.id) {
                            map[i.id] = i;
                        }
                        i.id = nId;
                        i.ctor = this.byType(i.type);
                        coll.push(i);
                    }
                }
                if (i.type == 'table') {
                    for (let r of i.props.rows) {
                        if (r.tag == 'tr') {
                            for (let c of r.cells) {
                                if (c.tag == 'td') {
                                    if (c.children) {
                                        let nc = [];
                                        walk(c.children, nc);
                                        c.children = nc;
                                    }
                                }
                            }
                        }
                    }
                    UTable["@{update.cells.metas}"](i.props);
                }
            }
        };
        walk(elements, es);
        return {
            elements: es,
            map
        };
    }
};