import { State } from 'magix';
import CNC from '../../cainiao/const';
const UndoList = [];
const RedoList = [];
let BuferStage = null;
let BuferTimer = -1;
let LastType = '';
//历史记录只能还原到的编辑区状态
let DefaultStage = null;
const GetSnapshot = () => {
    return JSON.stringify({
        page: State.get('page'),
        scale: State.get('@{stage&scale}'),
        elements: State.get('@{stage&elements}'),
        select: State.get('@{stage&select.elements}'),
        xLines: State.get('@{stage&x.help.lines}'),
        yLines: State.get('@{stage&y.help.lines}')
    });
};
const UpdateStage = jsonStr => {
    let json = JSON.parse(jsonStr);
    State.fire('@{stage&apply.stage}', {
        json
    });
    State.fire('@{history&status.change}', {
        history: true
    });
    State.fire('@{stage&select.elements.change}');
};
export default {
    '@{save.default}'() {
        if (!DefaultStage) {
            DefaultStage = GetSnapshot();
        }
    },
    '@{clear}'() {
        UndoList.length = 0;
        RedoList.length = 0;
        State.fire('@{history&status.change}');
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
        let stage = GetSnapshot();
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