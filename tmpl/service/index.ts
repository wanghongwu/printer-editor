import Magix from 'magix';
import $ from '$';
let Service = Magix.Service.extend((bag, callback) => {
    let type = bag.get('method') || 'GET';
    let upload = bag.get('upload');
    let data = bag.get('params');
    let params = {
        url: bag.get('url'),
        type,
        data,
        dataType: 'json',
        complete(xhr, text) {
            try {
                if (text == 'error') {
                    callback({
                        msg: xhr.statusText
                    });
                } else {
                    let resp = xhr.responseJSON
                    if (!resp || resp.status != '1') {
                        callback({
                            msg: resp ? (resp.message || 'server error') : 'data error'
                        })
                        return;
                    }
                    bag.set('data', resp.data);
                    callback();
                }
            } catch (e) {
                callback({
                    msg: e.message
                });
            }
        }
    } as JQueryAjaxSettings;
    if (upload) {
        let fd = new FormData();
        let key = Magix.config('uploadImagesKey') || 'files';
        let files = bag.get('files') || [];
        for (let f of files) {
            fd.append(key, f);
        }
        params.cache = false;
        params.processData = false;
        params.contentType = false;
        params.data = fd;
    }
    $.ajax(params);
});

Service.add([{
    name: '@{get.components}',
    url: Magix.config('getComponentsUrl')
}, {
    name: '@{get.images}',
    url: Magix.config('getImagesUrl')
}, {
    name: '@{file.upload}',
    url: Magix.config('uploadImagesUrl'),
    method: 'POST',
    upload: true
}, {
    name: '@{get.templates}',
    url: Magix.config('getTemplatesUrl'),
    cache: 2 * 60 * 1000
}, {
    name: '@{get.content}',
    url: Magix.config('getContentUrl')
}, {
    name: '@{save.content}',
    url: Magix.config('saveContentUrl'),
    method: 'POST'
}]);

export default {
    ctor() {
        let me = this;
        me.on('rendercall', () => { //render方法被调用时，清除locker信息
            delete me['@{locker}'];
        });
    },
    request(key) {
        key = key || Magix.guid('r');
        let r = new Service();
        this.capture(key, r, true);
        return r;
    },
    fetch(models, callback) {
        let key = JSON.stringify(models);
        let r = this.request(key);
        r.all(models, callback);
    },
    /**
     * 保存数据到服务器
     * 默认保存时同样的数据不能多次提交
     * @param  {Array} models meta信息数组
     * @param  {Function} callback
     */
    save(models, callback) {
        let me = this;
        let key = JSON.stringify(models);
        me.lock(key, () => {
            me.request(key + '_request').save(models, callback);
        });
    },
    /**
     * 锁定方法调用，在解锁前不能调用第二次，常用于反复提交
     * @param  {String} key 锁定的key
     * @param  {Function} fn 回调方法
     */
    lock(key, fn) {
        let me = this;
        if (!me['@{locker}']) me['@{locker}'] = {};
        let locker = me['@{locker}'];
        if (!locker[key]) {
            locker[key] = fn;
            fn();
        }
    },
    /**
     * 解锁
     * @param  {String} key 锁定的key
     */
    unlock(key) {
        let locker = this['@{locker}'];
        if (locker) {
            delete locker[key];
        }
    },
    upload(files, groupId, cb) {
        let req = this.request(groupId);
        req.all({
            name: 'upload',
            files
        }, (err, bag) => {
            cb(groupId, bag.get('data', []));
        });
    }
}