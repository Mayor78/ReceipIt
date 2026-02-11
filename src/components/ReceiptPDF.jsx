// import React from 'react';
// import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// // Standardized styles for mo bbile-to-PC consistency
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#FFFFFF',
//     padding: 30,
//     fontFamily: 'Helvetica', // Standard safe font for mobile PDF engines
//   },
//   header: {
//     marginBottom: 20,
//     paddingBottom: 15,
//     borderBottom: '2px solid #2563EB',
//   },
//   companyLogo: {
//     width: 60,
//     height: 60,
//     marginBottom: 10,
//     objectFit: 'contain',
//   },
//   companyName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   companyInfo: {
//     fontSize: 9,
//     color: '#6B7280',
//     marginBottom: 2,
//   },
//   section: {
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 8,
//     textTransform: 'uppercase',
//   },
//   row: {
//     flexDirection: 'row',
//     marginBottom: 6,
//   },
//   col: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 9,
//     color: '#6B7280',
//     marginBottom: 2,
//     textTransform: 'uppercase',
//   },
//   value: {
//     fontSize: 10,
//     color: '#1F2937',
//     fontWeight: 'bold',
//   },
//   table: {
//     marginTop: 10,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#F9FAFB',
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 9,
//     color: '#374151',
//   },
//   totalSection: {
//     marginTop: 20,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   grandTotal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 2,
//     borderTopColor: '#1F2937',
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 5,
//     left: 30,
//     right: 30,
//     textAlign: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//     paddingTop: 10,
//   },
//   footerText: {
//     fontSize: 8,
//     color: '#9CA3AF',
//   },
//   signatureSection: {
//     marginTop: 40,
//   },
//   signatureImage: {
//     width: 100,
//     height: 40,
//     objectFit: 'contain',
//   },
//   signatureLine: {
//     width: 150,
//     borderBottomWidth: 1,
//     borderBottomColor: '#000',
//     marginTop: 5,
//   },
//   termsSection: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//   }
// });

// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-NG', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(amount);
// };

// const ReceiptPDF = ({ 
//   receiptData, 
//   calculateSubtotal, 
//   calculateDiscount, 
//   calculateVAT, 
//   calculateTotal, 
//   calculateChange,
//   companyLogo 
// }) => {
//   return (
//     <Document title={`${receiptData.receiptType}-${receiptData.receiptNumber}`}>
//       <Page size="A4" style={styles.page}>
//          <Text style={ { marginBottom: 3, fontSize: 7, color: '#1F2937', textAlign: 'flex-start' } }>
//             Generated via ReceiptIt • Built by MayorDev {receiptData.date} 
//           </Text>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//             <View>
//               {companyLogo && <Image style={styles.companyLogo} src={companyLogo} />}
//               <Text style={styles.companyName}>{receiptData.storeName}</Text>
//               <Text style={styles.companyInfo}>{receiptData.storeAddress}</Text>
//               <Text style={styles.companyInfo}>{receiptData.storePhone} | {receiptData.storeEmail}</Text>
//             </View>
//             <View style={{ textAlign: 'right' }}>
//               <Text style={[styles.sectionTitle, { color: '#2563EB', fontSize: 20 }]}>
//                 {receiptData.receiptType}
//               </Text>
//               <Text style={styles.value}>#{receiptData.receiptNumber}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Info Grid */}
//         <View style={styles.section}>
//           <View style={styles.row}>
//             <View style={styles.col}>
//               <Text style={styles.label}>Date / Time</Text>
//               <Text style={styles.value}>{receiptData.date} {receiptData.time}</Text>
//             </View>
//             <View style={styles.col}>
//               <Text style={styles.label}>Cashier</Text>
//               <Text style={styles.value}>{receiptData.cashierName}</Text>
//             </View>
//             <View style={styles.col}>
//               <Text style={styles.label}>Payment Status</Text>
//               <Text style={[styles.value, { color: '#059669' }]}>PAID</Text>
//             </View>
//           </View>
//         </View>

//         {/* Table */}
//         <View style={styles.table}>
//           <View style={styles.tableHeader}>
//             <Text style={[styles.tableCell, { flex: 3, fontWeight: 'bold' }]}>Description</Text>
//             <Text style={[styles.tableCell, { textAlign: 'center' }]}>Qty</Text>
//             <Text style={[styles.tableCell, { textAlign: 'right' }]}>Price (NGN)</Text>
//             <Text style={[styles.tableCell, { textAlign: 'right' }]}>Total (NGN)</Text>
//           </View>

//           {receiptData.items.map((item, i) => (
//             <View key={i} style={styles.tableRow}>
//               <Text style={[styles.tableCell, { flex: 3 }]}>{item.name}</Text>
//               <Text style={[styles.tableCell, { textAlign: 'center' }]}>{item.quantity}</Text>
//               <Text style={[styles.tableCell, { textAlign: 'right' }]}>{formatCurrency(item.price)}</Text>
//               <Text style={[styles.tableCell, { textAlign: 'right' }]}>{formatCurrency(item.price * item.quantity)}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Totals */}
//         <View style={styles.totalSection}>
//           <View style={styles.totalRow}>
//             <Text style={styles.label}>Subtotal</Text>
//             <Text style={styles.value}>{formatCurrency(calculateSubtotal())}</Text>
//           </View>
//           {receiptData.discount > 0 && (
//             <View style={styles.totalRow}>
//               <Text style={styles.label}>Discount</Text>
//               <Text style={[styles.value, { color: '#DC2626' }]}>-{formatCurrency(calculateDiscount())}</Text>
//             </View>
//           )}
//           {receiptData.includeVAT && (
//             <View style={styles.totalRow}>
//               <Text style={styles.label}>VAT ({receiptData.vatRate}%)</Text>
//               <Text style={styles.value}>+{formatCurrency(calculateVAT())}</Text>
//             </View>
//           )}
//           <View style={styles.grandTotal}>
//             <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Total Amount (NGN)</Text>
//             <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2563EB' }}>
//               {formatCurrency(calculateTotal())}
//             </Text>
//           </View>
//         </View>

//         {/* Signature */}
//         {receiptData.includeSignature && (
//           <View style={styles.signatureSection}>
//             {receiptData.signatureData ? (
//               <Image style={styles.signatureImage} src={receiptData.signatureData} />
//             ) : (
//               <View style={{ height: 40 }} />
//             )}
//             <View style={styles.signatureLine} />
//             <Text style={[styles.label, { marginTop: 4 }]}>Authorized Signature</Text>
//           </View>
//         )}

//         {/* Footer */}
//         <View style={styles.footer} fixed>
//           <Text style={styles.footerText}>Thank you for your business!</Text>
         
//         </View>

//       </Page>
//     </Document>
//   );
// };

// export default ReceiptPDF;