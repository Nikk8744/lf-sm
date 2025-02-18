import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
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
      <Preview>Your Farm Mart Order Confirmation #{orderNumber}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4">
            <Heading className="text-2xl font-bold text-center text-gray-800 mb-8">
              Order Confirmation
            </Heading>

            <Text className="text-gray-700 mb-4">Hi {customerName},</Text>

            <Text className="text-gray-700 mb-6">
              Thank you for your order! We&apos;re pleased to confirm that your
              order #{orderNumber} has been received.
            </Text>

            <Section className="bg-gray-50 rounded-lg p-6 mb-6">
              <Heading className="text-xl font-semibold mb-4">
                Order Details
              </Heading>

              {orderItems.map((item, index) => (
                <Section key={index} className="mb-4">
                  <Row>
                    <Column>
                      <Text className="font-medium">{item.name}</Text>
                      <Text className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ${item.unitPrice}
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text className="font-bold">${item.totalPrice}</Text>
                    </Column>
                  </Row>
                  {index < orderItems.length - 1 && <Hr className="my-4" />}
                </Section>
              ))}

              <Hr className="my-6" />
              <Row>
                <Column>
                  <Text className="font-bold">Total Amount:</Text>
                </Column>
                <Column align="right">
                  <Text className="font-bold text-lg">${totalAmount}</Text>
                </Column>
              </Row>
            </Section>

            <Section className="mb-8">
              <Heading className="text-xl font-semibold mb-2">
                Shipping Address
              </Heading>
              <Text className="text-gray-700">
                {shippingAddress}
              </Text>
            </Section>
            
            <Hr className="my-6" />

            <Text className="text-sm text-gray-600 text-center">
              If you have any questions about your order, please contact our support team.
            </Text>

            <Text className="text-sm text-gray-500 text-center mt-6">
              © {new Date().getFullYear()} Farm Mart. All rights reserved.
            </Text>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;
