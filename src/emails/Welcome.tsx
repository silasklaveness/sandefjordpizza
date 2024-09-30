import {
  Button,
  Container,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

type WelcomeProps = {
  firstName: string;
  success_url: string;
  amount_total: number;
  amount_subtotal: number;
};

export default function Welcome({
  firstName,
  success_url,
  amount_subtotal,
  amount_total,
}: WelcomeProps) {
  const formatPrice = (amount: number) => {
    return (amount / 100).toFixed(2) + " NOK";
  };

  return (
    <Html>
      <Container style={containerStyle}>
        <Section style={headerStyle}>
          <Img
            src="https://www.oceanedge.no/_next/image?url=%2Flogo.png&w=128&q=75"
            alt="Sandefjord Pizza Logo"
            width="100"
            height="100"
          />
        </Section>

        <Section style={greetingStyle}>
          <Heading style={headingStyle}>
            Takk for din bestilling, {firstName}!
          </Heading>
          <Text style={textStyle}>
            Orderen din er mottatt og blir prosessert.
          </Text>
        </Section>

        <Hr style={hrStyle} />

        <Section style={summarySectionStyle}>
          <Heading as="h2" style={subHeadingStyle}>
            Ordresammendrag
          </Heading>
          <table
            style={tableStyle}
            cellPadding="0"
            cellSpacing="0"
            width="100%"
          >
            <tbody>
              <tr>
                <td style={tableCellStyle}>Subtotal:</td>
                <td style={tableCellStyle}>{formatPrice(amount_subtotal)}</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Levering:</td>
                <td style={tableCellStyle}>
                  {formatPrice(amount_total - amount_subtotal)}
                </td>
              </tr>
              <tr>
                <td style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  Total:
                </td>
                <td style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  {formatPrice(amount_total)}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section style={ctaSectionStyle}>
          <Button href={success_url} style={buttonStyle}>
            Se Din Ordre
          </Button>
        </Section>

        <Hr style={hrStyle} />

        <Section style={footerStyle}>
          <Text style={footerTextStyle}>
            Har du spørsmål? Kontakt{" "}
            <Link href="mailto:support@sandefjordpizza.com" style={linkStyle}>
              support@sandefjordpizza.com
            </Link>
            .
          </Text>
          <Text style={footerTextStyle}>
            Følg oss på{" "}
            <Link href="https://facebook.com/sandefjordpizza" style={linkStyle}>
              Facebook
            </Link>{" "}
            og{" "}
            <Link
              href="https://instagram.com/sandefjordpizza"
              style={linkStyle}
            >
              Instagram
            </Link>
            .
          </Text>
          <Text style={footerTextStyle}>
            © {new Date().getFullYear()} Sandefjord Pizza. Alle rettigheter
            reservert.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

const containerStyle: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  color: "#ffffff",
};

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  paddingBottom: "20px",
};

const greetingStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "0 20px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "28px",
  marginBottom: "10px",
  color: "#ffd700",
};

const textStyle: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.5",
};

const hrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #333333",
  margin: "20px 0",
};

const summarySectionStyle: React.CSSProperties = {
  padding: "0 20px",
};

const subHeadingStyle: React.CSSProperties = {
  fontSize: "22px",
  marginBottom: "10px",
  color: "#ffd700",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableCellStyle: React.CSSProperties = {
  padding: "8px 0",
  fontSize: "16px",
  borderBottom: "1px solid #333333",
};

const ctaSectionStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "20px 0",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#ffd700",
  color: "#1a1a1a",
  padding: "12px 24px",
  textDecoration: "none",
  borderRadius: "4px",
  fontSize: "16px",
  fontWeight: "bold",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "20px",
  fontSize: "12px",
  color: "#999999",
};

const footerTextStyle: React.CSSProperties = {
  margin: "5px 0",
};

const linkStyle: React.CSSProperties = {
  color: "#ffd700",
  textDecoration: "none",
};
