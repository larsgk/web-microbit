// @ts-check
class _ServiceWorkerReg extends EventTarget {
    register() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').then(reg => {
                let isRefreshing;
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('controllerchange');
                    if (isRefreshing) return;
                    this.dispatchEvent(new CustomEvent('update-available'));
                    isRefreshing = true;
                });
            });       
        }        
    }    
}

export const ServiceWorkerReg = new _ServiceWorkerReg();

