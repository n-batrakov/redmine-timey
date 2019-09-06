export function getFormData<T = any>(formElement: HTMLFormElement): T {
    const formData = new FormData(formElement);
    const form: any = {};
    formData.forEach((x, key) => {
        const value = form[key];
        if (value === undefined) {
            form[key] = x;
        } else if (Array.isArray(value)) {
            form[key] = [...value, x];
        } else {
            form[key] = [value, x];
        }
    });

    return form;
}