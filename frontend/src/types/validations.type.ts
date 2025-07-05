export type ValidationsType = {
    element: HTMLInputElement | null;
    options?: ValidationOptionsType,
}

export type ValidationOptionsType = {
    pattern?: RegExp,
    compareTo?: string,
}