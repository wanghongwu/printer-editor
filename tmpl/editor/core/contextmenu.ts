let MenuSpliter = {
    spliter: true
};
let MenuAll = {
    id: 0,
    text: '全选(Ctrl+A)'
};
let MenuCopy = {
    id: 1,
    text: '复制(Ctrl+C)'
};
let MenuCut = {
    id: 14,
    text: '剪切(Ctrl+X)'
}
let MenuPaste = {
    id: 2,
    text: '粘贴(Ctrl+V)'
};
let MenuUp = {
    id: 5,
    text: '上移一层'
};
let MenuDown = {
    id: 6,
    text: '下移一层'
};
let MenuTop = {
    id: 3,
    text: '移至顶层'
};
let MenuBottom = {
    id: 4,
    text: '移至底层'
};
let MenuDelete = {
    id: 7,
    text: '删除(Delete)'
};
let MenuCellTopAddRow = {
    id: 8,
    text: '上方添加行'
}
let MenuCellBottomAddRow = {
    id: 9,
    text: '下方添加行'
};
let MenuCellDeleteRow = {
    id: 10,
    text: '删除当前行'
};

let MenuCellLeftAddCol = {
    id: 11,
    text: '前面添加列'
};
let MenuCellRightAddCol = {
    id: 12,
    text: '后面添加列'
};
let MenuCellDeleteCol = {
    id: 13,
    text: '删除当前列'
};
export let Contextmenu = {
    allId: MenuAll.id,
    pasteId: MenuPaste.id,
    topId: MenuTop.id,
    upId: MenuUp.id,
    bottomId: MenuBottom.id,
    downId: MenuDown.id,
    cutId: MenuCut.id,
    singleElement: [MenuCopy, MenuCut, MenuDelete, MenuSpliter, MenuUp, MenuTop, MenuSpliter, MenuDown, MenuBottom],
    multipleElement: [MenuCopy, MenuCut, MenuDelete],
    stage: [MenuAll, MenuPaste],
    tableCell: [MenuAll, MenuPaste, MenuSpliter, MenuCellTopAddRow, MenuCellBottomAddRow, MenuCellDeleteRow, MenuSpliter, MenuCellLeftAddCol, MenuCellRightAddCol, MenuCellDeleteCol]
}