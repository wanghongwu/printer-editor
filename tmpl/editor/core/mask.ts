import $ from '$';
import Magix from 'magix';
import I18n from '../../i18n/index';
const MaskId = Magix.guid('mask_');
Magix.applyStyle('@mask.less');
let HideTimer = 0;
export default {
    '@{show}'(msg) {
        clearTimeout(HideTimer);
        let node = $('#' + MaskId);
        if (!node.length) {
            $('body').append(`<div id="${MaskId}"><div class="@mask.less:mask" id="${MaskId}_bk"/><div class="@mask.less:process" id="${MaskId}_text"></div></div>`);
            node = $('#' + MaskId);
        }
        $('#' + MaskId + '_text').html(I18n(msg));
        $('#' + MaskId + '_bk').addClass('@mask.less:mask-show');
        node.show();
    },
    '@{hide}'() {
        HideTimer = setTimeout(() => {
            $('#' + MaskId + '_bk').removeClass('@mask.less:mask-show');
            $('#' + MaskId).hide();
        }, 200);
    }
}