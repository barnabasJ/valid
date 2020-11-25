import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'

import { validateRecord, isValidEmail } from '..'

describe('validate validates an object according to a validation object', () => {
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
