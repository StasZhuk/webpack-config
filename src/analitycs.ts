function createAnalytics(): Object {
    let counter: number = 0;
    let isDestroyed: boolean = false;

    const listener = () => counter++;

    document.addEventListener('click', listener);

    return {
        destroy(): void {
            isDestroyed = true;
            return document.removeEventListener('click', listener);
        },
        getClicks(): string | number {
            if (isDestroyed) return 'Analytics is destroyed';
            else return counter;
        }
    };
}

window['analytics'] = createAnalytics();
