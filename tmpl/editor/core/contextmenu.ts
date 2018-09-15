import Magix from 'magix';
import I18n from '../../i18n/index';
let MenuSpliter = {
    spliter: true
};
let MenuAll = {
    id: 0,
    text: '@{menu.select.all}',
    short: ' (Ctrl+A)'
};
let MenuCopy = {
    id: 1,
    text: '@{menu.copy}',
    short: ' (Ctrl+C)'
};
let MenuCut = {
    id: 14,
    text: '@{menu.cut}',
    short: ' (Ctrl+X)'
}
let MenuPaste = {
    id: 2,
    text: '@{menu.paste}',
    short: ' (Ctrl+V)'
};
let MenuUp = {
    id: 5,
    text: '@{menu.move.up}'
};
let MenuDown = {
    id: 6,
    text: '@{menu.move.down}'
};
let MenuTop = {
    id: 3,
    text: '@{menu.to.top}'
};
let MenuBottom = {
    id: 4,
    text: '@{menu.to.bottom}'
};
let MenuDelete = {
    id: 7,
    text: '@{menu.delete}',
    short: ' (Delete)'
};
let MenuCellTopAddRow = {
    id: 8,
    text: '@{menu.add.rows.above}'
}
let MenuCellBottomAddRow = {
    id: 9,
    text: '@{menu.add.rows.below}'
};
let MenuCellDeleteRow = {
    id: 10,
    text: '@{menu.delete.current.rows}'
};

let MenuCellLeftAddCol = {
    id: 11,
    text: '@{menu.add.cols.before}'
};
let MenuCellRightAddCol = {
    id: 12,
    text: '@{menu.add.cols.after}'
};
let MenuCellDeleteCol = {
    id: 13,
    text: '@{menu.delete.current.cols}'
};
let Cache = {};
let TranslateMenu = menus => {
    return (lang) => {
        if (!menus['@{uid}']) {
            menus['@{uid}'] = Magix.guid('_m');
        }
        let key = lang + menus['@{uid}'];
        if (!Cache[key]) {
            let a = [];
            for (let m of menus) {
                if (m.spliter) {
                    a.push(m);
                } else {
                    a.push({
                        id: m.id,
                        text: I18n(m.text) + (m.short || '')
                    });
                }
            }
            Cache[key] = a;
        }
        return Cache[key];
    };
};
export let Contextmenu = {
    allId: MenuAll.id,
    pasteId: MenuPaste.id,
    topId: MenuTop.id,
    upId: MenuUp.id,
    bottomId: MenuBottom.id,
    downId: MenuDown.id,
    cutId: MenuCut.id,
    cellBottomId: MenuCellBottomAddRow.id,
    cellTopId: MenuCellTopAddRow.id,
    cellLeftId: MenuCellLeftAddCol.id,
    cellRightId: MenuCellRightAddCol.id,
    cellDeleteColId: MenuCellDeleteCol.id,
    cellDeleteRowId: MenuCellDeleteRow.id,
    singleElement: TranslateMenu([MenuCopy, MenuCut, MenuDelete, MenuSpliter, MenuUp, MenuTop, MenuSpliter, MenuDown, MenuBottom]),
    multipleElement: TranslateMenu([MenuCopy, MenuCut, MenuDelete]),
    stage: TranslateMenu([MenuAll, MenuPaste]),
    tableCell: TranslateMenu([MenuAll, MenuPaste, MenuSpliter, MenuCellTopAddRow, MenuCellBottomAddRow, MenuCellDeleteRow, MenuSpliter, MenuCellLeftAddCol, MenuCellRightAddCol, MenuCellDeleteCol])
}