1. 菜鸟的线条宽度是单位是pt，矩形的线条宽度是px，同样的数值，实际显示的不一样？
2. 菜鸟旋转后拖动缩放，有bug
3. 线条的宽度用pt单位，长度用的mm？

# text
> 关于"文本"的处理。菜鸟逻辑：当文本放在表格内时，其实是不能移动和改变宽高的，虽然表面上能移动和改变宽度，但你保存后刷新页面，这个文本框会恢复到左上角，同时宽高也不能调整，看了下源码，当文本放在表格内时，宽高是使用的百分比92%
1. 因需求上文本放在表格内也需要保持坐标及宽高信息，因此默认不能使用百分比
2. 当文本放在表格内时，提供一个菜鸟逻辑的控制，当使用菜鸟逻辑时，则保持和菜鸟的一致
3. 当文本放在表格内时，只有关掉菜鸟逻辑后才可以调整位置及大小

# table
1. 表格的单元格可视化合并，存在自动减少合并单元格数量的情况，如一行`2`个单元格，第`1`个`rowspan=2`，第`2`个`rowspan=3`，这`2`个`rowspan`需要同时减`1`
2. 可视化合并，存在补充单元格的情况，具体参考测试模板中合并单元格的情况或复杂表格[3,3]向下合并


# todo
1. √ 重构右键menu组件，增加分割线及禁用状态
2. √ 修改标尺高度到18px
3. √ 默认值修改scale后需要重新计算
4. √ 纸张默认一些常用尺寸，比如A4,A3之类
5. √ 增加历史记录，支持撤销、重做功能
6. √ 表格单元格支持全选与粘贴
7. √ 表格内元素也支持`Tab`键的选择功能
8. √ 表格内元素与外部互相复制与粘贴
9. √ 元素锁定时改变选中边框颜色，直观的告诉使用人员
10. √ 支持剪切功能
11. √ 组件树支持显示表格内的元素
12. 支持拖动时吸附功能(如果实现该功能后会导致无法使用拖动功能靠近某元素边线)
13. √ 编辑内容本地存储，防止意外退出
14. √ 重构`tojson`与`toxml`代码
15. √ 表格在`xml`状态下行里面的单元格，与列里面对应的单元格有可能高或宽不一致，动态计算取最优值
16. √ 右键菜单根据编辑区状态，禁用或启用某些菜单项，方便开发人员识别编辑区内的状态
17. √ 拉辅助线
18. `Tab`键选中元素时滚动元素到可视区
19. 常用功能直接显示在编辑元素的周围而非右侧属性区？
20. 调整`z`轴支持快捷键
21. √ 调整表格默认行高，及插入时当前行高
22. √ 收缩工具栏
23. √ 文本双击后可编辑
24. √ 支持源码形式合并单元格
25. √ 支持`cn`文本放在`td`中的逻辑
26. √ 计算表格在有单元格合并的情况下的各单元格的尺寸
27. √ 支持可视化下的单元格尺寸调整
28. √ 支持可视化下的单元格合并
29. √ 序列与反序列逻辑在`code`模块完成
30. √ 支持多语言
31. √ 支持打印项
32. √ 图片支持上传功能、粘贴上传及编辑区支持拖拽上传图片
33. √ 淡化表格隐藏边框后的可视颜色，尽可能的展示隐藏后的效果，同时也不影响可视化编辑
34. √ 调整表格旁边的`icon`，减少视觉上的吸引
35. √ 调整表格单元格的手柄，当单元格高或宽为`0`时，右或底部的手柄应该盖在左或上的手柄上，这样才能把单元格再拖开
36. √ 把部分特有的属性序列化到`xml`中
37. √ 单元格内拉框选择
38. √ 元素在编辑区水平、垂直居中
39. √ 选中多个元素，水平、垂直均分
40. √ 当表格单元格选中时，按`tab`键则优先选中的单元格
41. √ 根据比例动态调整标尺
42. √ 支持页头页脚
43. √ 自动减少列上的`colspan`和行上的`rowspan`，更好的适应单元格的合并
44. √ 自动添加缺失的单元格
46. √ 扩大调整元素的手柄，与辅助线相同
47. √ 根据元素尺寸，动态调整元素手柄大小
48. √ 元素可拖动调整宽高至`0`
49. √ 当元素不可见时，使用淡红色给出标识
50. √ 更改拖动、调整大小、旋转时的鼠标指标不受其它元素的影响
51. √ 接口化相关内容
52. √ 支持自动保存功能
53. √ 支持异常退出、未保存成功等再登录后的恢复功能
54. √ 支持页面关闭时，编辑区有变化时才提示，而非一直提示
55. √ 添加更多中文字体


# bug
1. √ 表格单元格拖动在有`script`时识别子元素有问题
2. √ 表格支持合并
3. √ 表格分页要再加一个layout
4. √ 表格中的text可能没有layout
5. √ 表格layout分页时不能添加高度
6. √ 表格`rowspan`或`colspan`可为变量，当为变量时，表格的一切可视化操作将被禁止
7. √ 修复导航树拖动时，子树不能做为拖动及放置的`bug`
8. √ 修复双击文本无法编辑的`bug`


# elements

## hline 水平直线
* type:string hline
* props.width:number default 75.59px == 20mm
* props.height:number default 1.33px == 1mm
* props.type:string  default solid  [solid,dotted,dashed]
* props.tip:string default 水平直线


## vline 垂直直线
* type:string vline
* props.width:number default 1.33px == 1mm
* props.height:number default 75.59px == 20mm
* props.type:string  default solid  [solid,dotted,dashed]
* props.tip:string default 垂直直线

## rect 矩形
* type:string rect
* props.width:number default　98.27px == 26mm
* props.height:number default 98.27px == 26mm
* props.borderWidth:number default 1px
* props.borderType:string  default solid  [solid,dotted,dashed]
* props.fill:boolean default false
* props.tip:string default 矩形

## htext 横排文本
* type:string htext
* props.width:number default　94.49px == 25mm
* props.height:number default 18.9px == 5mm
* props.rotate:number default 0 [-360~360]
* prpos.alpha:number default 1 [1~0]
* props.fontFamily:string default SimHei [SimSun,SimHei,Arial,Times New Roman,Tahoma,webdings,Arial Black,Arial Narrow,Arial Unicode MS]
* props.fontSize:number default 8
* props.lineHeight:string[] default []
* props.fontStyle:string[] default []
* props.align:string[] default ['left','top']
* props.letterSpacing:number default 0
* props.fontWeight:string default normal [normal, bold, light]
* props.text:string default ''
* props.alias:string  default ''
* props.direction:string default ltr [ltr,rtl]
* props.color:string default '-1'
* props.tip:string default 横排文本


## vtext 竖排文本
* type:string vtext
* props.width:number default　22.68px == 6mm
* props.height:number default 128.5px == 34mm
* props.rotate:number default 0 [-360~360]
* prpos.alpha:number default 1 [1~0]
* props.fontFamily:string default SimHei [SimSun,SimHei,Arial,Times New Roman,Tahoma,webdings,Arial Black,Arial Narrow,Arial Unicode MS]
* props.fontSize:number default 8
* props.lineHeight:string[] default []
* props.fontStyle:string[] default []
* props.align:string[] default ['left','top']
* props.letterSpacing:number default 0
* props.fontWeight:string default normal [normal, bold, light]
* props.text:string default ''
* props.alias:string  default ''
* props.direction:string default ltr [ltr,rtl]
* props.color:string default '-1'
* props.tip:string default 竖排文本

## image 图片
* type:string image
* props.width:number default　188.98px == 50mm
* props.height:number default 188.98px == 50mm
* props.rotate:number default 0 [-360~360]
* prpos.alpha:number default 1 [1~0]
* props.src:string default //img.alicdn.com/tfs/TB1E1OSryAnBKNjSZFvXXaTKXXa-200-200.png
* props.tip:string default 图片

## hcode 横向条码
* type:string hcode
* props.width:number default　151.18px == 40mm
* props.height:number default 90.71px == 24mm
* props.rotate:number default 0 [-360~360]
* prpos.alpha:number default 1 [1~0]
* props.text:string default ''
* props.showText:boolean  default false
* props.type:string default code128 [code128,code93,code39,upca,upce,ean8,ean13,itf14,c25inter]
* props.tip:string default 横向条码

## vcode 纵向条码
* type:string vcode
* props.width:number default　90.71px == 24mm
* props.height:number default 151.18px == 40mm
* props.rotate:number default 0 [-360~360]
* prpos.alpha:number default 1 [1~0]
* props.text:string default ''
* props.showText:boolean  default false
* props.type:string default code128 [code128,code93,code39,upca,upce,ean8,ean13,itf14,c25inter]
* props.tip:string default 纵向条码

## qrcode 二维码
* type:string qrcode
* props.width:number default　113.39px == 30mm
* props.height:number default 113.39px == 30mm
* prpos.alpha:number default 1 [1~0]
* props.text:string default ''
* props.schema:number default 2 [2~6]
* props.primary:string  default ''
* props.type:string default qrcode [qrcode,pdf417,maxicode,datamatrix]
* props.tip:string default 二维码

## table　表格
* type:string table
* props.tip:string default 表格

