/**
 * PayPal Configuration
 * Business Account: carl@keepyourcontracts.com
 */

export const PAYPAL_EMAIL = "carl@keepyourcontracts.com";

// Individual Coaching Subscription Plans
export const PAYPAL_SUBSCRIPTIONS = {
  starter: {
    name: "Starter Package",
    price: 99,
    description: "Essential emotional resilience tracking for individuals",
    // PayPal subscription button ID (to be created in PayPal dashboard)
    buttonId: "", // User needs to create this in PayPal
  },
  professional: {
    name: "Professional Package",
    price: 199,
    description: "Advanced coaching with AI insights and priority support",
    buttonId: "", // User needs to create this in PayPal
  },
  premium: {
    name: "Premium Package",
    price: 299,
    description: "Comprehensive coaching with unlimited sessions",
    buttonId: "", // User needs to create this in PayPal
  },
};

// Enterprise one-time payment
export const PAYPAL_ENTERPRISE = {
  email: PAYPAL_EMAIL,
  currency: "USD",
};

/**
 * Generate PayPal subscription URL
 */
export function getPayPalSubscriptionUrl(plan: keyof typeof PAYPAL_SUBSCRIPTIONS): string {
  const subscription = PAYPAL_SUBSCRIPTIONS[plan];
  if (subscription.buttonId) {
    return `https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=${subscription.buttonId}`;
  }
  
  // Fallback to manual payment link
  return `https://www.paypal.com/paypalme/${PAYPAL_EMAIL.split('@')[0]}/${subscription.price}`;
}

/**
 * Generate PayPal buy now URL for enterprise
 */
export function getPayPalBuyNowUrl(amount: number, description: string): string {
  const params = new URLSearchParams({
    cmd: "_xclick",
    business: PAYPAL_EMAIL,
    item_name: description,
    amount: amount.toString(),
    currency_code: "USD",
    return: window.location.origin + "/payment/success",
    cancel_return: window.location.origin + "/payment/cancel",
  });
  
  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
}
