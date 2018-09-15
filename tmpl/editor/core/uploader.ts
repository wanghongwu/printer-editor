export default {
    '@{upload.images}'(view, files, cb) {
        //view.alert('上传功能稍后支持...');
        setTimeout(() => {
            // cb([{
            //     width:300,
            //     height:500
            // },null,{
            //     src:'https://www.baidu.com/img/bd_logo1.png?qua=high&where=super'
            // }]);
            cb([])
        }, 11000);
    }
};