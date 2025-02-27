export declare const canUseDom: boolean;
export declare const searchFuse: string | undefined;
export declare const searchKMP: string | undefined;
/**
 * These are not directly used, as an exported object (even as const) will prevent tree-shake away code paths
 */
export declare const BuildFlags: {
    readonly searchFuse: string | undefined;
    readonly searchKMP: string | undefined;
    readonly canUseDom: boolean;
};
