import Magix, { State } from 'magix';
import CNC from '../../cainiao/const';
import Elements from '../../element/index';
const UndoList = [];
const RedoList = [];
let BuferStage = null;
let BuferTimer = -1;
let LastType = '';
let Assign = Magix.mix;
//历史记录只能还原到的编辑区状态
let DefaultStage = null;
//根据JSON对象反解成编辑对象
const RebuildByJSON = elements => {
    let es = [],
        map = {};
    let walk = (items, coll) => {
        for (let i of items) {
            if (i.type == '#script') {
                coll.push(i);
            } else {
                i.ctor = Elements.byType(i.type);
                coll.push(i);
                map[i.id] = i;
            }
            if (i.type == 'table') {
                for (let r of i.props.rows) {
                    for (let c of r.cells) {
                        if (c.children) {
                            let nc = [];
                            walk(c.children, nc);
                            c.children = nc;
                        }
                    }
                }
            }
        }
    };
    walk(elements, es);
    return {
        elements: es,
        map
    };
};
const UpdateStage = json => {
    let page = State.get('page');
    let elements = State.get('@{stage&elements}');
    let select = State.get('@{stage&select.elements}');
    let lPage = JSON.parse(json.page);
    let { elements: lElements, map } = RebuildByJSON(JSON.parse(json.elements));
    let lSelect = JSON.parse(json.select);
    Assign(page, lPage);
    elements.length = 0;
    elements.push.apply(elements, lElements);
    select.length = 0;
    let sMap = {};
    for (let s of lSelect) {
        if (map[s.id]) {
            sMap[s.id] = 1;
            select.push(map[s.id]);
        }
    }
    State.set({
        '@{stage&scale}': json.scale,
        '@{stage&select.elements.map}': sMap
    });
    State.fire('@{history&status.change}');
    State.fire('@{stage&select.elements.change}');
};
export default {
    '@{set.default}'(stage) {
        if (!DefaultStage) {
            DefaultStage = {
                page: JSON.stringify(stage.page),
                scale: stage['@{stage&scale}'],
                elements: JSON.stringify(stage['@{stage&elements}']),
                select: JSON.stringify(stage['@{stage&select.elements}'])
            }
        }
    },
    '@{query.status}'() {
        return {
            canUndo: UndoList.length,
            canRedo: RedoList.length
        };
    },
    '@{undo}'() {
        let c = UndoList.length;
        //当有历史记录时我们才进行还原操作
        if (c > 0) {
            let last = UndoList.pop();
            RedoList.push(last);
            let current = UndoList[UndoList.length - 1] || DefaultStage;
            UpdateStage(current);
        }
    },
    '@{redo}'() {
        let current = RedoList.pop();
        if (current) {
            UndoList.push(current);
            UpdateStage(current);
        }
    },
    //带合并功能的保存历史记录，比如使用键盘移动元素，如果用户一直按着键不松开，没必要在每移动一步都存历史记录，可以把这些连续的按键行为只记录一次历史记录
    '@{save}'(type = '_save', waiting = 0) {
        let stage = {
            page: JSON.stringify(State.get('page')),
            scale: State.get('@{stage&scale}'),
            elements: JSON.stringify(State.get('@{stage&elements}')),
            select: JSON.stringify(State.get('@{stage&select.elements}'))
        };
        if (type != LastType) {
            if (BuferStage) {
                UndoList.push(BuferStage);
                BuferStage = null;
                LastType = type;
            }
        }
        RedoList.length = 0;
        if (waiting) {
            BuferStage = stage;
            clearTimeout(BuferTimer);
            BuferTimer = setTimeout(() => {
                UndoList.push(BuferStage);
                BuferStage = null;
            }, waiting);
        } else {
            UndoList.push(stage);
        }
        if (UndoList.length > CNC.HISTORY_MAX) {
            DefaultStage = UndoList.shift();
        }
        State.fire('@{history&status.change}');
    }
};