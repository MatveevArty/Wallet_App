export class FileUtils {
    public static loadPageScript(src: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const script: HTMLScriptElement = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve('Script loaded: ' + src);
            };
            script.onerror = () => reject(new Error('Script error for: ' + src));
            document.body.appendChild(script);
        })
    }
}