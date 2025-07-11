export class FileUtils {
    static loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve('Script loaded: ' + src);
            };
            script.onerror = () => reject(new Error('Script error for: ' + src));  // можно укоротить запись
            document.body.appendChild(script);
        })
    }

    static loadPageStyle(src, insertBeforeElement) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = src;
        link.type = 'text/css';
        document.head.insertBefore(link, insertBeforeElement);
    }
}