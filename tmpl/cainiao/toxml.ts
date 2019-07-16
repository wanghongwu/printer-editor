import Convert from '../util/converter';
//import CNC from './const';
let ToMM = Convert["@{pixel.to.millimeter}"];
let ToPT = Convert["@{pixel.to.pt}"];
let VariableReg = /^\s*<%[\s\S]*%>\s*$/;
//let ToFloat = Convert["@{to.float}"];
let GSpace = (count) => {
    let r = '\n';
    while (count--) {
        r += '\t';
    }
    return r;
};
let LineEncode = (props, space, vertical) => {
    let s1 = GSpace(space + 1);
    let s2 = GSpace(space + 2);
    return `${s1}<line style="lineType:${props.type};lineColor:#000;lineWidth:${ToPT(vertical ? props.width : props.height)};zIndex:${props.zIndex}"${s2}startX="${ToMM(props.x)}"${s2}startY="${ToMM(props.y)}"${s2}endX="${ToMM(props.x + (vertical ? 0 : props.width))}"${s2}endY="${ToMM(props.y + (vertical ? props.height : 0))}"${vertical ? `${s2}editor:_deg_="90"` : ''}${s2}editor:tip="${props.tip}">${s1}</line>`;
};
let TextEncode = ({ props }, space, vertical) => {
    let { _layouts, _children, useCNStyle } = props;
    if (useCNStyle) {
        space--;
    }
    let s1 = GSpace(space + 1);
    let s2 = GSpace(space + 2);
    let s3 = GSpace(space + 3);
    let textStyle = `style="fontFamily:${props.fontFamily};`;
    if (props.rotate != 0) {
        textStyle += `rotation:${props.rotate};`;
    }
    if (props.alpha != 1) {
        textStyle += `alpha:${props.alpha};`;
    }
    if (props.autoFontSize) {
        textStyle += 'fontSize:auto;';
    } else if (props.fontSize != 8) {
        textStyle += `fontSize:${props.fontSize};`;
    }
    if (props.lineHeight[0] !== '') {
        textStyle += `lineHeight:${props.lineHeight[0]}${props.lineHeight[1] == '%' ? '%' : ''};`;
    }
    if (props.fontStyle[0]) {
        textStyle += `fontItalic:true;`;
    }
    if (props.fontStyle[1]) {
        textStyle += `fontUnderline:true;`;
    }
    if (props.align[0] != 'left') {
        textStyle += `align:${props.align[0]};`;
    }
    if (props.align[1] != 'top') {
        textStyle += `valign:${props.align[1]};`;
    }
    if (props.fontWeight != 'normal') {
        textStyle += `fontWeight:${props.fontWeight};`;
    }
    if (props.direction != 'ltr') {
        textStyle += `direction:${props.direction};`;
    }
    if (props.color == '1') {
        textStyle += `fontColor:#fff;backgroundColor:#000;`;
    }
    if (props.letterSpacing) {
        textStyle += `letterSpacing:${props.letterSpacing};`;
    }
    if (vertical) {
        textStyle += 'orientation:vertical;';
    }
    textStyle += '"';
    let content = ``;
    let alias = ``;
    if (props.alias) {
        alias = `${s3}editor:_printName_="${props.alias}"`;
    }
    if (props.allowEdit === 0) {
        alias += `${s3}editor:component="true"`;
    }
    let text = `${s2}<text ${textStyle}${alias}${s3}editor:tip="${props.tip}">`;
    if (_children && _children.length) {
        for (let c of _children) {
            if (c.tag == '#script') {
                text += s3 + c.text;
            } else if (c.tag == '#cdata') {
                text += `${s3}<![CDATA[${props.text}]]>`;
            }
        }
    } else {
        text += `${s3}<![CDATA[${props.text}]]>`;
    }
    text += `${s2}</text>`;
    if (_layouts && _layouts.length) {
        for (let c of _layouts) {
            if (c.tag == '#script') {
                content += s2 + c.text;
            } else if (c.tag == 'text') {
                content += text;
            }
        }
    } else {
        content = text;
    }
    return useCNStyle ? content : `${s1}<layout editor:_for_="${Date.now()}"${s2}width="${ToMM(props.width)}"${s2}height="${ToMM(props.height)}"${s2}left="${ToMM(props.x)}"${s2}top="${ToMM(props.y)}"${s2}style="zIndex:${props.zIndex}">${content}${s1}</layout>`;
};
let CodeEncoder = ({ props }, space, type) => {
    let { _layouts, _children } = props;
    let ext = ``;
    let style = ``;
    let s1 = GSpace(space + 1);
    let s2 = GSpace(space + 2);
    let s3 = GSpace(space + 3);
    if (type == 'qrcode') {
        if (props.type == 'maxicode') {
            ext = `${s3}primary="${props.primary}"${s3}schema="${props.schema}"`;
        }
        style = `opacity:${props.alpha};`;
    } else {
        style = `opacity:${props.alpha};hideText:${!props.showText};rotation:${type == 'vcode' ? 90 : 0};`
    }
    let content = '';
    let code = `${s2}<barcode type="${props.type}"${s3}ratioMode="keepRatio"${s3}style="${style}"${ext}${s3}editor:tip="${props.tip}">`;
    if (_children && _children.length) {
        for (let c of _children) {
            if (c.tag == '#script') {
                code += s3 + c.text;
            } else if (c.tag == '#cdata') {
                code += `${s3}<![CDATA[${props.text}]]>`;
            }
        }
    } else {
        code += `${s3}<![CDATA[${props.text}]]>`;
    }
    code += `${s2}</barcode>`;
    if (_layouts && _layouts.length) {
        for (let c of _layouts) {
            if (c.tag == '#script') {
                content += s2 + c.text;
            } else if (c.tag == 'barcode') {
                content += code;
            }
        }
    } else {
        content = code;
    }
    return `${s1}<layout editor:_for_="${Date.now()}"${s2}width="${ToMM(props.width)}"${s2}height="${ToMM(props.height)}"${s2}left="${ToMM(props.x)}"${s2}top="${ToMM(props.y)}"${s2}style="zIndex:${props.zIndex}">${content}${s1}</layout>`;
};
let Encoder = {
    hline({ props }, space) {
        return LineEncode(props, space, false);
    },
    vline({ props }, space, ) {
        return LineEncode(props, space, true);
    },
    rect({ props }, space) {
        let { _layouts, _children } = props;
        let rectStyle = ``;
        let s1 = GSpace(space + 1);
        let s2 = GSpace(space + 2);
        let s3 = GSpace(space + 3);
        if (props.borderWidth != 1) {
            rectStyle += `borderWidth:${props.borderWidth};`;
        }
        if (props.borderType != 'solid') {
            rectStyle += `borderStyle:${props.borderType};`;
        }
        if (props.fill) {
            rectStyle += `fillColor:#000;`;
        }
        if (rectStyle) {
            rectStyle = ` style="${rectStyle}"`;
        }
        let content = '';
        if (rectStyle) {
            rectStyle += `${s3}editor:tip="${props.tip}"`;
        } else {
            rectStyle = ` editor:tip="${props.tip}"`;
        }
        let rect = `${s2}<rect${rectStyle}>`;
        if (_children && _children.length) {
            for (let c of _children) {
                if (c.tag == '#script') {
                    rect += s3 + c.text;
                }
            }
            rect += s2;
        }
        rect += '</rect>';
        if (_layouts) {
            for (let c of _layouts) {
                if (c.tag == '#script') {
                    content += s2 + c.text;
                } else if (c.tag == 'rect') {
                    content += rect;
                }
            }
        } else {
            content = rect;
        }
        return `${s1}<layout editor:_for_="${Date.now()}"${s2}width="${ToMM(props.width)}"${s2}height="${ToMM(props.height)}"${s2}left="${ToMM(props.x)}"${s2}top="${ToMM(props.y)}"${s2}style="zIndex:${props.zIndex}">${content}${s1}</layout>`;
    },
    image({ props }, space) {
        let { _layouts } = props;
        let imgStyle = ``;
        let s1 = GSpace(space + 1);
        let s2 = GSpace(space + 2);
        let s3 = GSpace(space + 3);
        if (props.rotate != 0) {
            imgStyle += `rotation:${props.rotate};`;
        }
        if (props.alpha != 1) {
            imgStyle += `alpha:${props.alpha};`;
        }
        if (imgStyle) {
            imgStyle = `${s3}style="${imgStyle}"`;
        }
        let img = `${s2}<image src="${props.src}"${imgStyle} ${s3}allowFailure="false"${s3}editor:tip="${props.tip}"/>`;
        let content = '';
        if (_layouts) {
            for (let c of _layouts) {
                if (c.tag == '#script') {
                    content += s2 + c.text;
                } else if (c.tag == 'image') {
                    content += img;
                }
            }
        } else {
            content = img;
        }
        return `${s1}<layout editor:_for_="${Date.now()}"${s2}width="${ToMM(props.width)}"${s2}height="${ToMM(props.height)}"${s2}left="${ToMM(props.x)}"${s2}top="${ToMM(props.y)}"${s2}style="zIndex:${props.zIndex}">${content}${s1}</layout>`;
    },
    htext(e, space) {
        return TextEncode(e, space, false);
    },
    vtext(e, space) {
        return TextEncode(e, space, true);
    },
    qrcode(e, space) {
        return CodeEncoder(e, space, 'qrcode');
    },
    hcode(e, space) {
        return CodeEncoder(e, space, 'hcode');
    },
    vcode(e, space) {
        return CodeEncoder(e, space, 'vcode');
    },
    table({ props }, space) {
        let { _layouts } = props;
        let s0 = GSpace(space + 1);
        if (props.splitable) {//分页多一层layout
            space++;
        }
        let s1 = GSpace(space + 1);
        let s2 = GSpace(space + 2);
        let s3 = GSpace(space + 3);
        let s4 = GSpace(space + 4);
        let table = `${s2}<table`;
        //if (props.hideBorder) {
        table += ` style="borderWidth:0;cellBorderWidth:0;"`;
        //} else {
        //table += ` style="borderWidth:0;"`;
        //}
        table += ` editor:tip="${props.tip}">`;
        for (let r of props.rows) {
            if (r.tag == '#script') {
                table += `${s3}${r.text}`;
            } else if (r.tag == 'tr') {
                table += `${s3}<tr>`;
                for (let c of r.cells) {
                    if (c.tag == '#script') {
                        table += `${s4}${c.text}`;
                    } else if (c.tag == 'td') {
                        table += `${s4}<td width="${ToMM(c.width)}"`;
                        // let rowspan = c.rowspan || 1;
                        // if ((props.__invalid && VariableReg.test(c.rowspan)) ||
                        //     ((c.height / rowspan) != CNC.TABLE_ROWS_HEIGHT)) {
                        if (c.autoHeight) {
                            table += ` height="0"`;
                        } else {
                            table += ` height="${ToMM(c.height)}"`;
                        }
                        //}
                        if (c.rowspan &&
                            (c.rowspan > 1 ||
                                (props.__invalid && VariableReg.test(c.rowspan)))) {
                            table += ` rowspan="${c.rowspan}"`;
                        }
                        if (c.colspan &&
                            (c.colspan > 1 ||
                                (props.__invalid && VariableReg.test(c.colspan)))) {
                            table += ` colspan="${c.colspan}"`;
                        }
                        table += ` style="borderWidth:${c.hasBorder ? 1 : 0}pt">`;
                        if (c.children && c.children.length) {
                            for (let cc of c.children) {
                                let encoder = Encoder[cc.type];
                                if (encoder) {
                                    table += encoder(cc, space + 4);
                                }
                            }
                            table += `${s4}</td>`;
                        } else {
                            table += '</td>';
                        }
                    }
                }
                table += `${s3}</tr>`;
            }
        }
        table += s2 + '</table>';
        let content = '';
        if (_layouts) {
            for (let c of _layouts) {
                if (c.tag == '#script') {
                    content += s2 + c.text;
                } else if (c.tag == 'table') {
                    content += table;
                }
            }
        } else {
            content = table;
        }
        let height = `${s2}height="${ToMM(props.height)}"`;
        if (props.splitable) {
            height = '';
        }
        let layout = `${s1}<layout editor:_for_="${Date.now()}"${s2}width="${ToMM(props.width)}"${height}${s2}left="${ToMM(props.x)}"${s2}top="${ToMM(props.y)}"${s2}style="zIndex:${props.zIndex}" orientation="vertical">${content}${s1}</layout>`;
        return props.splitable ? `${s0}<layout orientation="vertical">${layout}${s0}</layout>` : layout;
        //return layout;
    },
    '#script'(e, space) {
        return `${GSpace(space + 1)}${e.text}`;
    }
};

export default stage => {
    let page = stage.page;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    let splitable = page.splitable ? ' splitable="true"' : '';
    xml += `<page xmlns="${page.xmlns}"
    xmlns:xsi="${page['xmlns:xsi']}"
    xsi:schemaLocation="${page['xsi:schemaLocation']}"
    xmlns:editor="${page['xmlns:editor']}"
    width="${ToMM(page.width)}" height="${ToMM(page.height)}"${splitable}>`;
    if (page.header > 0) {
        xml += `${GSpace(1)}<header height="${ToMM(page.header)}"></header>`;
    }
    for (let e of stage.elements) {
        if (e.type == '#script' || !e.props.barred) {
            let fn = Encoder[e.type];
            if (fn) {
                xml += fn(e, 0);
            }
        }
    }
    if (page.footer > 0) {
        xml += `${GSpace(1)}<footer height="${ToMM(page.footer)}"></footer>`;
    }
    xml += `\n</page>`;
    return xml;
};