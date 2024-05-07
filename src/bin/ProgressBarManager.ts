// src/bin/ProgressBarManager.ts
import ProgressBar from 'progress';
import chalk from 'chalk';

export class ProgressBarManager {
    private bar: ProgressBar | null = null;

    createBar(total: number) {
        this.bar = new ProgressBar(chalk.green(':bar') + ' :current/:total', { total, width: 30});
    }

    updateBar(increment: number) {
        if (this.bar) {
            this.bar.tick(increment);
        }
    }
}