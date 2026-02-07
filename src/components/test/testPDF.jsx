import React from "react";
import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
});

const TestPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>PDF TEST SUCCESS 🎉</Text>
      <Text>This PDF was generated using @react-pdf/renderer.</Text>
      <Text>If you can see this, PDF generation works.</Text>
      <Text>Date: {new Date().toLocaleString()}</Text>
    </Page>
  </Document>
);

export default TestPDF;
