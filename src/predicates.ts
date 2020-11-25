import isNumber from 'lodash/isNumber'
import isInteger from 'lodash/isInteger'
import every from 'lodash/every'
import some from 'lodash/some'

export type Predicate<T extends any> = (x: any) => x is T

export const and = <T extends any>(...predicates: Predicate<T>[]) => (x: any) =>
  every(predicates, (predicate) => predicate(x))

export const or = (...validators: Array<(x: any) => boolean>) => (x: any) =>
  some(validators, (validator) => validator(x))

export const isFloat = (x: any): x is number => isNumber(x) && !isInteger(x)

export const isInRange = (min: number, max: number) => (
  value: number
): value is number => value >= min && value <= max

export const EMAIL_PATTERN = /^([\w\d_\-.+À-úÄ-ü])+@([\w\d_\-.À-úÄ-ü])+\.([A-Za-z]{2,})$/

/**
 * Use isValidEmail to check if a string represents a valid* email address.
 *
 * inspired by:
 * @see https://stackoverflow.com/a/7635612/1238150
 *
 * This complex RegEx does not work as a pattern for an `<input />`
 * @see https://emailregex.com/
 *
 * Docs:
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
 *
 * valid alternatives:
 * @see https://stackoverflow.com/a/18964976/1238150
 * @see https://stackoverflow.com/a/46841861/1238150
 * @see https://stackoverflow.com/a/58500991/1238150
 * @see https://stackoverflow.com/a/50326664/1238150
 *
 * example:
 * @see https://regex101.com/r/76zxAM/4/
 * @see https://codepen.io/natterstefan/pen/mdPEQqL
 *
 * (* no support for local domain names (https://stackoverflow.com/a/20573649/1238150))
 */
export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email)
