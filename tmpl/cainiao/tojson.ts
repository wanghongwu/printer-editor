import Magix from 'magix';
import Convert from '../util/converter';
import CNC from './const';
import Elements from '../element/index';
import Table from '../util/table';
import $ from '$';
let State = Magix.State;
let Has = Magix.has;
let ToMap = Magix.toMap;
let Decoder_OpenReg = /^<([a-z\d]+)((?:\s+[-A-Za-z\d_:]+(?:="[^"]*")?)*)\s*(\/?)>/,
    Decoder_AttrReg = /([-A-Za-z\d_:]+)(?:="([^"]*)")?/g,
    Decoder_CloseReg = /^<\/([a-z\d]+)>/;
let DecodeXML = xml => {
    let count = xml.length,
        current = 0,
        last = 0,
        chars,
        currentParent = {
            '@{~v#node.deep}': 0,
            '@{~v#node.id}': Magix.guid(),
            '@{~v#node.children}': []
        },
        map = {},
        id,
        index,
        html = xml,
        match,
        tag,
        attrs,
        stack = [currentParent],
        em,
        amap,
        text,
        moveLength,
        unary;//新旧vnode的比较key
    map[currentParent["@{~v#node.id}"]] = currentParent;
    while (current < count) {
        chars = 1;
        if (html[0] == '<') {
            if (html[1] == '?') {
                index = html.indexOf('?>');
                if (index < 0) {
                    text = html;
                } else {
                    text = html.substring(0, index + 2);
                }
                id = Magix.guid();
                em = {
                    '@{~v#node.tag}': '#xml',
                    '@{~v#node.text}': text,
                    '@{~v#node.id}': id,
                    '@{~v#node.deep}': currentParent['@{~v#node.deep}'] + 1,
                    '@{~v#node.pId}': currentParent['@{~v#node.id}']
                };
                map[id] = em;
                currentParent['@{~v#node.children}'].push(em);
                current += moveLength = text.length;
                chars = 0;
                //ignore xml
            } else if (html[1] == '%') {
                index = html.indexOf('%>');
                if (index < 0) {
                    text = html;
                } else {
                    text = html.substring(0, index + 2);
                }
                id = Magix.guid();
                em = {
                    '@{~v#node.tag}': '#script',
                    '@{~v#node.text}': text,
                    '@{~v#node.id}': id,
                    '@{~v#node.deep}': currentParent['@{~v#node.deep}'] + 1,
                    '@{~v#node.pId}': currentParent['@{~v#node.id}']
                };
                map[id] = em;
                currentParent['@{~v#node.children}'].push(em);
                current += moveLength = text.length;
                chars = 0;
            } else if (html[1] == '!') {
                index = html.indexOf(']]>');
                if (index < 0) {
                    text = html;
                } else {
                    text = html.substring(0, index + 3);
                }
                id = Magix.guid();
                em = {
                    '@{~v#node.tag}': '#cdata',
                    '@{~v#node.cdata}': text,
                    '@{~v#node.text}': text.slice(9, -3),
                    '@{~v#node.id}': id,
                    '@{~v#node.deep}': currentParent['@{~v#node.deep}'] + 1,
                    '@{~v#node.pId}': currentParent['@{~v#node.id}']
                };
                map[id] = em;
                currentParent['@{~v#node.children}'].push(em);
                current += moveLength = text.length;
                chars = 0;
            } else if (html[1] == '/') {
                match = html.match(Decoder_CloseReg);
                if (match) {
                    let l = stack.pop();
                    if (match[1] != l['@{~v#node.tag}']) {
                        throw new Error('closed tag "' + match[1] + '" umatch opened tag "' + l['@{~v#node.tag}'] + '"');
                    }
                    currentParent = stack[stack.length - 1];
                    current += moveLength = match[0].length;
                    chars = 0;
                }
            } else {
                match = html.match(Decoder_OpenReg);
                if (match) {
                    tag = match[1];
                    current += moveLength = match[0].length;
                    attrs = [];
                    amap = {};
                    match[2].replace(Decoder_AttrReg, (m, key, value) => {
                        attrs.push({
                            '@{~v#node.attrs.key}': key,
                            '@{~v#node.attrs.value}': value || ''
                        });
                        amap[key] = value;
                    });
                    unary = match[3];
                    id = Magix.guid();
                    em = {
                        '@{~v#node.tag}': tag,
                        '@{~v#node.attrs}': attrs,
                        '@{~v#node.attrs.map}': amap,
                        '@{~v#node.children}': [],
                        '@{~v#node.self.close}': unary,
                        '@{~v#node.id}': id,
                        '@{~v#node.deep}': currentParent['@{~v#node.deep}'] + 1,
                        '@{~v#node.pId}': currentParent['@{~v#node.id}']
                    };
                    map[id] = em;
                    currentParent['@{~v#node.children}'].push(em);
                    if (!unary) {
                        stack.push(em);
                        currentParent = em;
                    }
                    chars = 0;
                }
            }
        }
        if (chars) {
            index = html.indexOf('<');
            if (index < 0) {
                text = html;
            } else {
                text = html.substring(0, index);
            }
            current += moveLength = text.length;
            if (text.trim()) {
                id = Magix.guid();
                em = {
                    '@{~v#node.tag}': '#text',
                    '@{~v#node.text}': text,
                    '@{~v#node.id}': id,
                    '@{~v#node.deep}': currentParent['@{~v#node.deep}'] + 1,
                    '@{~v#node.pId}': currentParent['@{~v#node.id}']
                };
                currentParent['@{~v#node.children}'].push(em);
            }
        }

        if (last == current) {
            throw new Error('bad input:' + html);
        }
        //substring is fater than slice . lower gc
        html = html.substring(moveLength);

        last = current;
    }
    if (stack.length > 1) {
        throw new Error('parsing failure:' + stack[1]['@{~v#node.tag}'] + ' unclosed!');
    }
    return { node: currentParent, map };
};
let ToPixel = Convert["@{millimeter.to.pixel}"];
let ToBool = f => f === 'true';
let ToNum = f => {
    f = Number(f);
    return isNaN(f) ? 0 : f;
};
let ToDeg = f => ToNum(f) % 360;
let VariableReg = /^\s*<%[\s\S]*%>\s*$/;
//let ToMM = Convert["@{pixel.to.millimeter}"];
let Types = {
    STRING: 1,
    NUMBER: 2,
    BOOLEAN: 4,
    ENUM: 8
};
//解析xml时有效的key白名单，其它key则忽略
let PRule = (alias?: string) => {
    let rule = {
        type: Types.NUMBER,
        convert: ToPixel
    } as {
        type: number
        convert: () => number
        alias: string
        min: number
        max: number
    };
    if (alias) {
        rule.alias = alias;
    } else {
        rule.min = 0;
        rule.max = 2800;
    };
    return rule;
};
let ValidKeys = {
    page: {
        splitable: {
            type: Types.BOOLEAN,
            parse: ToBool
        },
        xmlns: {
            type: Types.STRING
        },
        'xmlns:xsi': {
            type: Types.STRING
        },
        'xsi:schemaLocation': {
            type: Types.STRING
        },
        'xmlns:editor': {
            type: Types.STRING,
            back: CNC.EDITOR_NAME_SPACE
        },
        width: {
            type: Types.NUMBER,
            max: CNC.PAGE_WIDTH_MAX,
            min: CNC.PAGE_WIDTH_MIN,
            convert: ToPixel
        },
        height: {
            type: Types.NUMBER,
            max: CNC.PAGE_HEIGHT_MAX,
            min: CNC.PAGE_HEIGHT_MIN,
            convert: ToPixel
        }
    },
    line: {
        style: {
            type: Types.STRING
        },
        zIndex: {
            type: Types.NUMBER
        },
        startX: PRule('x'),
        endX: PRule('y'),
        startY: PRule(),
        endY: PRule(),
        lineWidth: {
            type: Types.NUMBER,
            min: 1
        },
        lineColor: {
            type: Types.STRING
        },
        lineType: {
            type: Types.ENUM,
            alias: 'type',
            enums: ToMap(CNC.LINE_TYPES, 'value'),
            back: CNC.LINE_TYPES[0].value
        }
    },
    rect: {
        style: {
            type: Types.STRING
        },
        zIndex: {
            type: Types.NUMBER
        },
        left: PRule('x'),
        top: PRule('y'),
        width: PRule(),
        height: PRule(),
        borderWidth: {
            type: Types.NUMBER,
            min: 0
        },
        borderStyle: {
            alias: 'borderType',
            type: Types.ENUM,
            enums: ToMap(CNC.LINE_TYPES, 'value'),
            back: CNC.LINE_TYPES[0].value
        },
        fillColor: {
            type: Types.STRING
        }
    },
    text: {
        style: {
            type: Types.STRING
        },
        zIndex: {
            type: Types.NUMBER
        },
        left: PRule('x'),
        top: PRule('y'),
        width: PRule(),
        height: PRule(),
        orientation: {
            type: Types.STRING
        },
        rotation: {
            alias: 'rotate',
            type: Types.NUMBER,
            parse: ToDeg
        },
        alpha: {
            type: Types.NUMBER,
            min: 0,
            max: 1
        },
        fontFamily: {
            type: Types.ENUM,
            enums: ToMap(CNC.FONT_FAMILIES, 'value'),
            back: CNC.FONT_FAMILIES[1].value
        },
        fontSize: {
            type: Types.NUMBER,
            min: 0
        },
        lineHeight: {
            type: Types.STRING
        },
        letterSpacing: {
            type: Types.NUMBER,
            min: 0
        },
        align: {
            type: Types.ENUM,
            enums: ToMap(['left', 'center', 'right']),
            back: 'left'
        },
        valign: {
            type: Types.ENUM,
            enums: ToMap(['top', 'middle', 'bottom']),
            back: 'top'
        },
        fontWeight: {
            type: Types.ENUM,
            enums: ToMap(CNC.FONT_WEIGHTS),
            back: CNC.FONT_WEIGHTS[0]
        },
        fontColor: {
            type: Types.STRING
        },
        backgroundColor: {
            type: Types.STRING
        },
        direction: {
            type: Types.ENUM,
            enums: ToMap(CNC.DIRECTIONS),
            back: CNC.DIRECTIONS[0]
        },
        fontItalic: {
            type: Types.BOOLEAN,
            parse: ToBool
        },
        fontUnderline: {
            type: Types.BOOLEAN,
            parse: ToBool
        }
    },
    image: {
        style: {
            type: Types.STRING
        },
        zIndex: {
            type: Types.NUMBER
        },
        left: PRule('x'),
        top: PRule('y'),
        width: PRule(),
        height: PRule(),
        allowFailure: {
            type: Types.BOOLEAN,
            parse: ToBool
        },
        src: {
            type: Types.STRING
        },
        rotation: {
            alias: 'rotate',
            type: Types.NUMBER,
            parse: ToDeg
        },
        alpha: {
            type: Types.NUMBER,
            min: 0,
            max: 1
        }
    },
    barcode: {
        style: {
            type: Types.STRING
        },
        zIndex: {
            type: Types.NUMBER
        },
        left: PRule('x'),
        top: PRule('y'),
        width: PRule(),
        height: PRule(),
        type: {
            type: Types.STRING
        },
        ratioMode: {
            type: Types.STRING
        },
        schema: {
            type: Types.ENUM,
            enums: ToMap(CNC.QRCODES_MAXICODE_SCHEMA),
            back: CNC.QRCODES_MAXICODE_SCHEMA[0]
        },
        primary: {
            type: Types.STRING
        },
        opacity: {
            alias: 'alpha',
            type: Types.NUMBER,
            min: 0,
            max: 1
        },
        rotation: {
            type: Types.NUMBER
        },
        hideText: {
            alias: 'showText',
            type: Types.BOOLEAN,
            parse: v => !ToBool(v)
        }
    },
    table: {
        style: {
            type: Types.STRING
        },
        zIndex: {
            type: Types.NUMBER
        },
        left: PRule('x'),
        top: PRule('y'),
        width: PRule(),
        height: PRule(),
        borderWidth: {
            type: Types.NUMBER,
            min: 0
        },
        cellBorderWidth: {
            type: Types.NUMBER,
            min: 0
        },
        colspan: {
            type: Types.NUMBER,
            min: 1
        },
        rowspan: {
            type: Types.NUMBER,
            min: 1
        }
    }
};
let ReadByRule = (tag, rule, key, v, host) => {
    if (Has(rule, key)) {
        let i = rule[key];
        if (i.parse) {
            v = i.parse(v);
        }
        if (i.type == Types.NUMBER) {
            v = ToNum(v);
            if (Has(i, 'max')) {
                if (v > i.max) {
                    v = i.max;
                }
            }
            if (Has(i, 'min')) {
                if (v < i.min) {
                    v = i.min;
                }
            }
            if (i.convert) {
                v = i.convert(v);
            }
        } else if (i.type == Types.ENUM) {
            if (!Has(i.enums, v)) {
                v = i.back;
            }
        }
        if (i.alias) {
            host[i.alias] = v;
        }
        host[key] = v;
    } else {
        console.warn(`${tag} invalid key`, key);
    }
};
let RecordScripts = (element, node, parent) => {
    let props = element.props;
    props._layouts = [];
    props._children = [];
    for (let e of [{ node: parent, key: '_layouts' }, { node, key: '_children' }]) {
        let addMainChildren = false;
        for (let c of e.node['@{~v#node.children}']) {
            let tag = c['@{~v#node.tag}'];
            if (tag == '#script') {
                props[e.key].push({
                    tag: '#script',
                    text: c['@{~v#node.text}']
                });
            } else if (!addMainChildren) {
                addMainChildren = true;
                props[e.key].push({
                    tag
                });
            }
        }
    }
};
let StyleReg = /([^;:]+):([^;]+)(?=;|$)/g;
let StyleDecoder = style => {
    let styles = {};
    style.replace(StyleReg, (m, key, val) => {
        styles[key] = val;
    });
    return styles;
};
let DecodeNodeAttrs = (node, validRules, host) => {
    for (let a of node['@{~v#node.attrs}']) {
        ReadByRule(node['@{~v#node.tag}'], validRules, a['@{~v#node.attrs.key}'], a['@{~v#node.attrs.value}'], host);
    }
    let map = node['@{~v#node.attrs.map}'];
    let style = map.style;
    if (style) {
        let ss = StyleDecoder(style);
        for (let s in ss) {
            ReadByRule(node['@{~v#node.tag}'], validRules, s, ss[s], host);
        }
    }
    let tip = map['editor:tip'];
    if (tip) {
        host.tip = tip;
    }
};
let Decoders = {
    page(stage, node) {
        if (node['@{~v#node.deep}'] === 1) {
            let keys = ValidKeys.page;
            let scale = State.get('@{stage&scale}');
            let defaults = {
                'xmlns': CNC.CLOUD_PRINT_NAME_SPACE,
                'xmlns:xsi': CNC.XSI_NAME_SPACE,
                'xsi:schemaLocation': CNC.SCHEMA_LOCATION_NAME_SPACE,
                'xmlns:editor': CNC.EDITOR_NAME_SPACE,
                width: CNC.PAGE_WIDTH_DEFAULT * scale,
                height: CNC.PAGE_HEIGHT_DEFAULT * scale,
                splitable: false
            };
            DecodeNodeAttrs(node, keys, defaults);
            stage.page = defaults;
        }
    },
    line(stage, node) {
        //只处理page下的line
        if (node['@{~v#node.pId}'] && node['@{~v#node.deep}'] > 1) {
            let keys = ValidKeys.line;
            let attrsMap = node['@{~v#node.attrs.map}'];
            let vKey = 'editor:_deg_';
            let vertical = attrsMap[vKey] == '90';
            let type = vertical ? 'vline' : 'hline';
            let ctor = Elements.byType(type);
            let defaults = ctor.getProps(0, 0);
            let scale = State.get('@{stage&scale}');
            defaults.width *= scale;
            defaults.height *= scale;
            DecodeNodeAttrs(node, keys, defaults);
            if (!defaults.zIndex) {
                defaults.zIndex = stage.elements.length + 1;
            }
            if (Has(defaults, 'startX') &&
                Has(defaults, 'startY') &&
                Has(defaults, 'endX') &&
                Has(defaults, 'endY')) {
                let width = Math.abs(vertical ? (defaults.endY - defaults.startY) : (defaults.endX - defaults.startX));
                defaults.x = defaults.startX;
                defaults.y = defaults.startY;
                defaults[vertical ? 'height' : 'width'] = width;
            }
            defaults[vertical ? 'width' : 'height'] = Convert["@{pt.to.pixel}"](defaults.lineWidth || 1);
            let e = {
                id: Magix.guid('e_'),
                type,
                ctor,
                props: defaults
            };
            stage.elements.push(e);
        }
    },
    rect(stage, node, map) {
        let prt = map[node['@{~v#node.pId}']];
        if (prt && prt['@{~v#node.tag}'] == 'layout') {
            let ctor = Elements.byType('rect');
            let defaults = ctor.getProps(0, 0);
            let scale = State.get('@{stage&scale}');
            defaults.width *= scale;
            defaults.height *= scale;
            let keys = ValidKeys.rect;
            DecodeNodeAttrs(prt, keys, defaults);
            DecodeNodeAttrs(node, keys, defaults);
            if (defaults.fillColor) {
                defaults.fill = true;
            }
            let e = {
                id: Magix.guid('e_'),
                type: 'rect',
                ctor,
                props: defaults
            };
            RecordScripts(e, node, prt);
            stage.elements.push(e);
        }
    },
    text(stage, node, map) {
        let prt = map[node['@{~v#node.pId}']];
        if ((prt && prt['@{~v#node.tag}'] == 'layout') ||
            (prt && prt['@{~v#node.tag}'] == 'td')) {
            let attrsMap = node['@{~v#node.attrs.map}'];
            let style = attrsMap.style,
                vertical = false;
            let keys = ValidKeys.text,
                ss;
            if (style) {
                ss = StyleDecoder(style);
                vertical = ss.orientation == 'vertical';
            }
            let type = vertical ? 'vtext' : 'htext';
            let ctor = Elements.byType(type);
            let defaults = ctor.getProps(0, 0);
            let scale = State.get('@{stage&scale}');
            defaults.width *= scale;
            defaults.height *= scale;
            let tip = attrsMap['editor:tip'];
            if (tip) {
                defaults.tip = tip;
            }
            if (prt['@{~v#node.tag}'] == 'layout') {
                DecodeNodeAttrs(prt, keys, defaults);
                let pprt = map[prt['@{~v#node.pId}']];
                if (pprt && pprt['@{~v#node.tag}'] == 'td') {
                    defaults.supportCNStyle = true;
                }
            } else {
                ctor.writeAdapter(true, defaults);
                defaults.useCNStyle = true;
                defaults.supportCNStyle = true;
            }
            if (ss) {
                for (let s in ss) {
                    ReadByRule('text', keys, s, ss[s], defaults);
                }
            }
            if (!$.isArray(defaults.lineHeight)) {
                let lh = defaults.lineHeight.match(/(\d+)(mm|%|$)/);
                if (!lh) {
                    defaults.lineHeight = ['', 'mm'];
                } else {
                    let n = Number(lh[1]);
                    if (n < 0) n = 0;
                    defaults.lineHeight = [n, lh[2] || 'mm'];
                }
            }
            if (!$.isArray(defaults.align)) {
                defaults.align = [defaults.align, defaults.valign || 'top'];
            } else if (defaults.valign && $.isArray(defaults.align)) {
                defaults.align[1] = defaults.valign;
            }
            if (defaults.backgroundColor && defaults.fontColor) {
                defaults.color = 1;
            }
            if (attrsMap['editor:_printName_']) {
                defaults.alias = attrsMap['editor:_printName_'];
            }

            if (attrsMap['editor:component'] == 'true') {
                defaults.allowEdit = 0;
            }
            let fontStyle = ['', ''];
            if (defaults.fontItalic) {
                fontStyle[0] = 'italic';
            }
            if (defaults.fontUnderline) {
                fontStyle[1] = 'underline';
            }
            defaults.fontStyle = fontStyle;
            for (let c of node['@{~v#node.children}']) {
                if (c['@{~v#node.tag}'] == '#cdata') {
                    defaults.text = c['@{~v#node.text}'];
                    break;
                }
            }
            let e = {
                id: Magix.guid('e_'),
                type,
                ctor,
                props: defaults
            };
            if (prt['@{~v#node.tag}'] == 'layout') {
                RecordScripts(e, node, prt);
            }
            stage.elements.push(e);
        }
    },
    image(stage, node, map) {
        let prt = map[node['@{~v#node.pId}']];
        if (prt && prt['@{~v#node.tag}'] == 'layout') {
            let ctor = Elements.byType('image');
            let defaults = ctor.getProps(0, 0);
            let scale = State.get('@{stage&scale}');
            defaults.width *= scale;
            defaults.height *= scale;
            let keys = ValidKeys.image;
            DecodeNodeAttrs(prt, keys, defaults);
            DecodeNodeAttrs(node, keys, defaults);
            let e = {
                id: Magix.guid('e_'),
                type: 'image',
                ctor,
                props: defaults
            };
            RecordScripts(e, node, prt);
            stage.elements.push(e);
            return e;
        }
        return null;
    },
    barcode(stage, node, map) {
        let prt = map[node['@{~v#node.pId}']];
        if (prt && prt['@{~v#node.tag}'] == 'layout') {
            let qrcodes = ToMap(CNC.QRCODES, 'value');
            let barcodes = ToMap(CNC.BARCODES, 'value');
            let nodeAttrsMap = node['@{~v#node.attrs.map}'];
            let type = 'qrcode';
            let aType = nodeAttrsMap.type,
                styles = StyleDecoder(nodeAttrsMap.style || '');
            if (Has(qrcodes, aType)) {
                type = 'qrcode';
            } else if (Has(barcodes, aType)) {
                type = styles.rotation == '90' ? 'vcode' : 'hcode';
            }
            let ctor = Elements.byType(type);
            let defaults = ctor.getProps(0, 0);
            let scale = State.get('@{stage&scale}');
            defaults.width *= scale;
            defaults.height *= scale;
            let tip = nodeAttrsMap['editor:tip'];
            if (tip) {
                defaults.tip = tip;
            }
            let keys = ValidKeys.barcode;
            DecodeNodeAttrs(prt, keys, defaults);
            for (let a of node['@{~v#node.attrs}']) {
                ReadByRule('barcode', keys, a['@{~v#node.attrs.key}'], a['@{~v#node.attrs.value}'], defaults);
            }
            for (let s in styles) {
                ReadByRule('barcode', keys, s, styles[s], defaults);
            }
            for (let c of node['@{~v#node.children}']) {
                if (c['@{~v#node.tag}'] == '#cdata') {
                    defaults.text = c['@{~v#node.text}'];
                    break;
                }
            }
            let e = {
                id: Magix.guid('e_'),
                type,
                ctor,
                props: defaults
            };
            RecordScripts(e, node, prt);
            stage.elements.push(e);
        }
    },
    table(stage, node, map) {
        let type = 'table';
        let prt = map[node['@{~v#node.pId}']];
        if (prt['@{~v#node.tag}'] != 'layout') return;
        let ctor = Elements.byType(type);
        let defaults = ctor.getProps(0, 0);
        let scale = State.get('@{stage&scale}');
        defaults.width *= scale;
        defaults.height *= scale;
        for (let r of defaults.rows) {
            if (r.type == 'tr') {
                r.height *= scale;
                for (let c of r.cells) {
                    if (c.type == 'td') {
                        c.width *= scale;
                    }
                }
            }
        }
        let pprt = map[prt['@{~v#node.pId}']];
        if (pprt && pprt['@{~v#node.tag}'] == 'layout') {
            defaults.splitable = true;
        } else {
            defaults.splitable = false;
        }
        let keys = ValidKeys.table;
        DecodeNodeAttrs(prt, keys, defaults);
        DecodeNodeAttrs(node, keys, defaults);
        // if (Has(defaults, 'cellBorderWidth') && Has(defaults, 'borderWidth')) {
        //     defaults.hideBorder = defaults.borderWidth === 0 && defaults.cellBorderWidth === 0;
        // }
        // let noBorderWidth = defaults.borderWidth === 0;
        let e = {
            id: Magix.guid('e_'),
            type,
            ctor: Elements.byType(type),
            props: defaults
        };
        let children = node['@{~v#node.children}'];
        if (children) {
            defaults.rows = [];
            for (let row of children) {
                let record;
                let tag = row['@{~v#node.tag}'];
                if (tag == '#script') {
                    record = {
                        tag: '#script',
                        text: row['@{~v#node.text}']
                    };
                } else {
                    let cells = [];
                    let cols = row['@{~v#node.children}'];
                    if (cols) {
                        for (let cell of cols) {
                            let ct = cell['@{~v#node.tag}'];
                            if (ct == '#script') {
                                cells.push({
                                    tag: '#script',
                                    text: cell['@{~v#node.text}']
                                });
                            } else {
                                let width = -1, height = -1;
                                let attrsMap = cell['@{~v#node.attrs.map}'];
                                let xwidth = Number(attrsMap.width);
                                //let rowspan = Number(attrsMap.rowspan) || 1;
                                let rowspan = attrsMap.rowspan;
                                if (VariableReg.test(rowspan)) {
                                    defaults.__invalid = true;
                                } else {
                                    rowspan = Number(rowspan) || 1;
                                }
                                let colspan = attrsMap.colspan;
                                if (VariableReg.test(colspan)) {
                                    defaults.__invalid = true;
                                } else {
                                    colspan = Number(colspan) || 1;
                                }
                                if (xwidth >= 0) {
                                    width = xwidth;
                                }
                                let cheight = Number(attrsMap.height);
                                if (cheight >= 0) {
                                    height = cheight;
                                }
                                let hasBorder = true;
                                width = ToPixel(width);
                                height = ToPixel(height);
                                //debugger;
                                if (attrsMap.style) {
                                    let sd = StyleDecoder(attrsMap.style);
                                    if (sd.borderWidth) {
                                        hasBorder = parseInt(sd.borderWidth) > 0;
                                    } else {
                                        hasBorder = true;
                                    }
                                } else {
                                    hasBorder = true;
                                }
                                let children = [];
                                let walk = (nodes) => {
                                    if (nodes) {
                                        for (let cc of nodes) {
                                            let tag = cc['@{~v#node.tag}'];
                                            let fn = Decoders[tag];
                                            if (fn) {
                                                fn({
                                                    elements: children
                                                }, cc, map);
                                            } else {
                                                walk(cc['@{~v#node.children}']);
                                            }
                                        }
                                    }
                                };
                                walk(cell['@{~v#node.children}']);
                                cells.push({
                                    tag: ct,
                                    width,
                                    height,
                                    rowspan,
                                    colspan,
                                    hasBorder,
                                    children
                                });
                            }
                        }
                    }
                    record = {
                        tag,
                        cells
                    };
                }
                defaults.rows.push(record);
            }
            Table["@{update.cells.metas}"](defaults);
        }
        RecordScripts(e, node, prt);
        stage.elements.push(e);
    },
    header(stage, node, map) {
        stage.setHeader = true;
        let prt = map[node['@{~v#node.pId}']];
        if (prt['@{~v#node.tag}'] != 'page') return;
        let aMap = node['@{~v#node.attrs.map}'];
        if (aMap.height) {
            stage.page.header = ToPixel(aMap.height);
        }
    },
    footer(stage, node, map) {
        stage.setFooter = true;
        let prt = map[node['@{~v#node.pId}']];
        if (prt['@{~v#node.tag}'] != 'page') return;
        let aMap = node['@{~v#node.attrs.map}'];
        if (aMap.height) {
            stage.page.footer = ToPixel(aMap.height);
        }
    },
    '#script'(stage, node, map) {
        let prt = map[node['@{~v#node.pId}']];
        if (prt) {
            if ((prt['@{~v#node.tag}'] == 'page' &&
                prt['@{~v#node.deep}'] == 1) ||
                (prt['@{~v#node.tag}'] == 'td' && prt['@{~v#node.deep}'] > 1)) {
                stage.elements.push({
                    id: Magix.guid('s_'),
                    type: '#script',
                    text: node['@{~v#node.text}']
                });
            }
        }
    }
};

export default xml => {
    let { node, map } = DecodeXML(xml);
    let stage = {
        page: {},
        elements: []
    } as {
        setHeader: boolean
        setFooter: boolean
        page: {
            header: number
            footer: number
        }
        elements: object[]
    };
    let walk = (nodes) => {
        for (let n of nodes) {
            let tag = n['@{~v#node.tag}'];
            let fn = Decoders[tag];
            if (fn) {
                fn(stage, n, map);
            }
            if (n['@{~v#node.children}'] && tag != 'table') {
                walk(n['@{~v#node.children}']);
            }
        }
    };
    walk(node['@{~v#node.children}']);
    if (!stage.setHeader) {
        stage.page.header = 0;
    }
    if (!stage.setFooter) {
        stage.page.footer = 0;
    }
    delete stage.setHeader;
    delete stage.setFooter;
    return stage;
};