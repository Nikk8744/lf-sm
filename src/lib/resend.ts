import OrderConfirmationEmail from "@/emails/OrderConfirmation";
// import { render } from "@react-email/components";
import { Resend } from "resend";
import { SendOrderConfirmationEmailParams, SendSubscriptionConfirmationEmailParams } from "../../types";
import SubscriptionConfirmationEmail from "@/emails/SubscriptionConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);
const VERIFIED_EMAIL = process.env.VERIFIED_EMAIL;

export const sendOrderConfirmationEmail = async ({
    to,
    orderNumber,
    customerName,
    orderItems,
    totalAmount,
    shippingAddress,
}: SendOrderConfirmationEmailParams) => {
    try {
        const testTo = process.env.NODE_ENV === 'production' ? to : VERIFIED_EMAIL as string;
        // const emailStructure = render(
        //     OrderConfirmationEmail({
        //         orderNumber,
        //         customerName,
        //         orderItems,
        //         totalAmount,
        //         shippingAddress,
        //     })
        // )

        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [testTo],
            subject: `Order Confirmation #${orderNumber}`,
            // react: emailStructure,
            react: OrderConfirmationEmail({
                orderNumber,
                customerName,
                orderItems,
                totalAmount,
                shippingAddress,
            }),
        });

        return { success: true, data };
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
        return { success: false, error };
    }
}

export const sendSubscriptionConfirmationEmail = async ({
    to,
    customerName,
    planName,
    price,
    interval,
    deliverySchedule,
  }: SendSubscriptionConfirmationEmailParams) => {
    try {
      const testTo = process.env.NODE_ENV === 'production' ? to : VERIFIED_EMAIL as string;
  
      const data = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [testTo],
        subject: `Subscription Confirmation - ${planName} Plan`,
        react: SubscriptionConfirmationEmail({
          customerName,
          planName,
          price,
          interval,
          deliverySchedule,
        }),
      });
  
      return { success: true, data };
    } catch (error) {
      console.error('Failed to send subscription confirmation email:', error);
      return { success: false, error };
    }
  };