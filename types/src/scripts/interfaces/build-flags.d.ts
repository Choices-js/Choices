export declare const canUseDom: boolean;
export declare const searchFuse: string | undefined;
export declare const searchKMP: boolean;
/**
 * These are not directly used, as an exported object (even as const) will prevent tree-shake away code paths
 */
export declare const BuildFlags: {
    readonly searchFuse: string | undefined;
    readonly searchKMP: boolean;
    readonly canUseDom: boolean;
};
