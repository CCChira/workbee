import { Role } from '@prisma/client';
export declare const AuthDecorators: (roles: Role[]) => <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
