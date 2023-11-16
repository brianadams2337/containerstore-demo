const defaultClasses: Record<string, string> = {
  google:
    'bg-google-normal text-white hover:bg-google-hover focus:bg-google-hover',
  facebook:
    'bg-facebook-normal text-white hover:bg-facebook-hover focus:bg-facebook-hover',
  keycloak:
    'bg-keycloak-normal text-white hover:bg-keycloak-hover focus:bg-keycloak-hover',
  apple: 'bg-apple-normal text-white hover:bg-apple-hover focus:bg-apple-hover',
  okta: 'bg-okta-normal text-white hover:bg-okta-hover focus:bg-okta-hover',
  idp: 'bg-idp-normal text-white hover:bg-idp-hover focus:bg-idp-hover',
}
export function useStyledIDPButtons(classes?: Record<string, string>) {
  const idpClasses = { ...defaultClasses, ...classes }

  const getIDPButtonClass = (idp: keyof typeof idpClasses) =>
    idpClasses[idp] || ''

  return {
    getIDPButtonClass,
  }
}
