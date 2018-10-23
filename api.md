## Designer.init 配置
> 以下是配置在页面`Designer.init`中的参数

### 获取模板详情
> getContentUrl
* 输入(入参)
  * temp_id
  * biz_id
* 输出(响应内容)
```json
{
    "status": 1,
    "message": "success",
    "data": {
        "temp_name": "拣货单",
        "temp_id": 111,
        "biz_id": "order",
        "content": "此处为xml格式的文件内容"
    }
}
```

### 保存
> saveContentUrl
* 输入(入参)
  * temp_id
  * content (content为xml格式的内容)
* 输出(响应内容)
```json
{
    "status": 1,
    "message": "success",
    "data": {
        "temp_url": "//response.template.url/content?temp_id=12"
    }
}
```
> 保存后最好返回，能读取`xml`内容的`url`，方便后续做打印预览，因为打印预览时要先保存内容

### 通用模板(参考模板，公用模板)
> getTemplatesUrl
* 输入(入参)
  * biz_id
* 输出(响应内容)
```json
{
    "status": 1,
    "message": "success",
    "data": [
        {
            "temp_id": 1,
            "temp_name": "模板名称",
            "content": "此处为xml格式的文件内容"
        },
        {
            "temp_id": 2,
            "temp_name": "模板名称2",
            "content": "此处为xml格式的文件内容"
        }
    ]
}
```

### 打印项
> getComponentsUrl
* 输入(入参)
  * biz_id
* 输出(响应内容)
```json
{
    "status": 1,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "打印项名称",
            "type": "类型请参考　https://github.com/xinglie/printer-editor/blob/master/q.md#elements",
            "props": {
                "width": 200,
                "height": 300
            }
        },
        {
            "id": 2,
            "name": "二维码",
            "type": "qrcode",
            "props": {
                "width": 200,
                "text":"print text"
            }
        }
    ]
}
```
> 返回列表中的`type`指编辑器支持的文本、图片、表格等。`type`不同，预设属性也不同，更多属性请参考　https://github.com/xinglie/printer-editor/blob/master/q.md#elements

### 获取图片列表
> getImagesUrl

* 输入(入参)
  * biz_id
* 输出(响应内容)
```json
{
    "status": 1,
    "message": "success",
    "data": [
        {
            "title": "power up",
            "src": "http://pic.qiantucdn.com/58pic/11/39/18/98D58PICPZI.jpg!/fw/1024/watermark/url/L2ltYWdlcy93YXRlcm1hcmsveGlhb3R1LnBuZw==/align/center"
        },
        {
            "src": "http://image.tupian114.com/20121128/14562878.jpg",
            "title": "球"
        }
    ]
}
```

### 上传图片
> uploadImagesUrl
* 输入(入参)
  * biz_id
  * temp_id
  * files (files为图片文件数组，该key可以在Designer.init中进行配置)
* 输出(响应内容)
```json
{
    "status": 1,
    "message": "success",
    "data": [
        {
            "title": "dogs",
            "src": "http://pic26.photophoto.cn/20130326/0033034324989838_b.jpg"
        },
        {
            "error":"error message"
        }
    ]
}
```
> 响应中的`data`数组顺序要与上传时的`files`顺序一致，当某个文件保存出错时也要返回对应的信息


### 上传缩略图
> uploadThumbImageUrl
* 输入(入参)
  * biz_id
  * temp_id
  * thumb (thumb为缩略图的key，该key可以在Designer.init中进行配置)
* 输出(响应内容)
```json
{
    "status": 1,
    "message": "success",
    "data": {
        "url": "http://pic26.photophoto.cn/20130326/0033034324989838_b.jpg"
    }
}
```

### 上传图片key
> uploadImagesKey
服务端用于接收上传的图片key，默认`files[]`，该值内容是一个数组

### 上传缩略图片key
> thumbImageKey
服务端用于接收上传的缩略图片key，默认`thumb`



### 模拟开发
> mock

正式环境请不要配置该参数，仅模拟数据时使用