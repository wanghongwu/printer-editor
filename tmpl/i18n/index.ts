import Magix from 'magix';
import ZH from './zh-cn';
import EN from './en-us';
const I18n = {
    'zh-cn': ZH,
    'en-us': EN
};
const DefaultLang = 'zh-cn';
const Has = Magix.has;
export default (key) => {
    let lang = (Magix.config('lang') || navigator.language).toLowerCase();
    if (!Has(I18n, lang)) {
        lang = DefaultLang;
    }
    let l = I18n[lang];
    return Has(l, key) ? l[key] : key;
};