import { clsx, type ClassValue } from 'clsx'
import { isPossiblePhoneNumber, parsePhoneNumberWithError } from 'libphonenumber-js'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const validatePhoneNum = (number: string) => {
  try {
    const parsedNumber = parsePhoneNumberWithError(number, 'CA')

    if (!parsedNumber) {
      return { isValid: false, isPossible: false, formatted: null, error: 'Invalid number format' }
    }

    return {
      isValid: true,
      isPossible: isPossiblePhoneNumber(number, 'CA'),
      formatted: parsedNumber,
    }
    // Going to catch this error and let it bubbble up, let the caller handle it by checking isValid
    // Frankly, I have no fucking clue if this is a good idea but I kinda like it
    // const res = validatePhoneNum(newPhoneNum)
    //       if (!res.isValid) {
    //         toast.error('Please enter valid phone number')
    //         return
    //       }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (error) {
    return { isValid: false, isPossible: false, formatted: null, error: 'Invalid phone number' }
  }
}
