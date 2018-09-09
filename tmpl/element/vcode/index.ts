import { View } from 'magix';
const CDN = 'https://img.alicdn.com/tfs/';
const CodeUrlMap = {
    upca: CDN + 'TB1VkRRqcUrBKNjSZPxXXX00pXa-190-112.svg',
    upce: CDN + 'TB1VkRRqcUrBKNjSZPxXXX00pXa-190-112.svg',
    upca_text: CDN + 'TB1NTQHqlsmBKNjSZFsXXaXSVXa-222-122.svg',
    upce_text: CDN + 'TB1NTQHqlsmBKNjSZFsXXaXSVXa-222-122.svg',
    code128: CDN + 'TB1t77KqljTBKNjSZFNXXasFXXa-312-100.svg',
    code93: CDN + 'TB1t77KqljTBKNjSZFNXXasFXXa-312-100.svg',
    c25inter: CDN + 'TB1t77KqljTBKNjSZFNXXasFXXa-312-100.svg',
    code128_text: CDN + 'TB1A_MKqljTBKNjSZFNXXasFXXa-312-122.svg',
    code93_text: CDN + 'TB1A_MKqljTBKNjSZFNXXasFXXa-312-122.svg',
    c25inter_text: CDN + 'TB1A_MKqljTBKNjSZFNXXasFXXa-312-122.svg',
    code39: CDN + 'TB1NXIiqkomBKNjSZFqXXXtqVXa-448-100.svg',
    code39_text: CDN + 'TB1TdocqiMnBKNjSZFoXXbOSFXa-448-122.svg',
    ean8: CDN + 'TB1mIuAqlnTBKNjSZPfXXbf1XXa-134-100.svg',
    ean8_text: CDN + 'TB1rOARqiAnBKNjSZFvXXaTKXXa-134-122.svg',
    ean13: CDN + 'TB1n8RrqCcqBKNjSZFgXXX_kXXa-190-112.svg',
    ean13_text: CDN + 'TB1stsuqcj_B1NjSZFHXXaDWpXa-214-122.svg',
    itf14: CDN + 'TB1Y247qdknBKNjSZKPXXX6OFXa-270-100.svg',
    itf14_text: CDN + 'TB1PDcUqkUmBKNjSZFOXXab2XXa-270-122.svg'
};
export default View.extend({
    tmpl: '@index.html',
    init(data) {
        this.assign(data);
        this.updater.set({
            codeMap: CodeUrlMap
        });
    },
    assign(data) {
        this.updater.set(data.props);
        return data.forceUpdate;
    },
    render() {
        this.updater.digest();
    }
});