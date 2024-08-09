import { State } from './state';
import { ChoiceFull } from './choice-full';
import { GroupFull } from './group-full';
export interface Store {
    startDeferRendering(): void;
    stopDeferRendering(): void;
    withDeferRendering(func: () => void): void;
    /**
     * Get store object (wrapping Redux method)
     */
    get state(): State;
    /**
     * Get items from store
     */
    get items(): ChoiceFull[];
    /**
     * Get highlighted items from store
     */
    get highlightedActiveItems(): ChoiceFull[];
    /**
     * Get choices from store
     */
    get choices(): ChoiceFull[];
    /**
     * Get active choices from store
     */
    get activeChoices(): ChoiceFull[];
    /**
     * Get choices that can be searched (excluding placeholders)
     */
    get searchableChoices(): ChoiceFull[];
    /**
     * Get placeholder choice from store
     */
    get placeholderChoice(): ChoiceFull | undefined;
    /**
     * Get groups from store
     */
    get groups(): GroupFull[];
    /**
     * Get active groups from store
     */
    get activeGroups(): GroupFull[];
    /**
     * Get loading state from store
     */
    isLoading(): boolean;
    /**
     * Get single choice by it's ID
     */
    getChoiceById(id: number): ChoiceFull | undefined;
    /**
     * Get group by group id
     */
    getGroupById(id: number): GroupFull | undefined;
}
