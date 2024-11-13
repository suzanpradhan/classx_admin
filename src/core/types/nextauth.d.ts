import { DefaultSession } from 'next-auth';

type StaffType = {
    id: number;
    name: string;
};

interface IUser {
    id: string;
    username?: string | null;
    email?: string | null;
    isStaff?: boolean | null;
    accessToken: string;
    refreshToken: string;
    hotelStaff?: Array<StaffType>;
}

declare module 'next-auth' {
    interface User extends IUser { }

    interface Session extends DefaultSession {
        user?: User;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends IUser { }
}
