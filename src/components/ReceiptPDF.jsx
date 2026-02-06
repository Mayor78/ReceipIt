import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles WITHOUT custom font registration
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2px solid #2563EB',
    position: 'relative',
  },
  companyLogo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    color: '#1F2937',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    borderBottomStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#1F2937',
    marginHorizontal: 2,
  },
  totalSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#1F2937',
    borderTopStyle: 'solid',
  },
  footer: {
    textAlign: 'center',
    fontSize: 9,
    color: '#6B7280',
    marginTop: 20,
    paddingTop: 10,
  },
  badge: {
    backgroundColor: '#2563EB',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 9,
    marginLeft: 5,
  },
  watermark: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 8,
    color: '#9CA3AF',
    opacity: 0.5,
  },
  signatureSection: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    borderTopStyle: 'solid',
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureBox: {
    flex: 1,
    marginRight: 20,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    marginTop: 40,
    width: 200,
  },
  signatureImage: {
    width: 120,
    height: 40,
    objectFit: 'contain',
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 5,
  },
  termsSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
    borderRadius: 4,
  },
  termsText: {
    fontSize: 8,
    color: '#4B5563',
    lineHeight: 1.4,
  },
});

// Simple formatting function WITHOUT Naira symbol
const formatCurrency = (amount) => {
  const fixedAmount = amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
  return fixedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ReceiptPDF = ({ 
  receiptData, 
  calculateSubtotal, 
  calculateDiscount, 
  calculateVAT, 
  calculateTotal, 
  calculateChange,
  companyLogo 
}) => {
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          {companyLogo && (
            <Image 
              style={styles.companyLogo}
              src={companyLogo}
            />
          )}
          <Text style={styles.companyName}>{receiptData.storeName}</Text>
          <Text style={styles.companyInfo}>{receiptData.storeAddress}</Text>
          <Text style={styles.companyInfo}>Phone: {receiptData.storePhone} • Email: {receiptData.storeEmail}</Text>
          {receiptData.tinNumber && <Text style={styles.companyInfo}>{receiptData.tinNumber}</Text>}
          {receiptData.rcNumber && <Text style={styles.companyInfo}>{receiptData.rcNumber}</Text>}
        </View>

        {/* Receipt Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Receipt Type</Text>
              <Text style={styles.value}>
                {receiptData.receiptType.toUpperCase()}
                <Text style={styles.badge}> {receiptData.receiptNumber}</Text>
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{receiptData.date}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{receiptData.time}</Text>
            </View>
          </View>
          <View style={[styles.row, { marginTop: 5 }]}>
            <View style={styles.col}>
              <Text style={styles.label}>Cashier</Text>
              <Text style={styles.value}>{receiptData.cashierName}</Text>
            </View>
            {receiptData.invoiceNumber && (
              <View style={styles.col}>
                <Text style={styles.label}>Invoice #</Text>
                <Text style={styles.value}>{receiptData.invoiceNumber}</Text>
              </View>
            )}
            <View style={styles.col}>
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.value, { color: '#059669' }]}>PAID</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 3 }]}>Description</Text>
              <Text style={styles.tableCell}>Unit</Text>
              <Text style={styles.tableCell}>Qty</Text>
              <Text style={styles.tableCell}>Unit Price (NGN)</Text>
              <Text style={styles.tableCell}>Total (NGN)</Text>
            </View>
            
            {/* Table Rows */}
            {receiptData.items.map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 3 }]}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.unit || 'pcs'}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.price)}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.price * item.quantity)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.totalSection}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.totalRow}>
            <Text style={styles.label}>Subtotal (NGN)</Text>
            <Text style={styles.value}>{formatCurrency(calculateSubtotal())}</Text>
          </View>
          
          {receiptData.includeDiscount && receiptData.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.label}>
                Discount ({receiptData.discountType === 'percentage' ? `${receiptData.discount}%` : 'Fixed'})
              </Text>
              <Text style={[styles.value, { color: '#DC2626' }]}>
                -{formatCurrency(calculateDiscount())}
              </Text>
            </View>
          )}
          
          {receiptData.deliveryFee > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.label}>Delivery Fee (NGN)</Text>
              <Text style={styles.value}>+{formatCurrency(receiptData.deliveryFee)}</Text>
            </View>
          )}
          
          {receiptData.includeVAT && (
            <View style={styles.totalRow}>
              <Text style={styles.label}>VAT ({receiptData.vatRate}%)</Text>
              <Text style={styles.value}>+{formatCurrency(calculateVAT())}</Text>
            </View>
          )}
          
          {/* Grand Total */}
          <View style={styles.grandTotal}>
            <Text style={[styles.label, { fontSize: 12, fontWeight: 'bold' }]}>Grand Total (NGN)</Text>
            <Text style={[styles.value, { fontSize: 14, fontWeight: 'bold', color: '#1F2937' }]}>
              {formatCurrency(calculateTotal())}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.value}>{receiptData.paymentMethod}</Text>
            </View>
            {receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 && (
              <>
                <View style={styles.col}>
                  <Text style={styles.label}>Amount Paid (NGN)</Text>
                  <Text style={[styles.value, { color: '#059669' }]}>
                    {formatCurrency(receiptData.amountPaid)}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Change (NGN)</Text>
                  <Text style={[styles.value, { color: '#2563EB' }]}>
                    {formatCurrency(calculateChange())}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Terms & Conditions */}
        {receiptData.includeTerms && receiptData.termsAndConditions && (
          <View style={styles.termsSection}>
            <Text style={[styles.sectionTitle, { fontSize: 11 }]}>Terms & Conditions</Text>
            <Text style={styles.termsText}>
              {receiptData.termsAndConditions}
            </Text>
          </View>
        )}

        {/* Signature Section */}
        {receiptData.includeSignature && (
          <View style={styles.signatureSection}>
            <View style={styles.signatureContainer}>
              {/* Signature Box */}
              <View style={styles.signatureBox}>
                {receiptData.signatureData ? (
                  <View style={{ alignItems: 'flex-start' }}>
                    <Image 
                      style={styles.signatureImage}
                      src={receiptData.signatureData}
                    />
                    <Text style={styles.signatureLabel}>Digital Signature</Text>
                  </View>
                ) : (
                  <View style={styles.signatureLine} />
                )}
                <Text style={styles.signatureLabel}>Authorized Signature</Text>
              </View>
              
              {/* Date Box */}
              <View style={{ flex: 0.5 }}>
                <Text style={[styles.signatureLine, { width: 120 }]} />
                <Text style={styles.signatureLabel}>Date</Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ marginBottom: 5, fontSize: 10 }}>
            {receiptData.customerNotes}
          </Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 10 }}>
            {receiptData.footerMessage}
          </Text>
          <Text style={{ fontSize: 10 }}>Thank you for your business!</Text>
        </View>

        {/* Watermark */}
        <Text style={styles.watermark}>
          Generated with ReceiptIt • {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;