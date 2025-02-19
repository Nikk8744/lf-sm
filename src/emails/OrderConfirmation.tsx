import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import React from "react";

const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  orderItems,
  totalAmount,
  shippingAddress,
  //   orderStatus,
  //   orderDate,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your order!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white p-8 rounded-lg shadow-lg">
            <Heading className="text-2xl font-bold mb-4">
              Order Confirmation
            </Heading>
            <Text>Dear {customerName},</Text>
            <Text>Thank you for your order! Here are your order details:</Text>

            <Section className="mt-4">
              <Heading as="h2" className="text-xl font-semibold">
                Order #{orderNumber}
              </Heading>
            </Section>

            {Array.isArray(orderItems) && orderItems.map((item, index) => (
              <Section key={index} className="mb-4">
                <Row>
                  <Column>
                    {item.image && (
                      <Img
                        src={item.image}
                        width={64}
                        height={64}
                        alt={item.name}
                        className="rounded"
                      />
                    )}
                  </Column>
                  <Column>
                    <Text className="font-semibold">{item.name}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>Price: ${item.unitPrice}</Text>
                    <Text>Total: ${item.totalPrice}</Text>
                  </Column>
                </Row>
              </Section>
            ))}

            <Hr className="my-4" />

            <Section>
              <Text className="font-semibold">Total Amount: ${totalAmount}</Text>
              <Text className="mt-2">Shipping Address:</Text>
              <Text>{shippingAddress}</Text>
            </Section>

            <Section className="mt-8">
              <Text>
                If you have any questions, please don&apos;t hesitate to contact us.
              </Text>
              <Text>Best regards,</Text>
              <Text>Local Farmers Marketplace Team</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;
