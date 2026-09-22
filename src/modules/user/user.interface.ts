export interface IUserFilterableFields {
    searchTerm?: string | undefined;
    role?: string | undefined;
    status?: string | undefined;
}

export interface IUserUpdate {
    name?: string;
    image?: string;
    phone?: string;
    role?: 'ADMIN' | 'USER';
    status?: 'ACTIVE' | 'INACTIVE';
}
