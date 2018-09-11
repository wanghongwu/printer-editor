/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
import Serializer from '../../cainiao/serializer';
const Templates = [{
    id: '1',
    name: '普通元素',
    code: `<?xml version="1.0" encoding="UTF-8"?>
    <page xmlns="http://cloudprint.cainiao.com/print"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd"
        xmlns:editor="http://cloudprint.cainiao.com/schema/editor"
        width="210" height="297" splitable="true">
        <layout editor:_for_="1536670907422"
            width="30"
            height="30"
            left="17.99"
            top="17.99"
            style="zIndex:1">
            <barcode type="qrcode"
                ratioMode="keepRatio"
                style="opacity:1;">
                <![CDATA[]]>
            </barcode>
        </layout>
        <layout editor:_for_="1536670907422"
            width="52.92"
            height="52.92"
            left="68.53"
            top="2.65"
            style="zIndex:2">
            <image src="//img.alicdn.com/tfs/TB1E1OSryAnBKNjSZFvXXaTKXXa-200-200.png" 
                allowFailure="false"/>
        </layout>
    </page>`
}, {
    id: '2',
    name: '复杂表格',
    code: `<?xml version="1.0" encoding="UTF-8"?>
    <page xmlns="http://cloudprint.cainiao.com/print"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd"
        xmlns:editor="http://cloudprint.cainiao.com/schema/editor"
        width="210" height="297">
        <layout orientation="vertical">
            <layout editor:_for_="1536671292913"
                width="158.75"
                left="10.85"
                top="10.85"
                style="zIndex:1">
                <table>
                    <tr>
                        <td width="77.78" height="5.29"></td>
                        <td width="80.97" height="5.29" colspan="2"></td>
                    </tr>
                    <%=a%>
                    <tr>
                        <td width="77.78" height="10.58" rowspan="2"></td>
                        <td width="80.97" height="5.29" colspan="2"></td>
                    </tr>
                    <%=a%>
                    <tr>
                        <td width="39.69" height="5.29"></td>
                        <td width="41.28" height="5.29"></td>
                    </tr>
                    <tr>
                        <td width="117.47" height="51.85" rowspan="3" colspan="2"></td>
                        <td width="41.28" height="7.94"></td>
                    </tr>
                    <%=a%>
                    <tr>
                        <td width="41.28" height="16.14"></td>
                    </tr>
                    <tr>
                        <td width="41.28" height="27.77"></td>
                    </tr>
                    <tr>
                        <td width="77.78" height="5.29"></td>
                        <td width="39.69" height="11.11" rowspan="2"></td>
                        <td width="41.28" height="5.29"></td>
                    </tr>
                    <tr>
                        <td width="77.78" height="5.82"></td>
                        <td width="41.28" height="5.82"></td>
                    </tr>
                </table>
            </layout>
        </layout>
    </page>`
}, {
    id: '3',
    name: '仓库移仓单',
    code: `<?xml version="1.0" encoding="UTF-8"?>
    <page
            xmlns="http://cloudprint.cainiao.com/print"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd"
            xmlns:editor="http://cloudprint.cainiao.com/schema/editor"
            width="210" height="297"  splitable="true" >
            <layout 
                editor:_for_="1504677073128891"
                
                id="150467707312999" width="34.79" height="6.96" left="80.91" top="9.21"  style="zIndex:1;">
                <text  
                    style="fontFamily:SimHei;fontSize:12;align:center;">
                    <![CDATA[仓库移仓单]]>
                </text>
            
            </layout>
            <layout 
                editor:_for_="1504677131297842"
                
                id="1504677131304327" width="199.42" height="16.93" left="3.96" top="21.43"  style="zIndex:2;">
             <table style="borderWidth:0;cellBorderWidth:0;"  width="199.42"  height="16.93" >
                <tr>
                <td width="19.84" height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;valign:middle;">
                    <![CDATA[NO:]]>
                </text>
            
                </td>
                <td width="38.36" height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;valign:middle;">
                    <![CDATA[<%=_data.data.djbh%>]]>
                </text>
            
                </td>
                <td width="20.11" height="5.29" >
                
                </td>
                <td width="36.25" height="5.29" >
                
                </td>
                <td width="15.61" height="5.29" >
                
                </td>
                <td width="24.34" height="5.29" >
                
                </td>
                <td width="19.58" height="5.29" >
                
                </td>
                <td width="25.14" height="5.29" >
                
                </td>
                </tr>
    <tr>
                <td height="11.64" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;">
                    <![CDATA[移出仓库：]]>
                </text>
            
                </td>
                <td height="11.64" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;">
                    <![CDATA[<%=_data.data.ycck_id_name%>]]>
                </text>
            
                </td>
                <td height="11.64" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;">
                    <![CDATA[移入仓库：]]>
                </text>
            
                </td>
                <td height="11.64" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;">
                    <![CDATA[<%=_data.data.yrck_id_name%>]]>
                </text>
            
                </td>
                <td height="11.64" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;">
                    <![CDATA[制单人：]]>
                </text>
            
                </td>
                <td height="11.64" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;">
                    <![CDATA[<%=_data.data.zdr%>]]>
                </text>
            
                </td>
                <td height="11.64" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;">
                    <![CDATA[制单日期：]]>
                </text>
            
                </td>
                <td height="11.64" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;">
                    <![CDATA[<%=_data.data.zdrq%>]]>
                </text>
            
                </td>
                </tr>
             </table>
             
            </layout>
            <layout 
                
                
                id="1505699369400542" orientation="vertical"  style=""><layout 
                editor:_for_="1504677798040441"
                
                id="150467779804684" width="199.42" height="11.02" left="3.7" top="41.28"  style="overflow:visible;zIndex:3;">
             <table style=""  width="199.42"  height="11.02" >
                <tr>
                <td width="12.7" height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;align:center;valign:middle;">
                    <![CDATA[行号]]>
                </text>
            
                </td>
                <td width="41.8" height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;align:center;valign:middle;">
                    <![CDATA[商品代号]]>
                </text>
            
                </td>
                <td width="48.95" height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;align:center;valign:middle;">
                    <![CDATA[商品名称]]>
                </text>
            
                </td>
                <td width="17.73" height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;align:center;valign:middle;">
                    <![CDATA[颜色]]>
                </text>
            
                </td>
                <td width="16.93" height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;align:center;valign:middle;">
                    <![CDATA[规格]]>
                </text>
            
                </td>
                <td width="43.92" height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;align:center;valign:middle;">
                    <![CDATA[SKU]]>
                </text>
            
                </td>
                <td width="16.93" height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;align:center;valign:middle;">
                    <![CDATA[数量]]>
                </text>
            
                </td>
                </tr>
    <% for(i=0;i<_data.data_mx.length;i++) {%>
    
    <tr>
                <td height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;align:center;valign:middle;">
                    <![CDATA[<%=i+1%>]]>
                </text>
            
                </td>
                <td height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;align:center;valign:middle;">
                    <![CDATA[<%=_data.data_mx[i].goods_sn%>]]>
                </text>
            
                </td>
                <td height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;align:center;valign:middle;">
                    <![CDATA[<%=_data.data_mx[i].goods_id_name%>]]>
                </text>
            
                </td>
                <td height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;align:center;valign:middle;">
                    <![CDATA[<%=_data.data_mx[i].color_id_name%>]]>
                </text>
            
                </td>
                <td height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;align:center;valign:middle;">
                    <![CDATA[<%=_data.data_mx[i].size_id_name%>]]>
                </text>
            
                </td>
                <td height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;align:center;valign:middle;">
                    <![CDATA[<%=_data.data_mx[i].sku%>]]>
                </text>
            
                </td>
                <td height="5.29" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;align:center;valign:middle;">
                    <![CDATA[<%=_data.data_mx[i].sl%>]]>
                </text>
            
                </td>
                </tr>
    <%}%>
    
    <tr>
                <td colspan="7" height="10.05" >
                
                <text  
                    style="fontFamily:SimHei;fontSize:10;valign:middle;">
                    <![CDATA[合计：<%=_data.data.sl%>]]>
                </text>
            
                </td>
                </tr>
    <tr>
                <td colspan="7" height="11.91" >
                
                <text  
                    style="fontFamily:SimHei;fontWeight:bold;fontSize:10;align:right;valign:middle;">
                    <![CDATA[申请人签字：________ 仓库人签字：_________ 接收人签字：________]]>
                </text>
            
                </td>
                </tr>
             </table>
             
            </layout>
            </layout>
    </page>`
}, {
    id: '4',
    name: '小纸张',
    code: `<?xml version="1.0" encoding="UTF-8"?>
    <page xmlns="http://cloudprint.cainiao.com/print"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd"
        xmlns:editor="http://cloudprint.cainiao.com/schema/editor"
        width="74" height="105" splitable="true">
        <layout editor:_for_="1536671424425"
            width="30"
            height="30"
            left="42.07"
            top="2.91"
            style="zIndex:1">
            <barcode type="qrcode"
                ratioMode="keepRatio"
                style="opacity:1;">
                <![CDATA[]]>
            </barcode>
        </layout>
        <layout editor:_for_="1536671424426"
            width="52.92"
            height="21.17"
            left="9.26"
            top="48.15"
            style="zIndex:2">
            <rect></rect>
        </layout>
    </page>`
}, {
    id: '5',
    name: '表格嵌套',
    code: `<?xml version="1.0" encoding="UTF-8"?>
    <page xmlns="http://cloudprint.cainiao.com/print"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd"
        xmlns:editor="http://cloudprint.cainiao.com/schema/editor"
        width="148" height="210" splitable="true">
        <layout orientation="vertical">
            <layout editor:_for_="1536671992333"
                width="136.79"
                left="5.56"
                top="5.56"
                style="zIndex:1">
                <table>
                    <tr>
                        <td width="17.74" height="5.29"></td>
                        <td width="106.6" height="5.29"></td>
                        <td width="12.45" height="5.29"></td>
                    </tr>
                    <tr>
                        <td width="17.74" height="71.97"></td>
                        <td width="106.6" height="71.97">
                            <layout orientation="vertical">
                                <layout editor:_for_="1536671992333"
                                    width="93.13"
                                    left="5.47"
                                    top="12.7"
                                    style="zIndex:1">
                                    <table>
                                        <tr>
                                            <td width="93.13" height="32.01">
                                                <layout orientation="vertical">
                                                    <layout editor:_for_="1536671992333"
                                                        width="70.38"
                                                        left="9"
                                                        top="5.56"
                                                        style="zIndex:1">
                                                        <table>
                                                            <tr>
                                                                <td width="70.38" height="7.54">
                                                                    <text style="fontFamily:SimHei;">
                                                                        <![CDATA[]]>
                                                                    </text>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td width="70.38" height="7.54">
                                                                    <text style="fontFamily:SimHei;">
                                                                        <![CDATA[]]>
                                                                    </text>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </layout>
                                                </layout>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="93.13" height="17.73">
                                                <text style="fontFamily:SimHei;">
                                                    <![CDATA[]]>
                                                </text>
                                            </td>
                                        </tr>
                                    </table>
                                </layout>
                            </layout>
                        </td>
                        <td width="12.45" height="71.97"></td>
                    </tr>
                </table>
            </layout>
        </layout>
    </page>`
}];
Magix.applyStyle('@template.less');
export default Magix.View.extend({
    tmpl: '@template.html',
    init(data) {
        this['@{page}'] = JSON.stringify(data.page);
        this['@{dialog.entity}'] = data.dialog;
        this['@{enter.fn}'] = data.enter;
    },
    render() {
        this.updater.digest({
            selected: '-1',
            templates: Templates
        });
    },
    // '@{choose}<click>'(e) {
    //     let t = e.params.t;
    //     this.updater.digest({
    //         selected: t.id,
    //         code: t.code
    //     });
    // },
    '@{enter}<click>'(e) {
        let me = this;
        let xml = e.params.t.code;
        let json;
        try {
            json = Serializer.decode(xml);
        } catch (e) {
            me.alert(e.message);
            return;
        }
        if (me['@{page}'] != JSON.stringify(json.page)) {
            json.pageChange = true;
        }
        this['@{enter.fn}'](json);
        this['@{dialog.entity}'].close();
    },
    '@{cancel}<click>'() {
        this['@{dialog.entity}'].close();
    }
});