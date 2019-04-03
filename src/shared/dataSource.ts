export type Paginable = { limit: number, offset: number };

export type EntityList<T> = {
    code: 'Success',
    limit: number,
    offset: number,
    totalCount: number,
    data: T[],
};

export type DataSource<TOptions, TEntity> = (options: Paginable & TOptions) =>
    Promise<EntityList<TEntity>>;