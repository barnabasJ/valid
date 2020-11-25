import { and, isInRange, or } from '@src/predicates'
import { reduce } from 'lodash'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'

import {
  validateRecord,
  isValidEmail,
  validateTuple,
  validateList,
  checkFunction,
} from '..'

describe('validateRecord validates a Record according to a RecordValidation', () => {
  it('validates empty object with empty validator', () => {
    expect(validateRecord({})({})).toBeTruthy()
  })

  it('validates valid object', () => {
    expect(
      validateRecord({
        prop1: isString,
        prop2: isNumber,
      })({
        prop1: 'some string',
        prop2: 1,
      })
    ).toBeTruthy()
  })

  it('does not validate an object with different keys', () => {
    expect(
      validateRecord({
        prop: isString,
      })({
        differentKey: 'additional property',
        prop: 'some string',
      })
    ).toBeFalsy()
  })

  it('does not validate an object with a wrong value', () => {
    expect(validateRecord({ prop: isString })({ prop: 1 })).toBeFalsy()
  })
})

describe('validateTuple validates a Tuple according to a TupleValidation', () => {
  it('validate an empty tuple', () => {
    expect(validateTuple([])([])).toBeTruthy()
    expect(validateTuple([])([1])).toBeFalsy()
  })

  it('validate a non empty tuple', () => {
    expect(validateTuple([isNumber, isString])([1, '2'])).toBeTruthy()
    expect(validateTuple([isString, isNumber])([1, '2'])).toBeFalsy()
  })
})

describe('validateList validates a list according to a Predicate', () => {
  it('an empty list is always valid', () => {
    expect(validateList(isNumber)([])).toBeTruthy()
    expect(validateList(isString)([])).toBeTruthy()
  })

  it('all values have to pass the predicate', () => {
    expect(validateList(isNumber)([1, 1])).toBeTruthy()
    expect(validateList(isNumber)([1, '2'])).toBeFalsy()

    expect(validateList(or<string | number>(isNumber, isString))).toBeTruthy()
  })
})

describe('a checked function throws an error if it fails a pre or postcondition', () => {
  const sum = (...args: number[]): number =>
    reduce(args, (acc, n) => acc + n, 0)
  const precondition = validateList(and(isNumber, isInRange(0, 3)))
  const postcondition = isInRange(0, 10)

  it('checks nothing if no conditions are specified', () => {
    expect(checkFunction(sum, {})(1, 4)).toBe(5)
  })

  it('checks the precondition if specified', () => {
    expect(
      checkFunction(sum, {
        precondition,
      })(1, 2)
    ).toBe(3)

    expect(() =>
      checkFunction(sum, {
        precondition,
      })(0, 4)
    ).toThrowErrorMatchingInlineSnapshot(
      `"arguments didn't match the precondition: sum(0, 4)"`
    )
  })

  it('checks the postcondition if specified', () => {
    expect(
      checkFunction(sum, {
        postcondition,
      })(1, 3)
    ).toBe(4)

    expect(() =>
      checkFunction(sum, {
        postcondition,
      })(2, 9)
    ).toThrowErrorMatchingInlineSnapshot(
      `"result didn't match the postcondition: sum(2, 9) => 11"`
    )
  })

  it('checks pre- and postcondition if specified', () => {
    expect(
      checkFunction(sum, {
        precondition,
        postcondition,
      })(1, 3)
    ).toBe(4)

    expect(() =>
      checkFunction(sum, {
        precondition,
        postcondition,
      })(3, 4)
    ).toThrowErrorMatchingInlineSnapshot(
      `"arguments didn't match the precondition: sum(3, 4)"`
    )

    expect(() =>
      checkFunction(sum, {
        precondition,
        postcondition,
      })(3, 3, 3, 3)
    ).toThrowErrorMatchingInlineSnapshot(
      `"result didn't match the postcondition: sum(3, 3, 3, 3) => 12"`
    )
  })
})

describe('isValidEmail', () => {
  it.each([
    ['a@', false],
    ['123@', false],
    ['@', false],
    ['john@doe', false],
    ['john@doe.c', false],
    ['john@doe.1', false],
    ['john@doe.co', true],
    ['john@doe.com', true],
    ['john_doe.123+Übungs@doe.com', true],
    ['john__doe..123++Üübungs@doe.com', true],
    ['john_öé@doe.com', true],
    // john@dömäin.example
    // @see https://de.wikipedia.org/wiki/Internationalisierter_Domainname
    ['john@xn--dmin-moa0i.example', true],
    ['john@d-123.com', true],
    ['john@123.com', true],
    ['john@example.or.at', true],
  ])('validates %s to %s', (input, expected) => {
    expect(isValidEmail(input)).toStrictEqual(expected)
  })
})
