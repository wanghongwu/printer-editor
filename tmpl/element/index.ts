/**
 * 元素列表
 */
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
let List = [HLine, VLine, Rect, HText, VText, Image, HCode, VCode, QRCode, Table];
let EMap = Object.create(null);
for (let e of List) {
    EMap[e.type] = e;
}
export default {
    list: List,
    byType(type) {
        return EMap[type];
    }
};