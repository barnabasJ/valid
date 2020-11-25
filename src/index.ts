import get from 'lodash/get'
import every from 'lodash/every'
import keys from 'lodash/keys'
import difference from 'lodash/difference'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import join from 'lodash/join'

import { and, isInRange, Predicate } from '@src/predicates'

export * from '@src/predicates'

export type RecordValidation = Record<string | number, (x: any) => boolean>

export const validateRecord = <T extends any>(validation: RecordValidation) => (
  object: Record<string, any>
): object is T => {
  const differentKeys = difference(keys(object), keys(validation))
  return !isEmpty(differentKeys)
    ? false
    : every(validation, (validator, key) => validator(get(object, key)))
}

type Counter = {
  count: number
}

export const validateCounter = validateRecord<Counter>({
  count: and(isNumber, isInRange(0, Number.MAX_SAFE_INTEGER)),
})

export type TupleValidation = Predicate<any>[]

export const validateTuple = <T extends any[]>(
  tupleValidation: Predicate<any>[]
) => (tuple: any[]): tuple is T =>
  tupleValidation.length === tuple.length &&
  every(tupleValidation, (predicate, key) => predicate(get(tuple, key)))

type NumberStringTuple = [number, string]

export const validateNumberStringTuple = validateTuple<NumberStringTuple>([
  isNumber,
  isString,
])

export const validateList = <T extends any>(predicate: Predicate<T>) => (
  list: any[]
): list is T[] => every(list, (item) => predicate(item))

export const validateRangeArray = validateList(isNumber)

export const checkFunction = <A extends any[], R extends any>(
  fn: (...args: A) => R,
  checks: {
    precondition?:
      | ReturnType<typeof validateTuple>
      | ReturnType<typeof validateList>
    postcondition?: R extends any[]
      ? ReturnType<typeof validateList> | ReturnType<typeof validateTuple>
      : R extends Record<any, string>
      ? ReturnType<typeof validateRecord>
      : Predicate<any>
  }
) => (...args: A): R => {
  if (!checks.precondition || checks.precondition(args)) {
    const result = fn(...args)
    if (!checks.postcondition || checks.postcondition(result)) return result

    throw new Error(
      `result didn't match the postcondition: ${
        fn.name + '(' + join(args, ', ') + ') => ' + JSON.stringify(result)
      }`
    )
  }
  throw new Error(
    `arguments didn't match the precondition: ${
      fn.name + '(' + join(args, ', ') + ')'
    }`
  )
}
