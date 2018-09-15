import { State } from 'magix';
export default {
    '@{save}'() {
        let stage = JSON.stringify({
            page: State.get('page'),
            scale: State.get('@{stage&scale}'),
            elements: State.get('@{stage&elements}'),
            select: State.get('@{stage&select.elements}'),
            xLines: State.get('@{stage&x.help.lines}'),
            yLines: State.get('@{stage&y.help.lines}')
        });
        localStorage.setItem('l.state', stage);
    },
    '@{read}'(): Editor.SnapshotStatus {
        let stage = {} as Editor.SnapshotStatus;
        let str = localStorage.getItem('l.state');
        if (str) {
            try {
                stage = JSON.parse(str);
                stage.success = true;
            } catch  {

            }
        }
        return stage;
    },
    '@{clear}'() {
        localStorage.removeItem('l.state');
    }
}