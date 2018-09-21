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
}, {
    id: 6,
    name: '审批书',
    code: `<?xml version="1.0" encoding="UTF-8"?>
    <page xmlns="http://cloudprint.cainiao.com/print"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd"
        xmlns:editor="http://cloudprint.cainiao.com/schema/editor"
        width="210" height="297">
        <layout editor:_for_="1537406978561"
            width="174.36"
            height="17.46"
            left="17.72"
            top="25.67"
            style="zIndex:1">
            <table style="borderWidth:0;cellBorderWidth:0;" editor:tip="表格">
                <tr>
                    <td width="105.04" height="8.73">
                        <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                            editor:tip="横向文本">
                            <![CDATA[承包单位__________________]]>
                        </text>
                    </td>
                    <td width="69.32" height="8.73">
                        <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                            editor:tip="横向文本">
                            <![CDATA[合同号__________________]]>
                        </text>
                    </td>
                </tr>
                <tr>
                    <td width="105.04" height="8.73">
                        <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                            editor:tip="横向文本">
                            <![CDATA[监理单位__________________]]>
                        </text>
                    </td>
                    <td width="69.32" height="8.73">
                        <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                            editor:tip="横向文本">
                            <![CDATA[编　号__________________]]>
                        </text>
                    </td>
                </tr>
            </table>
        </layout>
        <layout editor:_for_="1537406978562"
            width="53.05"
            height="8.44"
            left="78.32"
            top="9"
            style="zIndex:2">
            <text style="fontFamily:SimHei;fontSize:17;align:center;valign:middle;"
                editor:tip="横向文本">
                <![CDATA[审批书]]>
            </text>
        </layout>
        <layout orientation="vertical">
            <layout editor:_for_="1537406978562"
                width="174.63"
                left="17.46"
                top="48.95"
                style="zIndex:3">
                <table editor:tip="表格">
                    <tr>
                        <td width="174.63" height="12.7" colspan="3">
                            <text style="fontFamily:SimHei;fontSize:9;"
                                editor:tip="横向文本">
                                <![CDATA[　　
            　　_____年__月__日，以第________号文件，进行___________项目]]>
                            </text>
                        </td>
                    </tr>
                    <tr>
                        <td width="174.63" height="14.29" colspan="3">
                            <layout editor:_for_="1537406978562"
                                width="25"
                                height="5"
                                left="2.39"
                                top="1.33"
                                style="zIndex:1">
                                <text style="fontFamily:SimHei;fontSize:10;"
                                    editor:tip="横向文本">
                                    <![CDATA[项目名称：]]>
                                </text>
                            </layout>
                        </td>
                    </tr>
                    <tr>
                        <td width="38.8" height="44.98"></td>
                        <td width="94.02" height="44.98">
                            <layout editor:_for_="1537406978562"
                                width="3.78"
                                height="3.78"
                                left="3.71"
                                top="29.64"
                                style="zIndex:1">
                                <rect style="borderWidth:2;"
                                    editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537406978562"
                                width="21.03"
                                height="3.94"
                                left="12.17"
                                top="29.64"
                                style="zIndex:2">
                                <text style="fontFamily:SimHei;fontSize:10;"
                                    editor:tip="横向文本">
                                    <![CDATA[项目需求3]]>
                                </text>
                            </layout>
                            <layout editor:_for_="1537406978562"
                                width="25"
                                height="5"
                                left="11.64"
                                top="9"
                                style="zIndex:3">
                                <text style="fontFamily:SimHei;fontSize:10;"
                                    editor:tip="横向文本">
                                    <![CDATA[项目需求1]]>
                                </text>
                            </layout>
                            <layout editor:_for_="1537406978562"
                                width="17.33"
                                height="5"
                                left="12.17"
                                top="19.05"
                                style="zIndex:4">
                                <text style="fontFamily:SimHei;fontSize:10;"
                                    editor:tip="横向文本">
                                    <![CDATA[项目需求2]]>
                                </text>
                            </layout>
                            <layout editor:_for_="1537406978562"
                                width="3.78"
                                height="3.78"
                                left="3.71"
                                top="19.58"
                                style="zIndex:1">
                                <rect style="borderWidth:2;"
                                    editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537406978562"
                                width="3.78"
                                height="3.78"
                                left="3.71"
                                top="9.53"
                                style="zIndex:1">
                                <rect style="borderWidth:2;"
                                    editor:tip="矩形"></rect>
                            </layout>
                        </td>
                        <td width="41.81" height="44.98"></td>
                    </tr>
                    <tr>
                        <td width="132.82" height="75.41" colspan="2"></td>
                        <td width="41.81" height="75.41"></td>
                    </tr>
                    <tr>
                        <td width="38.8" height="68"></td>
                        <td width="94.02" height="68"></td>
                        <td width="41.81" height="68"></td>
                    </tr>
                </table>
            </layout>
        </layout>
    </page>`
},{
    id:7,
    name:'调查表',
    code:`<?xml version="1.0" encoding="UTF-8"?>
    <page xmlns="http://cloudprint.cainiao.com/print"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://cloudprint.cainiao.com/print http://cloudprint-docs-resource.oss-cn-shanghai.aliyuncs.com/lpml_schema.xsd"
        xmlns:editor="http://cloudprint.cainiao.com/schema/editor"
        width="210" height="110">
        <layout editor:_for_="1537430291275"
            width="93"
            height="8.44"
            left="56.92"
            top="10.9"
            style="zIndex:1">
            <text style="fontFamily:SimHei;fontSize:18;align:center;valign:middle;"
                editor:tip="横向文本">
                <![CDATA[高等学校学生及家庭情况调查表]]>
            </text>
        </layout>
        <layout editor:_for_="1537430291275"
            width="185.87"
            height="8.44"
            left="11.02"
            top="23.46"
            style="zIndex:2">
            <text style="fontFamily:SimHei;fontSize:14;align:center;valign:middle;"
                editor:tip="横向文本">
                <![CDATA[学校:______________院(系):___________专业:______________年级______]]>
            </text>
        </layout>
        <layout orientation="vertical">
            <layout editor:_for_="1537430291295"
                width="196.85"
                left="6.57"
                top="36.03"
                style="zIndex:3">
                <table editor:tip="表格">
                    <tr>
                        <td width="11.11" height="44.25" rowspan="4">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;orientation:vertical;"
                                editor:tip="纵向文本">
                                <![CDATA[学生本人基础情况]]>
                            </text>
                        </td>
                        <td width="20.9" height="7.03">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[姓名]]>
                            </text>
                        </td>
                        <td width="35.72" height="7.03"></td>
                        <td width="19.31" height="7.03">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[性别]]>
                            </text>
                        </td>
                        <td width="15.61" height="7.03"></td>
                        <td width="32.28" height="7.03">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[出生年月]]>
                            </text>
                        </td>
                        <td width="23.55" height="7.03"></td>
                        <td width="19.02" height="7.03">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[民族]]>
                            </text>
                        </td>
                        <td width="19.34" height="7.03"></td>
                    </tr>
                    <tr>
                        <td width="20.9" height="13.11">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[身份证
号　码]]>
                            </text>
                        </td>
                        <td width="55.03" height="13.11" colspan="2"></td>
                        <td width="15.61" height="13.11">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[政治
面貌]]>
                            </text>
                        </td>
                        <td width="32.28" height="13.11"></td>
                        <td width="23.55" height="13.11">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[入学前
户　口]]>
                            </text>
                        </td>
                        <td width="38.36" height="13.11" colspan="2">
                            <layout editor:_for_="1537430291278"
                                width="4"
                                height="4"
                                left="3.37"
                                top="4.59"
                                style="zIndex:1">
                                <rect editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537430291278"
                                width="9.39"
                                height="5"
                                left="8.67"
                                top="4.06"
                                style="zIndex:2">
                                <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                                    editor:tip="横向文本">
                                    <![CDATA[城镇]]>
                                </text>
                            </layout>
                            <layout editor:_for_="1537430291278"
                                width="4"
                                height="4"
                                left="20.04"
                                top="4.59"
                                style="zIndex:1">
                                <rect editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537430291278"
                                width="9.39"
                                height="5"
                                left="25.6"
                                top="4.06"
                                style="zIndex:4">
                                <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                                    editor:tip="横向文本">
                                    <![CDATA[农村]]>
                                </text>
                            </layout>
                        </td>
                    </tr>
                    <tr>
                        <td width="20.9" height="12.85">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[家　庭
人中数]]>
                            </text>
                        </td>
                        <td width="35.72" height="12.85"></td>
                        <td width="19.31" height="12.85"></td>
                        <td width="15.61" height="12.85">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[毕业
学院]]>
                            </text>
                        </td>
                        <td width="32.28" height="12.85"></td>
                        <td width="23.55" height="12.85">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[个人
特长]]>
                            </text>
                        </td>
                        <td width="19.02" height="12.85"></td>
                        <td width="19.34" height="12.85"></td>
                    </tr>
                    <tr>
                        <td width="20.9" height="11.26">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[孤残]]>
                            </text>
                        </td>
                        <td width="35.72" height="11.26">
                            <layout editor:_for_="1537430291279"
                                width="4"
                                height="4"
                                left="5.76"
                                top="3.66"
                                style="zIndex:1">
                                <rect editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537430291279"
                                width="5.16"
                                height="5"
                                left="11.05"
                                top="3.13"
                                style="zIndex:2">
                                <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                                    editor:tip="横向文本">
                                    <![CDATA[是]]>
                                </text>
                            </layout>
                            <layout editor:_for_="1537430291279"
                                width="4"
                                height="4"
                                left="19.51"
                                top="3.66"
                                style="zIndex:1">
                                <rect editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537430291293"
                                width="4.89"
                                height="5"
                                left="25.07"
                                top="3.13"
                                style="zIndex:4">
                                <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                                    editor:tip="横向文本">
                                    <![CDATA[否]]>
                                </text>
                            </layout>
                        </td>
                        <td width="19.31" height="11.26">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[单亲]]>
                            </text>
                        </td>
                        <td width="47.89" height="11.26" colspan="2">
                            <layout editor:_for_="1537430291293"
                                width="4"
                                height="4"
                                left="5.76"
                                top="3.66"
                                style="zIndex:1">
                                <rect editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537430291293"
                                width="5.16"
                                height="5"
                                left="11.05"
                                top="3.13"
                                style="zIndex:2">
                                <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                                    editor:tip="横向文本">
                                    <![CDATA[是]]>
                                </text>
                            </layout>
                            <layout editor:_for_="1537430291294"
                                width="4"
                                height="4"
                                left="19.51"
                                top="3.66"
                                style="zIndex:1">
                                <rect editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537430291294"
                                width="4.89"
                                height="5"
                                left="25.07"
                                top="3.13"
                                style="zIndex:4">
                                <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                                    editor:tip="横向文本">
                                    <![CDATA[否]]>
                                </text>
                            </layout>
                        </td>
                        <td width="23.55" height="11.26">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[烈士或优抚
对象子女]]>
                            </text>
                        </td>
                        <td width="38.36" height="11.26" colspan="2">
                            <layout editor:_for_="1537430291294"
                                width="4"
                                height="4"
                                left="5.76"
                                top="3.66"
                                style="zIndex:1">
                                <rect editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537430291294"
                                width="5.16"
                                height="5"
                                left="11.05"
                                top="3.13"
                                style="zIndex:2">
                                <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                                    editor:tip="横向文本">
                                    <![CDATA[是]]>
                                </text>
                            </layout>
                            <layout editor:_for_="1537430291294"
                                width="4"
                                height="4"
                                left="19.51"
                                top="3.66"
                                style="zIndex:1">
                                <rect editor:tip="矩形"></rect>
                            </layout>
                            <layout editor:_for_="1537430291295"
                                width="4.89"
                                height="5"
                                left="25.07"
                                top="3.13"
                                style="zIndex:4">
                                <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                                    editor:tip="横向文本">
                                    <![CDATA[否]]>
                                </text>
                            </layout>
                        </td>
                    </tr>
                    <tr>
                        <td width="11.11" height="18.82" rowspan="2">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[家庭
通信
信息]]>
                            </text>
                        </td>
                        <td width="56.62" height="9.41" colspan="2">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[详细通讯地址]]>
                            </text>
                        </td>
                        <td width="129.12" height="9.41" colspan="6"></td>
                    </tr>
                    <tr>
                        <td width="56.62" height="9.41" colspan="2">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[邮政编码]]>
                            </text>
                        </td>
                        <td width="34.92" height="9.41" colspan="2"></td>
                        <td width="32.28" height="9.41">
                            <text style="fontFamily:SimHei;fontSize:12;align:center;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[联系电话]]>
                            </text>
                        </td>
                        <td width="61.92" height="9.41" colspan="3">
                            <text style="fontFamily:SimHei;fontSize:10;valign:middle;"
                                editor:tip="横向文本">
                                <![CDATA[　　　　　　（区号）－　　　　]]>
                            </text>
                        </td>
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
            json.xLines = [];
            json.yLines = [];
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