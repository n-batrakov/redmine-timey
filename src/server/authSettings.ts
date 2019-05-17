export const secret: string | Buffer = 'FYjhtS08RVz58587NDdOJwm0TzVAYLKYPs7yEuZLcRkDN2AiQiuX6E0F9R3FRjcbaktrRAiHQi55S1UiAD0sFnv6DeS1Vtkbs7nbBO30P98NvfZ9HsCieG931HLcVfL6';

import { SignOptions } from 'jsonwebtoken';
export const tokenSignOptions: SignOptions = {

};

type CookiesOptions = {
    domain?: string;
    encode?(val: string): string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | 'lax' | 'strict';
    secure?: boolean;
};
export const cookieName: string = '.timey';
export const cookieOptions: CookiesOptions = {
    path: '/',
    httpOnly: true,
};