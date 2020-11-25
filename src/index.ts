import get from 'lodash/get'
import every from 'lodash/every'
import keys from 'lodash/keys'
import difference from 'lodash/difference'
import isEmpty from 'lodash/isEmpty'
import { isNumber } from 'lodash'

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

export const validateList = <T extends any>(predicate: Predicate<T>) => (
  list: any[]
): list is T[] => every(list, (item) => predicate(item))

export const validateRangeArray = validateList(isNumber)
