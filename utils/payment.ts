import IconPaymentLastscrift from '@/assets/icons/payment/lastschrift.svg'
import IconPaymentVisa from '@/assets/icons/payment/visa.svg'
import IconPaymentMastercard from '@/assets/icons/payment/mastercard.svg'
import IconPaymentDiscover from '@/assets/icons/payment/discover.svg'
import IconPaymentDinersclub from '@/assets/icons/payment/dinersclub.svg'
import IconPaymentRatepay from '@/assets/icons/payment/ratepay.svg'
import IconPaymentKlarna from '@/assets/icons/payment/klarna.svg'
import IconPaymentPaypal from '@/assets/icons/payment/paypal.svg'

export type PaymentIcon = {
  component: any
  width: number
}

export type PaymentIconsMap = { [key: string]: PaymentIcon }

const paymentIconsMap: PaymentIconsMap = {
  ratepay_directdebit: {
    component: IconPaymentLastscrift,
    width: 20,
  },
  computop_creditcard_visa: {
    component: IconPaymentVisa,
    width: 10,
  },
  computop_creditcard_mastercard: {
    component: IconPaymentMastercard,
    width: 10,
  },
  computop_creditcard_discover: {
    component: IconPaymentDiscover,
    width: 20,
  },
  computop_creditcard_dinersclub: {
    component: IconPaymentDinersclub,
    width: 20,
  },
  ratepay_invoice: {
    component: IconPaymentRatepay,
    width: 20,
  },
  klarna_paylater: {
    component: IconPaymentKlarna,
    width: 20,
  },
  paypal_instant: {
    component: IconPaymentPaypal,
    width: 20,
  },
}

export const paidWithIcon = (paidWith: string) =>
  paymentIconsMap[paidWith] ?? null
