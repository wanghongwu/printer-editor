import $ from '$';
import Magix from 'magix';
const CursorId = Magix.guid('cursor_');
Magix.applyStyle('@cursor.less');
export default {
    '@{show}'(cursor) {
        let node = $('#' + CursorId);
        if (!node.length) {
            $('body').append(`<div class="@cursor.less:cursor" id="${CursorId}"/>`);
            node = $('#' + CursorId);
        }
        node.css({
            cursor
        });
        node.show();
    },
    '@{hide}'() {
        $('#' + CursorId).hide();
    }
}