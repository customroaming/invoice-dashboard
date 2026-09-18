import path from "path";

import { Client, Invoice, InvoiceItem } from "@/types";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "PlayfairDisplay",
  fonts: [
    {
      src: path.join(
        process.cwd(),
        "public",
        "fonts",
        "PlayfairDisplay-Regular.ttf",
      ),
      fontWeight: "normal",
    },
    {
      src: path.join(
        process.cwd(),
        "public",
        "fonts",
        "PlayfairDisplay-Bold.ttf",
      ),
      fontWeight: "bold",
    },
    {
      src: path.join(
        process.cwd(),
        "public",
        "fonts",
        "PlayfairDisplay-Italic.ttf",
      ),
      fontWeight: "normal",
      fontStyle: "italic",
    },
  ],
});

Font.register({
  family: "Manrope",
  fonts: [
    {
      src: path.join(process.cwd(), "public", "fonts", "Manrope-Regular.ttf"),
      fontWeight: "normal",
    },
    {
      src: path.join(process.cwd(), "public", "fonts", "Manrope-Bold.ttf"),
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Manrope",
    flexDirection: "column",
    gap: 32,
    letterSpacing: -0.5,
  },
  bold: {
    fontWeight: "bold",
  },
  column: {
    flexDirection: "column",
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "black",
  },
  gapLg: {
    gap: 32,
  },
  gapMd: {
    gap: 16,
  },
  gapSm: {
    gap: 8,
  },

  heading: {
    fontSize: 32,
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  reference: {
    fontSize: 12,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  strapline: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  solira: {
    fontFamily: "PlayfairDisplay",
    fontSize: 20,
    fontStyle: "italic",
  },
  p: {
    fontSize: 12,
    letterSpacing: 0,
  },
  textRight: {
    textAlign: "right",
  },
});

type InvoicePDFProps = {
  invoice: Invoice;
  client: Client;
  invoiceItems: InvoiceItem[];
};

export default function InvoicePDF({
  invoice,
  client,
  invoiceItems,
}: InvoicePDFProps) {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={[styles.column, styles.gapSm]}>
          <Text style={styles.heading}>INVOICE #{invoice.dateId}</Text>
          <Text style={styles.solira}>Solira</Text>
        </View>
        <View style={[styles.row, styles.justifyBetween]}>
          <View style={[styles.column, styles.gapMd]}>
            <Text style={styles.subheading}>BILL TO</Text>
            <View style={[styles.column, styles.p]}>
              <Text style={styles.bold}>{client.name}</Text>
              <Text>{client.address}</Text>
            </View>
          </View>
          <View>
            <View style={[styles.column, styles.gapMd]}>
              <Text style={styles.subheading}>FROM</Text>
              <View style={[styles.column, styles.p]}>
                <View style={[styles.row, styles.gapSm]}>
                  <Text style={styles.bold}>Invoice Date:</Text>
                  <Text>{invoice.createdAt?.toLocaleDateString("en-GB")}</Text>
                </View>
                <View style={[styles.row, styles.gapSm]}>
                  <Text style={styles.bold}>Email:</Text>
                  <Text>wharper2000@gmail.com</Text>
                </View>
                <View style={[styles.row, styles.gapSm]}>
                  <Text style={styles.bold}>Phone:</Text>
                  <Text>07944233514</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={[styles.column, styles.gapMd]}>
          <View style={[styles.row, styles.justifyBetween]}>
            <View style={[styles.column, styles.gapMd]}>
              <Text style={styles.subheading}>DESCRIPTION</Text>
            </View>
            <View>
              <View style={[styles.column, styles.gapMd]}>
                <Text style={styles.subheading}>AMOUNT</Text>
              </View>
            </View>
          </View>
          <View style={[styles.column, styles.gapSm, styles.p]}>
            {invoiceItems.map((item) => (
              <View key={item.id} style={[styles.row, styles.justifyBetween]}>
                <View style={[styles.column, styles.gapSm]}>
                  <Text>{item.description}</Text>
                </View>
                <Text style={styles.bold}>£{item.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={[styles.row, styles.justifyBetween]}>
          <View style={[styles.column, styles.gapMd]}>
            <Text style={styles.subheading}>TOTAL AMOUNT DUE</Text>
          </View>
          <View>
            <View style={[styles.column, styles.gapMd]}>
              <Text style={[styles.bold, styles.textRight]}>
                £
                {invoiceItems
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={[styles.column, styles.gapMd]}>
          <Text style={styles.subheading}>TERMS AND CONDITIONS</Text>
          <View style={[styles.column, styles.p]}>
            <Text>Payment is due within 15 days of receipt.</Text>
            <Text>Payment by bank transfer to the following account:</Text>
            <Text>Account holder: William Harper</Text>
            <Text>Sort code: 04-00-05</Text>
            <Text>Account number: 32978966</Text>
            <Text>Reference: {invoice.dateId}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
