type FormatType = Record<
  string,
  { placeholder: string; mask: string | string[] }
>

export const phoneNumberFormats: FormatType = {
  de_DE: { mask: '+## #### ######', placeholder: '+49 **** ******' },
  de_AT: { mask: '+## ## ### ## ##', placeholder: '+41 ** *** ** **' },
  de_CH: { mask: '+## # ### ## ##', placeholder: '+43 * *** ** **' },
  fr_CH: { mask: '+## ## ########', placeholder: '+31 ** ********' },
  fr_BE: { mask: '+## ### ## ##', placeholder: '+32 *** ** **' },
  nl_BE: { mask: '+## ### ## ##', placeholder: '+32 *** ** **' },
  nl_NL: { mask: '+## ## ########', placeholder: '+31 ** ********' },
}
export const dateOfBirthFormats: FormatType = {
  de_DE: { mask: '##.##.####', placeholder: 'dd.mm.yyyy' },
  de_AT: { mask: '##.##.####', placeholder: 'dd.mm.yyyy' },
  de_CH: { mask: '##.##.####', placeholder: 'dd.mm.yyyy' },
  fr_CH: { mask: '##.##.####', placeholder: 'dd.mm.yyyy' },
  fr_BE: { mask: '##/##/####', placeholder: 'dd/mm/yyyy' },
  nl_BE: { mask: '##/##/####', placeholder: 'dd/mm/yyyy' },
  nl_NL: { mask: '##/##/####', placeholder: 'dd.mm.yyyy' },
}
