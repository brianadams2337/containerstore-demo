const defaultClasses: Record<string, string> = {
  google: 'bg-[#4285F4] text-white hover:bg-[#3869c1] focus:bg-[#3869c1]',
  facebook: 'bg-[#1877F2] text-white hover:bg-[#165dbb] focus:bg-[#165dbb]',
  keycloak: 'bg-[#C43A31] text-white hover:bg-[#a32b26] focus:bg-[#a32b26]',
  apple: 'bg-black text-white hover:bg-[#333333] focus:bg-[#333333]',
  okta: 'bg-[#0061F2] text-white hover:bg-[#004ecb] focus:bg-[#004ecb]',
  idp: 'bg-[#008aaa] text-white hover:bg-[#006788] focus:bg-[#006788]',
}
export function useStyledIDPButtons(classes?: Record<string, string>) {
  const idpClasses = { ...defaultClasses, ...classes }

  const getIDPButtonClass = (idp: keyof typeof idpClasses) =>
    idpClasses[idp] || ''

  return {
    getIDPButtonClass,
  }
}
