import ProgressBar from 'progress';

export class ProgressBarManager {
    private bar: ProgressBar | null = null;

    createBar(total: number) {
        this.bar = new ProgressBar(':bar', { total });
    }

    updateBar(increment: number) {
        if (this.bar) {
            this.bar.tick(increment);
        }
    }
}