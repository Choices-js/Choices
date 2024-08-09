/**
 * Helpers to create HTML elements used by Choices
 * Can be overridden by providing `callbackOnCreateTemplates` option.
 * `Choices.defaults.templates` allows access to the default template methods from `callbackOnCreateTemplates`
 */
import { StringPreEscaped } from './interfaces/string-pre-escaped';
import { StringUntrusted } from './interfaces/string-untrusted';
import { Templates as TemplatesInterface } from './interfaces/templates';
export declare const escapeForTemplate: (allowHTML: boolean, s: StringUntrusted | StringPreEscaped | string) => string;
declare const templates: TemplatesInterface;
export default templates;
