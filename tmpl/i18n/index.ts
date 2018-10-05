import Magix from 'magix';
import ZH from './zh-cn';
import EN from './en-us';
const I18n = {
    'zh-cn': ZH,
    'en-us': EN
};
const DefaultLang = 'zh-cn';
const Has = Magix.has;
const Reg = /\{(\d+)\}/g;
export default (key, ...args) => {
    let lang = (Magix.config('lang') || navigator.language).toLowerCase();
    if (!Has(I18n, lang)) {
        lang = DefaultLang;
    }
    let l = I18n[lang];
    let res = Has(l, key) ? l[key] : key;
    if (args.length) {
        res = res.replace(Reg, (m, i) => {
            i |= 0;
            return args.length > i ? args[i] : m;
        });
    }
    return res;
};