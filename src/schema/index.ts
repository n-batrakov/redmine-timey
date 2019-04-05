export type JsonSchema = {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array',
    properties?: { [name: string]: JsonSchema },
    items?: JsonSchema,
    format?: string,
    required?: string[],
};

export default {
    string: () => ({ type: 'string' }) as JsonSchema,
    float: () => ({ type: 'number' }) as JsonSchema,
    date: () => ({ type: 'string', format: 'date' }) as JsonSchema,
    dateTime: () => ({ type: 'string', format: 'date-time' }) as JsonSchema,
    boolean: () => ({ type: 'boolean' }),

    object: (properties: { [name: string]: JsonSchema}, options?: { required?: string[] }): JsonSchema => {
        return { properties, ...options, type: 'object' };
    },

    array: (items: JsonSchema): JsonSchema => {
        return { items, type: 'array' };
    },

    required: (...required: string[]) => ({ required }),
};