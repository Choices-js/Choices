import { InputChoice } from '../interfaces/input-choice';
import { InputGroup } from '../interfaces/input-group';
import { GroupFull } from '../interfaces/group-full';
import { ChoiceFull } from '../interfaces/choice-full';
type MappedInputTypeToChoiceType<T extends string | InputChoice | InputGroup> = T extends InputGroup ? GroupFull : ChoiceFull;
export declare const coerceBool: (arg: unknown, defaultValue?: boolean) => boolean;
export declare const stringToHtmlClass: (input: string | string[] | undefined) => string[] | undefined;
export declare const mapInputToChoice: <T extends string | InputChoice | InputGroup>(value: T, allowGroup: boolean, allowRawString?: boolean) => MappedInputTypeToChoiceType<T>;
export {};
