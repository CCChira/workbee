export interface ISearch {
    field: string;
    searchParam: string;
}
export declare class Search {
    field: string;
    searchParam: string;
}
export declare const SearchDecorator: (...dataOrPipes: any[]) => ParameterDecorator;
export declare function SearchApiQuery(): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
