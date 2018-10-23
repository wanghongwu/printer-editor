import Magix, { State } from 'magix';
export default {
    '@{save}'() {
        return;
        let stage = JSON.stringify({
            tempId: Magix.config('tempId'),
            bizId: Magix.config('bizId'),
            page: State.get('page'),
            scale: State.get('@{stage&scale}'),
            elements: State.get('@{stage&elements}'),
            select: State.get('@{stage&select.elements}'),
            xLines: State.get('@{stage&x.help.lines}'),
            yLines: State.get('@{stage&y.help.lines}')
        });
        try {
            localStorage.setItem('l.state', stage);
        } catch{

        }
    },
    '@{read}'(): Editor.SnapshotStatus {
        let stage = {} as Editor.SnapshotStatus;
        try {
            let str = localStorage.getItem('l.state');
            if (str) {
                stage = JSON.parse(str);
                stage.success = true;
            }
        } catch  {

        }
        return stage;
    },
    '@{clear}'() {
        try {
            localStorage.removeItem('l.state');
        } catch{

        }
    }
}