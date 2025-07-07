import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import {
  automaticDiscountPromotionFactory,
  buyXGetYPromotionFactory,
} from '@scayle/storefront-nuxt/test/factories'
import SFProductPromotionBanner from './SFProductPromotionBanner.vue'

type StoryProps = ComponentPropsAndSlots<typeof SFProductPromotionBanner> & {
  textColor?: string
  backgroundColor?: string
}

/**
 * SFProductPromotionBanner displays promotional messages and offers for products.
 * It supports various promotion types and customizable styling to match different marketing campaigns.
 *
 * Key features:
 * - Support for different promotion types (automatic discounts, buy X get Y)
 * - Customizable colors for text and background
 * - Optional condition text display
 */
export default {
  title: 'Product/SFProductPromotionBanner',
  component: SFProductPromotionBanner,
  argTypes: {
    textColor: {
      control: 'color',
      description:
        'Custom text color for the banner. Use this to ensure readability against the background color.',
    },
    backgroundColor: {
      control: 'color',
      description:
        'Custom background color for the banner. Choose colors that align with your brand and campaign theme.',
    },
  },
  render: (args: StoryProps) => {
    return {
      components: { SFProductPromotionBanner },
      setup() {
        return { args }
      },
      template:
        '<SFProductPromotionBanner v-bind="args" :promotion="{...args.promotion, customData: { ...args.promotion.customData, color: { background: args.backgroundColor, text: args.textColor } } }" />',
    }
  },
}

type Story = StoryObj<typeof SFProductPromotionBanner>

/**
 * Automatic discount promotions show percentage or fixed amount discounts.
 * These are typically used for sales, seasonal offers, or inventory clearance.
 */
export const AutomaticDiscount: Story = {
  args: {
    promotion: automaticDiscountPromotionFactory.build({
      customData: {
        ...automaticDiscountPromotionFactory.build().customData,
        subline:
          'Buy any pair of shoes and receive a free pair of socks. Limited time only!',
        conditions: 'Conditions',
      },
    }),
    showCondition: true,
  },
}

/**
 * Buy X Get Y promotions encourage customers to purchase multiple items
 * by offering a free or discounted item with their purchase.
 */
export const BuyXGetY: Story = {
  args: {
    promotion: buyXGetYPromotionFactory.build({
      name: 'Free Socks Promo',
      customData: {
        ...buyXGetYPromotionFactory.build().customData,
        product: {
          ...buyXGetYPromotionFactory.build().customData.product,
          badgeLabel: 'Get Free Socks',
        },
        headlineParts: ['Buy Shoes, Get Free Socks'],
        conditions:
          'Buy any pair of shoes and receive a free pair of socks. Limited time only!',
      },
    }),
    showCondition: true,
  },
}
