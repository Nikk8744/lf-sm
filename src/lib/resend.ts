import OrderConfirmationEmail from "@/emails/OrderConfirmation";
import { render } from "@react-email/components";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async ({
    to,
    orderNumber,
    customerName,
    orderItems,
    totalAmount,
    shippingAddress,
}: SendOrderConfirmationEmailParams) => {
    try {

        const emailStructure = render(
            OrderConfirmationEmail({
                orderNumber,
                customerName,
                orderItems,
                totalAmount,
                shippingAddress,
            })
        )

        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [to],
            subject: `Order Confirmation #${orderNumber}`,
            react: emailStructure,
        });

        return { success: true, data };
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
    return { success: false, error };
    }
}