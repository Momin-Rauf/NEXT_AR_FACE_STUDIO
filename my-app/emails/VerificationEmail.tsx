import * as React from 'react';
import { Html, Head, Body, Container, Text } from "@react-email/components";


interface VerificationEmailProps {
  username: string;
  otp:string;
}

export function VerificationEmail({ username, otp }:VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.greeting}>Hello {username},</Text>
          <Text style={styles.message}>
            Thank you for signing up! Use the OTP below to verify your account.
          </Text>
          <Text style={styles.otp}>Your OTP: <strong>{otp}</strong></Text>
          <Text style={styles.footer}>
            If you didn’t request this, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    color: "#333"
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
  },
  greeting: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  message: {
    fontSize: "16px",
    marginBottom: "10px"
  },
  otp: {
    fontSize: "22px",
    color: "#4caf50",
    marginBottom: "20px"
  },
  footer: {
    fontSize: "12px",
    color: "#888",
    marginTop: "20px",
    textAlign: "center"
  }
};

export default VerificationEmail;
