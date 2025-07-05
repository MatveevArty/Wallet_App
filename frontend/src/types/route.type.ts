export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string,
    load(): void,
    unload?(): void,
    scripts?: string[]
}