import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
  } from "@react-email/components";
  import React from "react";
  
  interface SubscriptionConfirmationEmailProps {
    customerName: string;
    planName: string;
    price: string;
    interval: string;
    deliverySchedule: {
      preferredDay: string;
      preferredTime: string;
      address: string;
      instructions?: string;
    };
  }
  
  const SubscriptionConfirmationEmail = ({
    customerName,
    planName,
    price,
    interval,
    deliverySchedule,
  }: SubscriptionConfirmationEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Your subscription has been confirmed!</Preview>
        <Body style={main}>
          <Container>
            <Section>
              <Heading>Subscription Confirmation</Heading>
              <Text>Dear {customerName},</Text>
              <Text>
                Thank you for subscribing to our {planName} plan! Your subscription has been
                successfully activated.
              </Text>
              
              <Section style={details}>
                <Heading as="h2" style={subheading}>Subscription Details</Heading>
                <Text>Plan: {planName}</Text>
                <Text>Price: ${price}/{interval}</Text>
              </Section>
  
              <Section style={details}>
                <Heading as="h2" style={subheading}>Delivery Schedule</Heading>
                <Text>Day: {deliverySchedule.preferredDay}</Text>
                <Text>Time: {deliverySchedule.preferredTime}</Text>
                <Text>Address: {deliverySchedule.address}</Text>
                {deliverySchedule.instructions && (
                  <Text>Special Instructions: {deliverySchedule.instructions}</Text>
                )}
              </Section>
  
              <Text style={footer}>
                If you have any questions about your subscription, please don&apos;t hesitate to contact us.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const details = {
    margin: "24px 0",
    padding: "16px",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  };
  
  const subheading = {
    fontSize: "16px",
    margin: "16px 0 8px",
  };
  
  const footer = {
    color: "#666666",
    marginTop: "32px",
  };
  
  export default SubscriptionConfirmationEmail;