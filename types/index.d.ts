export default anchor;
declare function anchor(md: any, opts: any): void;
declare namespace anchor {
    namespace defaults {
        export const level: number;
        export { slugify };
        export const uniqueSlugStartIndex: number;
        export const permalink: boolean;
        export { renderPermalink };
        export const permalinkClass: string;
        export const permalinkSpace: boolean;
        export const permalinkSymbol: string;
        export const permalinkBefore: boolean;
        export { permalinkHref };
        export { permalinkAttrs };
    }
}
declare function slugify(s: any): string;
declare function renderPermalink(slug: any, opts: any, state: any, idx: any): void;
declare function permalinkHref(slug: any): string;
declare function permalinkAttrs(slug: any): {};
