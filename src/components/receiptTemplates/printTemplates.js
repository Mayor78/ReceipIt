// Print-optimized templates for generating print HTML
export const printTemplates = {
modern: (receiptData, companyLogo, formatNaira, calculations, importantFields, verificationUrl, qrCodeUrl) => {
    const {
      subtotal,
      discount,
      vat,
      total,
      change,
      deliveryFee = 0
    } = calculations;
    
    // Helper function to get category icon emoji
    const getCategoryIcon = (category) => {
      const icons = {
        electronics: '📱',
        books: '📚',
        agriculture: '🌾',
        clothing: '👕',
        food: '☕',
        services: '✂️',
        liquids: '💧',
        construction: '🏠',
        logistics: '🚚',
        general: '📦'
      };
      return icons[category] || icons.general;
    };

    // Check if there's category data
    const hasCategoryData = receiptData.items?.some(item => item.category && item.category !== 'general');
    const hasCustomFields = receiptData.items?.some(item => item.customFields && Object.keys(item.customFields).length > 0);
    
    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 210mm; margin: 0 auto;">
        <!-- Category Data Badge -->
        ${hasCategoryData ? `
          <div style="background: linear-gradient(90deg, #4F46E5, #7C3AED); color: white; padding: 10px 15px; border-radius: 6px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 18px;">📋</div>
            <div>
              <div style="font-weight: 600; font-size: 14px;">COMPLETE DETAILED RECEIPT</div>
              <div style="font-size: 12px; opacity: 0.9;">All item details shown below</div>
            </div>
          </div>
        ` : ''}
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #3B82F6;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 60px; margin-bottom: 15px;">` : ''}
          <h1 style="color: #111827; margin: 10px 0; font-size: 24px; font-weight: 700;">${receiptData.storeName}</h1>
          <p style="color: #6B7280; margin: 5px 0; font-size: 13px;">${receiptData.storeAddress}</p>
          <p style="color: #6B7280; margin: 5px 0; font-size: 13px;">Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• Email: ${receiptData.storeEmail}` : ''}</p>
          ${receiptData.tinNumber ? `<p style="color: #6B7280; margin: 5px 0; font-size: 13px; font-weight: 600;">TIN: ${receiptData.tinNumber}</p>` : ''}
          ${receiptData.rcNumber ? `<p style="color: #6B7280; margin: 5px 0; font-size: 13px;">RC: ${receiptData.rcNumber}</p>` : ''}
        </div>
        
        <!-- Document Info -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; background: #F9FAFB; padding: 20px; border-radius: 8px;">
          <div>
            <h3 style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">${receiptData.receiptType} Details</h3>
            <p style="margin: 5px 0; color: #111827;"><strong>Receipt #:</strong> ${receiptData.receiptNumber}</p>
            ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? `
              <p style="margin: 5px 0; color: #111827;"><strong>Invoice #:</strong> ${receiptData.invoiceNumber}</p>
            ` : ''}
            ${receiptData.poNumber ? `<p style="margin: 5px 0; color: #111827;"><strong>PO #:</strong> ${receiptData.poNumber}</p>` : ''}
            <p style="margin: 5px 0; color: #111827;"><strong>Cashier:</strong> ${receiptData.cashierName}</p>
          </div>
          <div>
            <h3 style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">Date & Time</h3>
            <p style="margin: 5px 0; color: #111827;"><strong>Date:</strong> ${receiptData.date}</p>
            <p style="margin: 5px 0; color: #111827;"><strong>Time:</strong> ${receiptData.time}</p>
            ${receiptData.dueDate ? `<p style="margin: 5px 0; color: #111827;"><strong>Due Date:</strong> ${receiptData.dueDate}</p>` : ''}
          </div>
        </div>
        
        <!-- Customer Info -->
        ${receiptData.includeBillTo && receiptData.billToName ? `
          <div style="background: linear-gradient(90deg, #3B82F6, #8B5CF6); color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">BILL TO</h3>
            <p style="margin: 5px 0;"><strong>${receiptData.billToName}</strong></p>
            ${receiptData.billToAddress ? `<p style="margin: 5px 0;">${receiptData.billToAddress}</p>` : ''}
            ${receiptData.billToPhone ? `<p style="margin: 5px 0;">Tel: ${receiptData.billToPhone}</p>` : ''}
          </div>
        ` : ''}
        
        <!-- Items Table - Showing ALL DETAILS -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
          <thead>
            <tr style="background: #3B82F6; color: white;">
              <th style="padding: 14px 10px; text-align: left; font-weight: 600; width: 40%;">Item Details</th>
              <th style="padding: 14px 10px; text-align: center; font-weight: 600; width: 12%;">Qty</th>
              <th style="padding: 14px 10px; text-align: center; font-weight: 600; width: 12%;">Unit</th>
              <th style="padding: 14px 10px; text-align: right; font-weight: 600; width: 18%;">Price</th>
              <th style="padding: 14px 10px; text-align: right; font-weight: 600; width: 18%;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${receiptData.items.map((item, index) => {
              // Format ALL custom fields for display
              const customFields = item.customFields ? Object.entries(item.customFields)
                .filter(([key, value]) => value && value.toString().trim() !== '')
                .map(([key, value]) => ({
                  key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                  value: value.toString()
                })) : [];
              
              // Get category icon
              const categoryIcon = item.category ? getCategoryIcon(item.category) : '📦';
              const categoryName = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'General';
              
              return `
                <tr style="border-bottom: 1px solid #E5E7EB; ${index % 2 === 0 ? 'background: #F9FAFB;' : ''}">
                  <td style="padding: 15px 10px; vertical-align: top;">
                    <div style="display: flex; align-items: flex-start; gap: 8px;">
                      <div style="font-size: 16px; margin-top: 2px; flex-shrink: 0;">${categoryIcon}</div>
                      <div style="flex: 1;">
                        <div style="font-weight: 600; color: #111827; font-size: 14px; margin-bottom: 4px;">${item.name}</div>
                        
                        <!-- Category Display -->
                        ${item.category && item.category !== 'general' ? `
                          <div style="display: inline-block; font-size: 11px; padding: 3px 8px; background: #EFF6FF; color: #1D4ED8; border-radius: 4px; margin-bottom: 8px; font-weight: 500; border: 1px solid #BFDBFE;">
                            📋 Category: ${categoryName}
                          </div>
                          <br>
                        ` : ''}
                        
                        <!-- Item Description -->
                        ${item.description ? `
                          <div style="font-size: 12px; color: #4B5563; margin-bottom: 10px; padding-left: 8px; border-left: 2px solid #D1D5DB;">
                            ${item.description}
                          </div>
                        ` : ''}
                        
                        <!-- ALL Custom Fields - No limits -->
                        ${customFields.length > 0 ? `
                          <div style="margin-top: 10px; padding: 10px; background: #F8FAFC; border-radius: 6px; border: 1px solid #E5E7EB;">
                            <div style="font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 6px; text-transform: uppercase;">
                              Item Specifications:
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px;">
                              ${customFields.map((field, fieldIndex) => `
                                <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #E5E7EB; ${fieldIndex === customFields.length - 1 ? 'border-bottom: none;' : ''}">
                                  <div style="font-weight: 500; color: #6B7280; font-size: 11px;">${field.key}:</div>
                                  <div style="font-weight: 600; color: #111827; font-size: 11px; text-align: right; max-width: 150px; word-wrap: break-word;">
                                    ${field.value}
                                  </div>
                                </div>
                              `).join('')}
                            </div>
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  </td>
                  <td style="padding: 15px 10px; text-align: center; color: #111827; vertical-align: top; font-weight: 600; font-size: 14px;">${item.quantity}</td>
                  <td style="padding: 15px 10px; text-align: center; color: #374151; vertical-align: top; font-size: 12px;">
                    ${item.unit && item.unit !== 'Piece' ? item.unit : 'PCS'}
                  </td>
                  <td style="padding: 15px 10px; text-align: right; color: #111827; vertical-align: top; font-weight: 600; font-size: 13px;">${formatNaira(item.price)}</td>
                  <td style="padding: 15px 10px; text-align: right; font-weight: 700; color: #1D4ED8; vertical-align: top; font-size: 14px;">${formatNaira(item.price * item.quantity)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        
        
        <!-- Totals Section -->
        <div style="border: 2px solid #E5E7EB; padding: 25px; border-radius: 10px; margin-bottom: 30px; background: linear-gradient(135deg, #F9FAFB, #F3F4F6);">
          <h3 style="color: #374151; margin-bottom: 20px; font-weight: 700; font-size: 16px; text-transform: uppercase; border-bottom: 2px solid #3B82F6; padding-bottom: 10px;">
            Payment Summary
          </h3>
          <div style="max-width: 350px; margin-left: auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #E5E7EB;">
              <span style="color: #6B7280; font-size: 14px;">Subtotal:</span>
              <span style="font-weight: 600; font-size: 14px;">${formatNaira(subtotal)}</span>
            </div>
            
            ${receiptData.includeDiscount && receiptData.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #E5E7EB; color: #DC2626;">
                <span style="font-size: 14px;">Discount:</span>
                <span style="font-weight: 600; font-size: 14px;">-${formatNaira(discount)}</span>
              </div>
            ` : ''}
            
            ${deliveryFee > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #E5E7EB;">
                <span style="color: #6B7280; font-size: 14px;">Delivery Fee:</span>
                <span style="font-weight: 600; font-size: 14px;">${formatNaira(deliveryFee)}</span>
              </div>
            ` : ''}
            
            ${receiptData.includeVAT ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #E5E7EB;">
                <span style="color: #6B7280; font-size: 14px;">VAT (${receiptData.vatRate}%):</span>
                <span style="font-weight: 600; font-size: 14px;">${formatNaira(vat)}</span>
              </div>
            ` : ''}
            
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 800; color: #1D4ED8; margin-top: 20px; padding-top: 20px; border-top: 3px solid #3B82F6; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
              <span style="letter-spacing: 0.5px;">GRAND TOTAL:</span>
              <span>${formatNaira(total)}</span>
            </div>
          </div>
        </div>

        
        <!-- Payment Information -->
        <div style="background: linear-gradient(135deg, #D1FAE5, #A7F3D0); padding: 25px; margin: 30px 0; border-radius: 10px; border: 2px solid #10B981;">
          <h3 style="color: #065F46; margin-bottom: 15px; font-weight: 700; font-size: 18px; display: flex; align-items: center; gap: 10px;">
            <span>💰</span> PAYMENT INFORMATION
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; font-size: 14px;">
            <div style="background: white; padding: 12px 15px; border-radius: 8px; border: 1px solid #10B981;">
              <div style="color: #065F46; font-weight: 600; margin-bottom: 5px;">Payment Method</div>
              <div style="font-weight: 700; color: #111827; font-size: 16px;">${receiptData.paymentMethod}</div>
            </div>
            
            ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
              <div style="background: white; padding: 12px 15px; border-radius: 8px; border: 1px solid #10B981;">
                <div style="color: #065F46; font-weight: 600; margin-bottom: 5px;">Amount Paid</div>
                <div style="font-weight: 700; color: #111827; font-size: 16px;">${formatNaira(receiptData.amountPaid)}</div>
              </div>
              <div style="background: white; padding: 12px 15px; border-radius: 8px; border: 1px solid #10B981;">
                <div style="color: #065F46; font-weight: 600; margin-bottom: 5px;">Change Given</div>
                <div style="font-weight: 700; color: #DC2626; font-size: 16px;">${formatNaira(change)}</div>
              </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Customer Notes -->
        ${receiptData.customerNotes ? `
          <div style="background: linear-gradient(135deg, #E0E7FF, #C7D2FE); border: 2px solid #4F46E5; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #3730A3; margin-bottom: 12px; font-weight: 700; font-size: 16px; display: flex; align-items: center; gap: 10px;">
              <span>📝</span> CUSTOMER NOTES
            </h3>
            <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #4F46E5;">
              <p style="color: #111827; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${receiptData.customerNotes}</p>
            </div>
          </div>
        ` : ''}
        
        <!-- Terms & Conditions -->
        ${receiptData.includeTerms && receiptData.termsAndConditions ? `
          <div style="border: 2px solid #374151; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #111827; margin-bottom: 12px; font-weight: 700; font-size: 16px; border-bottom: 2px solid #374151; padding-bottom: 10px;">
              TERMS & CONDITIONS
            </h3>
            <div style="background: #F9FAFB; padding: 15px; border-radius: 6px; border: 1px solid #D1D5DB;">
              <p style="color: #374151; font-size: 12px; line-height: 1.6; white-space: pre-line;">${receiptData.termsAndConditions}</p>
            </div>
          </div>
        ` : ''}
        
        <!-- Signature Section -->
        ${receiptData.includeSignature ? `
          <div style="margin: 40px 0; padding: 25px; border: 2px solid #374151; border-radius: 10px;">
            <h3 style="color: #111827; margin-bottom: 20px; font-weight: 700; font-size: 16px; text-align: center; text-transform: uppercase;">
              Authorization
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
              <div style="text-align: center;">
                <div style="height: 80px; border-bottom: 3px solid #374151; margin-bottom: 15px; position: relative;">
                  ${receiptData.signatureData ? `
                    <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 70px; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);">
                  ` : ''}
                </div>
                <div style="color: #111827; font-size: 14px; font-weight: 600;">AUTHORIZED SIGNATURE</div>
                <div style="color: #6B7280; font-size: 11px; margin-top: 5px;">${receiptData.cashierName}</div>
              </div>
              <div style="text-align: center;">
                <div style="height: 80px; border-bottom: 3px solid #374151; margin-bottom: 15px;"></div>
                <div style="color: #111827; font-size: 14px; font-weight: 600;">CUSTOMER SIGNATURE</div>
                <div style="color: #6B7280; font-size: 11px; margin-top: 5px;">Customer Name/Stamp</div>
              </div>
            </div>
            <div style="text-align: center; color: #374151; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #D1D5DB;">
              Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Time: ${receiptData.time}
            </div>
          </div>
        ` : ''}
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 3px solid #374151; color: #6B7280; font-size: 12px;">
          <!-- Dotted Line -->
          <div style="display: flex; justify-content: center; gap: 3px; margin-bottom: 25px; height: 5px;">
            ${Array.from({ length: 50 }).map(() => 
              `<div style="width: 10px; background: #374151; height: 2px;"></div>`
            ).join('')}
          </div>
          
          <div style="margin-bottom: 20px;">
            <div style="font-size: 16px; font-weight: 800; color: #111827; margin-bottom: 5px; letter-spacing: 1px;">
              ${receiptData.storeName}
            </div>
            <div style="font-size: 14px; font-weight: 600; color: #3B82F6; margin-bottom: 10px;">
              Receipt #: ${receiptData.receiptNumber}
            </div>
          </div>
          
          <p style="margin: 10px 0; font-size: 13px; font-weight: 500; color: #374151;">
            ${receiptData.footerMessage || 'Thank you for your business! We appreciate your trust.'}
          </p>
          
          ${hasCategoryData || hasCustomFields ? `
            <div style="background: #F3F4F6; padding: 10px; border-radius: 6px; margin: 15px auto; max-width: 500px; border-left: 4px solid #10B981;">
              <div style="font-size: 11px; font-weight: 600; color: #065F46;">
                ✅ This is a detailed receipt containing complete item information
              </div>
              <div style="font-size: 10px; color: #6B7280; margin-top: 3px;">
                All specifications, categories, and important details are included above
              </div>
            </div>
          ` : ''}
          
          ${verificationUrl ? `
            <div style="margin-top: 15px; padding: 10px; background: #F0F9FF; border-radius: 6px; display: inline-block;">
              <span style="font-size: 10px; color: #0369A1; display: flex; align-items: center; gap: 5px;">
                <span>🔒</span> Verified Receipt - Protected Against Fraud
              </span>
            </div>
          ` : ''}
          
          <p style="margin-top: 25px; font-size: 10px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 15px;">
            Document Generated: ${new Date().toLocaleString()} • Transaction ID: ${receiptData.receiptNumber} •
            <br>
            <span style="font-weight: 600; color: #6B7280;">Powered by ReceipIt • Build by MayorDev</span>
          </p>
        </div>
      </div>
    `;
  },
 professional: (receiptData, companyLogo, formatNaira, calculations, importantFields) => {
    const { subtotal, discount, vat, total, change, deliveryFee = 0 } = calculations;
    
    // Helper function to get category icon emoji
    const getCategoryIcon = (category) => {
      const icons = {
        electronics: '📱',
        books: '📚',
        agriculture: '🌾',
        clothing: '👕',
        food: '☕',
        services: '✂️',
        liquids: '💧',
        construction: '🏠',
        logistics: '🚚',
        general: '📦'
      };
      return icons[category] || '';
    };

    // Check if there's category data
    const hasCategoryData = receiptData.items?.some(item => item.category && item.category !== 'general');
    const hasCustomFields = receiptData.items?.some(item => item.customFields && Object.keys(item.customFields).length > 0);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          @media (max-width: 768px) {
            .mobile-stack {
              display: block !important;
              width: 100% !important;
            }
            .mobile-hide {
              display: none !important;
            }
            .mobile-full {
              width: 100% !important;
              max-width: 100% !important;
              padding-left: 10px !important;
              padding-right: 10px !important;
            }
            .mobile-text-center {
              text-align: center !important;
            }
            .mobile-padding {
              padding: 15px 10px !important;
            }
            .mobile-block {
              display: block !important;
              margin-bottom: 10px !important;
              width: 100% !important;
            }
            .mobile-grid-1 {
              grid-template-columns: 1fr !important;
            }
            .mobile-flex-column {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 15px !important;
            }
            .mobile-margin-bottom {
              margin-bottom: 15px !important;
            }
            .mobile-font-sm {
              font-size: 12px !important;
            }
            .mobile-font-xs {
              font-size: 11px !important;
            }
            .mobile-table-container {
              overflow-x: auto !important;
              -webkit-overflow-scrolling: touch !important;
            }
            .mobile-table {
              min-width: 600px !important;
              font-size: 12px !important;
            }
            .mobile-table th,
            .mobile-table td {
              padding: 10px 8px !important;
            }
            .mobile-item-card {
              display: block !important;
              background: white !important;
              border: 1px solid #E5E7EB !important;
              border-radius: 8px !important;
              padding: 15px !important;
              margin-bottom: 12px !important;
            }
            .mobile-category-badge {
              font-size: 10px !important;
              padding: 2px 6px !important;
              margin: 5px 0 !important;
            }
            .mobile-custom-fields {
              display: grid !important;
              grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
              gap: 6px !important;
              font-size: 10px !important;
            }
            .mobile-important-details {
              grid-template-columns: 1fr !important;
            }
            .mobile-signature {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
          }
          
          @media print {
            .mobile-stack {
              display: none !important;
            }
            .mobile-hide {
              display: table !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; background: white; width: 100%;">
        <div style="max-width: 100%; margin: 0 auto; padding: 0; overflow-x: hidden;">
          <!-- watermark -->
          <p style='font-size: 9px; text-align: start; color: #9CA3AF; margin: 15px 20px 5px 20px; word-wrap: break-word;'>
            Professionally generated by ReceipIt • MayorDev
          </p> 
          
          <!-- Professional Header -->
          <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #D1D5DB; width: 100%; box-sizing: border-box;">
            ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 50px; max-width: 80%; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">` : ''}
            <h1 style="color: #111827; margin: 10px 0; font-size: 22px; font-weight: 600; letter-spacing: -0.5px; line-height: 1.2; word-wrap: break-word; padding: 0 15px;">${receiptData.storeName}</h1>
            <p style="color: #4B5563; margin: 5px 0; font-size: 13px; font-weight: 400; line-height: 1.3; word-wrap: break-word; padding: 0 15px;">${receiptData.storeAddress}</p>
            <p style="color: #4B5563; margin: 5px 0; font-size: 13px; line-height: 1.3; word-wrap: break-word; padding: 0 15px;">Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• Email: ${receiptData.storeEmail}` : ''}</p>
            ${receiptData.tinNumber ? `<p style="color: #4B5563; margin: 5px 0; font-size: 13px; font-weight: 600; line-height: 1.3; word-wrap: break-word; padding: 0 15px;">TIN: ${receiptData.tinNumber}</p>` : ''}
            ${receiptData.rcNumber ? `<p style="color: #4B5563; margin: 5px 0; font-size: 13px; line-height: 1.3; word-wrap: break-word; padding: 0 15px;">RC: ${receiptData.rcNumber}</p>` : ''}
            
            <!-- Professional Category Notice -->
            ${hasCategoryData ? `
              <div style="margin-top: 10px; padding: 4px 12px; background: #10B981; color: white; border-radius: 4px; display: inline-block;">
                <span style="font-size: 11px; font-weight: 500;">📋 Professional Detailed Receipt</span>
              </div>
            ` : ''}
          </div>
          
          <!-- Document Info -->
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 25px; padding: 0 20px 20px 20px; border-bottom: 1px solid #E5E7EB; width: 100%; box-sizing: border-box; gap: 15px;">
            <div style="flex: 1; min-width: 200px;">
              <p style="margin: 8px 0; color: #4B5563; font-size: 13px; line-height: 1.3;"><strong>${receiptData.receiptType} #:</strong> ${receiptData.receiptNumber}</p>
              ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? `
                <p style="margin: 8px 0; color: #4B5563; font-size: 13px; line-height: 1.3;"><strong>Invoice #:</strong> ${receiptData.invoiceNumber}</p>
              ` : ''}
              ${receiptData.poNumber ? `<p style="margin: 8px 0; color: #4B5563; font-size: 13px; line-height: 1.3;"><strong>PO #:</strong> ${receiptData.poNumber}</p>` : ''}
              <p style="margin: 8px 0; color: #4B5563; font-size: 13px; line-height: 1.3;"><strong>Date:</strong> ${receiptData.date}</p>
              ${receiptData.dueDate ? `<p style="margin: 8px 0; color: #4B5563; font-size: 13px; line-height: 1.3;"><strong>Due Date:</strong> ${receiptData.dueDate}</p>` : ''}
            </div>
            <div style="text-align: right; flex: 1; min-width: 200px;">
              <p style="margin: 8px 0; color: #4B5563; font-size: 13px; line-height: 1.3;"><strong>Time:</strong> ${receiptData.time}</p>
              <p style="margin: 8px 0; color: #4B5563; font-size: 13px; line-height: 1.3;"><strong>Cashier:</strong> ${receiptData.cashierName}</p>
            </div>
          </div>
          
          <!-- Customer Info -->
          ${receiptData.includeBillTo && receiptData.billToName ? `
            <div style="background: #10B981; color: white; padding: 15px; border-radius: 6px; margin: 0 20px 25px 20px; width: calc(100% - 40px); box-sizing: border-box; word-wrap: break-word;">
              <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">BILL TO</h3>
              <p style="margin: 4px 0; font-weight: 500; font-size: 14px; line-height: 1.3;"><strong>${receiptData.billToName}</strong></p>
              ${receiptData.billToAddress ? `<p style="margin: 4px 0; font-size: 13px; line-height: 1.3;">${receiptData.billToAddress}</p>` : ''}
              ${receiptData.billToPhone ? `<p style="margin: 4px 0; font-size: 13px; line-height: 1.3;">Tel: ${receiptData.billToPhone}</p>` : ''}
            </div>
          ` : ''}
          
          <!-- Professional Items Section -->
          <div style="margin-bottom: 30px; padding: 0 20px; width: 100%; box-sizing: border-box;">
            <!-- Desktop Table -->
            <div class="mobile-table-container mobile-hide">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; min-width: 600px;" class="mobile-table">
                <thead>
                  <tr>
                    <th style="padding: 12px 10px; text-align: left; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981; font-size: 12px;">Description</th>
                    <th style="padding: 12px 10px; text-align: center; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981; font-size: 12px;">Qty</th>
                    <th style="padding: 12px 10px; text-align: center; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981; font-size: 12px;">Unit</th>
                    <th style="padding: 12px 10px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981; font-size: 12px;">Unit Price</th>
                    <th style="padding: 12px 10px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981; font-size: 12px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${receiptData.items.map((item, index) => {
                    // Format ALL custom fields for display
                    const customFields = item.customFields ? Object.entries(item.customFields)
                      .filter(([key, value]) => value && value.toString().trim() !== '')
                      .map(([key, value]) => ({
                        key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                        value: value.toString()
                      })) : [];
                    
                    // Get category icon
                    const categoryIcon = item.category ? getCategoryIcon(item.category) : '';
                    const categoryName = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : '';
                    
                    return `
                      <tr style="border-bottom: 1px solid #E5E7EB; background: ${index % 2 === 0 ? '#F9FAFB' : 'white'};">
                        <td style="padding: 14px 10px; color: #111827; vertical-align: top; min-width: 200px;">
                          <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
                            ${categoryIcon ? `<div style="font-size: 14px; flex-shrink: 0;">${categoryIcon}</div>` : ''}
                            <div style="flex: 1; min-width: 0;">
                              <div style="font-weight: 500; font-size: 13px; line-height: 1.3; word-wrap: break-word;">${item.name}</div>
                              
                              <!-- Professional Category Display -->
                              ${categoryName && categoryName !== 'General' ? `
                                <div style="display: inline-block; font-size: 10px; padding: 2px 8px; background: #D1FAE5; color: #065F46; border-radius: 4px; margin-top: 4px; margin-bottom: 6px; border: 1px solid #A7F3D0; font-weight: 500;">
                                  ${categoryName}
                                </div>
                              ` : ''}
                            </div>
                          </div>
                          
                          <!-- Item Description -->
                          ${item.description ? `
                            <div style="font-size: 12px; color: #6B7280; margin-top: 4px; line-height: 1.3; word-wrap: break-word;">
                              ${item.description}
                            </div>
                          ` : ''}
                          
                          <!-- Professional Custom Fields Display -->
                          ${customFields.length > 0 ? `
                            <div style="margin-top: 8px;">
                              <div style="font-size: 10px; font-weight: 600; color: #374151; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px;">
                                Specifications:
                              </div>
                              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                ${customFields.map((field) => `
                                  <div style="font-size: 10px; padding: 3px 6px; background: #F3F4F6; color: #4B5563; border-radius: 3px; border: 1px solid #E5E7EB; word-break: break-word; max-width: 100%;">
                                    <span style="font-weight: 600;">${field.key}:</span> ${field.value}
                                  </div>
                                `).join('')}
                              </div>
                            </div>
                          ` : ''}
                        </td>
                        <td style="padding: 14px 10px; text-align: center; color: #4B5563; vertical-align: top; font-size: 13px;">${item.quantity}</td>
                        <td style="padding: 14px 10px; text-align: center; color: #4B5563; vertical-align: top; font-size: 12px;">
                          ${item.unit && item.unit !== 'Piece' ? item.unit : '-'}
                        </td>
                        <td style="padding: 14px 10px; text-align: right; color: #4B5563; vertical-align: top; font-size: 13px;">${formatNaira(item.price)}</td>
                        <td style="padding: 14px 10px; text-align: right; font-weight: 600; color: #111827; vertical-align: top; font-size: 13px;">${formatNaira(item.price * item.quantity)}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
            
            <!-- Mobile Items List -->
            <div class="mobile-stack" style="display: none;">
              ${receiptData.items.map((item, index) => {
                const customFields = item.customFields ? Object.entries(item.customFields)
                  .filter(([key, value]) => value && value.toString().trim() !== '')
                  .map(([key, value]) => ({
                    key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                    value: value.toString()
                  })) : [];
                
                const categoryIcon = item.category ? getCategoryIcon(item.category) : '';
                const categoryName = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : '';
                
                return `
                  <div class="mobile-item-card">
                    <!-- Item Header -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                      <div style="flex: 1;">
                        <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 5px;">
                          ${categoryIcon ? `<div style="font-size: 16px; flex-shrink: 0;">${categoryIcon}</div>` : ''}
                          <div>
                            <div style="font-weight: 600; color: #111827; font-size: 14px; line-height: 1.2;">${item.name}</div>
                            ${categoryName && categoryName !== 'General' ? `
                              <div class="mobile-category-badge" style="display: inline-block; font-size: 10px; padding: 2px 8px; background: #D1FAE5; color: #065F46; border-radius: 4px; margin-top: 3px; border: 1px solid #A7F3D0; font-weight: 500;">
                                ${categoryName}
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      </div>
                      <div style="text-align: right; flex-shrink: 0;">
                        <div style="font-weight: 700; color: #111827; font-size: 15px;">${formatNaira(item.price * item.quantity)}</div>
                      </div>
                    </div>
                    
                    <!-- Item Details -->
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 10px; font-size: 11px; color: #4B5563;">
                      <div>
                        <span style="font-weight: 600; color: #6B7280;">Quantity:</span> ${item.quantity}
                      </div>
                      <div>
                        <span style="font-weight: 600; color: #6B7280;">Unit:</span> ${item.unit && item.unit !== 'Piece' ? item.unit : 'PCS'}
                      </div>
                      <div style="grid-column: span 2;">
                        <span style="font-weight: 600; color: #6B7280;">Unit Price:</span> ${formatNaira(item.price)}
                      </div>
                    </div>
                    
                    <!-- Item Description -->
                    ${item.description ? `
                      <div style="font-size: 11px; color: #6B7280; margin-bottom: 10px; padding-left: 6px; border-left: 1px solid #E5E7EB; line-height: 1.3;">
                        ${item.description}
                      </div>
                    ` : ''}
                    
                    <!-- Custom Fields -->
                    ${customFields.length > 0 ? `
                      <div style="margin-top: 10px;">
                        <div style="font-size: 10px; font-weight: 600; color: #374151; margin-bottom: 6px; text-transform: uppercase;">
                          Specifications
                        </div>
                        <div class="mobile-custom-fields">
                          ${customFields.map((field) => `
                            <div style="font-size: 10px; padding: 4px; background: #F9FAFB; border-radius: 3px; border: 1px solid #E5E7EB; word-break: break-word;">
                              <div style="font-weight: 600; color: #4B5563; margin-bottom: 1px;">${field.key}</div>
                              <div style="color: #111827;">${field.value}</div>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
         
          
          <!-- Totals -->
          <div style="background: #F9FAFB; padding: 20px; border-radius: 6px; margin: 0 20px 25px 20px; width: calc(100% - 40px); box-sizing: border-box;">
            <div style="max-width: 100%;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
                <span style="color: #4B5563;">Subtotal:</span>
                <span style="font-weight: 500;">${formatNaira(subtotal)}</span>
              </div>
              
              ${receiptData.includeDiscount && receiptData.discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #DC2626; font-size: 13px;">
                  <span>Discount:</span>
                  <span>-${formatNaira(discount)}</span>
                </div>
              ` : ''}
              
              ${deliveryFee > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
                  <span>Delivery Fee:</span>
                  <span>${formatNaira(deliveryFee)}</span>
                </div>
              ` : ''}
              
              ${receiptData.includeVAT ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
                  <span>VAT (${receiptData.vatRate}%):</span>
                  <span>${formatNaira(vat)}</span>
                </div>
              ` : ''}
              
              <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 700; color: #10B981; margin-top: 15px; padding-top: 15px; border-top: 1px solid #E5E7EB;">
                <span>TOTAL AMOUNT:</span>
                <span>${formatNaira(total)}</span>
              </div>
            </div>
          </div>
          
          <!-- Payment -->
          <div style="border: 1px solid #D1D5DB; padding: 20px; border-radius: 6px; margin: 0 20px 25px 20px; width: calc(100% - 40px); box-sizing: border-box;">
            <h3 style="color: #374151; margin-bottom: 15px; font-weight: 600; font-size: 14px;">Payment Details</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 13px;">
              <div>
                <span style="color: #6B7280; display: block; margin-bottom: 3px;">Payment Method:</span>
                <span style="font-weight: 500; display: block;">${receiptData.paymentMethod}</span>
              </div>
              ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
                <div>
                  <span style="color: #6B7280; display: block; margin-bottom: 3px;">Amount Paid:</span>
                  <span style="display: block;">${formatNaira(receiptData.amountPaid)}</span>
                </div>
                <div>
                  <span style="color: #6B7280; display: block; margin-bottom: 3px;">Change Due:</span>
                  <span style="display: block;">${formatNaira(change)}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Complete Details Notice -->
          ${hasCustomFields ? `
            <div style="background: #D1FAE5; padding: 12px; border-radius: 4px; margin: 0 20px 20px 20px; width: calc(100% - 40px); box-sizing: border-box; border: 1px solid #A7F3D0;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="font-size: 14px;">✅</div>
                <div>
                  <div style="color: #065F46; font-size: 12px; font-weight: 600; margin-bottom: 2px;">
                    Complete Professional Details Included
                  </div>
                  <div style="color: #047857; font-size: 11px;">
                    All item specifications and categories professionally documented
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Notes -->
          ${receiptData.customerNotes ? `
            <div style="margin: 0 20px 20px 20px; width: calc(100% - 40px); box-sizing: border-box;">
              <h3 style="color: #374151; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Customer Notes:</h3>
              <p style="color: #6B7280; font-size: 13px; line-height: 1.4; padding: 10px; background: #F9FAFB; border-radius: 4px; word-wrap: break-word;">
                ${receiptData.customerNotes}
              </p>
            </div>
          ` : ''}
          
          <!-- Terms & Conditions -->
          ${receiptData.includeTerms && receiptData.termsAndConditions ? `
            <div style="margin: 0 20px 20px 20px; width: calc(100% - 40px); box-sizing: border-box;">
              <h3 style="color: #374151; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Terms & Conditions:</h3>
              <p style="color: #6B7280; font-size: 12px; line-height: 1.4; white-space: pre-line; padding: 10px; background: #F9FAFB; border-radius: 4px; word-wrap: break-word;">
                ${receiptData.termsAndConditions}
              </p>
            </div>
          ` : ''}
          
          <!-- Signature -->
          ${receiptData.includeSignature ? `
            <div style="margin: 30px 20px; width: calc(100% - 40px); box-sizing: border-box;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;" class="mobile-signature">
                <div style="text-align: center;">
                  <div style="height: 50px; border-bottom: 1px solid #D1D5DB; margin-bottom: 10px; position: relative;">
                    ${receiptData.signatureData ? `
                      <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 40px; max-width: 80%; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);">
                    ` : ''}
                  </div>
                  <div style="color: #6B7280; font-size: 12px; font-weight: 500;">AUTHORIZED SIGNATURE</div>
                  <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px; line-height: 1.2;">
                    ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="height: 50px; border-bottom: 1px solid #D1D5DB; margin-bottom: 10px;"></div>
                  <div style="color: #6B7280; font-size: 12px; font-weight: 500;">Customer Signature</div>
                  <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px;">Date</div>
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Footer -->
          <div style="text-align: center; margin: 40px 20px 20px 20px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px; width: calc(100% - 40px); box-sizing: border-box;">
            <p style="margin: 8px 0; color: #374151; font-weight: 600; line-height: 1.2;"><strong>${receiptData.receiptNumber}</strong></p>
            <p style="margin: 8px 0; line-height: 1.3; word-wrap: break-word;">${receiptData.footerMessage || 'Thank you for your business. We appreciate your patronage.'}</p>
            <p style="margin-top: 20px; font-size: 11px; color: #9CA3AF; line-height: 1.2;">
              Professionally generated • ${new Date().toLocaleDateString()} • ReceipIt
            </p>
          </div>
        </div>
        
        <!-- Mobile Responsive Script -->
        <script>
          // Detect mobile and switch layouts
          function isMobile() {
            return window.innerWidth <= 768;
          }
          
          function updateLayout() {
            const mobileItems = document.querySelector('.mobile-stack');
            const desktopTable = document.querySelector('.mobile-hide');
            
            if (isMobile()) {
              if (mobileItems) mobileItems.style.display = 'block';
              if (desktopTable) desktopTable.style.display = 'none';
            } else {
              if (mobileItems) mobileItems.style.display = 'none';
              if (desktopTable) desktopTable.style.display = 'block';
            }
          }
          
          // Initial check
          document.addEventListener('DOMContentLoaded', updateLayout);
          window.addEventListener('resize', updateLayout);
        </script>
      </body>
      </html>
    `;
  },

elegant: (receiptData, companyLogo, formatNaira, calculations, importantFields) => {
    const { subtotal, discount, vat, total, change, deliveryFee = 0 } = calculations;
    
    // Helper function to get category icon emoji
    const getCategoryIcon = (category) => {
      const icons = {
        electronics: '📱',
        books: '📚',
        agriculture: '🌾',
        clothing: '👕',
        food: '☕',
        services: '✂️',
        liquids: '💧',
        construction: '🏠',
        logistics: '🚚',
        general: '📦'
      };
      return icons[category] || '';
    };

    // Check if there's category data
    const hasCategoryData = receiptData.items?.some(item => item.category && item.category !== 'general');
    const hasCustomFields = receiptData.items?.some(item => item.customFields && Object.keys(item.customFields).length > 0);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          @media (max-width: 768px) {
            .mobile-stack {
              display: block !important;
              width: 100% !important;
            }
            .mobile-hide {
              display: none !important;
            }
            .mobile-full {
              width: 100% !important;
              max-width: 100% !important;
              padding-left: 10px !important;
              padding-right: 10px !important;
            }
            .mobile-text-center {
              text-align: center !important;
            }
            .mobile-padding {
              padding: 15px 10px !important;
            }
            .mobile-block {
              display: block !important;
              margin-bottom: 10px !important;
            }
            .mobile-grid-1 {
              grid-template-columns: 1fr !important;
            }
            .mobile-flex-column {
              flex-direction: column !important;
              align-items: stretch !important;
            }
            .mobile-margin-bottom {
              margin-bottom: 15px !important;
            }
            .mobile-font-sm {
              font-size: 12px !important;
            }
            .mobile-font-xs {
              font-size: 11px !important;
            }
            .mobile-table {
              display: block !important;
              overflow-x: auto !important;
              -webkit-overflow-scrolling: touch !important;
            }
            .mobile-table thead {
              display: none !important;
            }
            .mobile-table tbody, 
            .mobile-table tr, 
            .mobile-table td {
              display: block !important;
              width: 100% !important;
            }
            .mobile-table tr {
              margin-bottom: 15px !important;
              border: 1px solid #E5E7EB !important;
              border-radius: 8px !important;
              padding: 15px !important;
              background: white !important;
            }
            .mobile-table td {
              padding: 8px 0 !important;
              border: none !important;
              text-align: left !important;
            }
            .mobile-table td:before {
              content: attr(data-label);
              font-weight: 600;
              display: block;
              color: #7C3AED;
              font-size: 11px;
              margin-bottom: 3px;
              text-transform: uppercase;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Playfair Display', Georgia, serif; background: #F9FAFB;">
        <div style="max-width: 100%; margin: 0 auto;">
          <!-- watermark -->
          <p style='font-size: 9px; text-align: start; color: #9CA3AF; margin: 15px 20px 5px 20px; font-style: italic; max-width: 100%; overflow-wrap: break-word;'>
            Elegantly crafted by ReceipIt • MayorDev
          </p> 
          
          <!-- Decorative Header -->
          <div style="text-align: center; margin-bottom: 20px; padding: 20px 15px; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; position: relative; width: 100%; box-sizing: border-box;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #F59E0B, #EC4899);"></div>
            ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 40px; max-width: 90%; margin-bottom: 10px; filter: brightness(0) invert(1); opacity: 0.9; display: block; margin-left: auto; margin-right: auto;">` : ''}
            <h1 style="margin: 10px 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; line-height: 1.2; word-wrap: break-word; padding: 0 10px;">${receiptData.storeName}</h1>
            <p style="margin: 5px 0; opacity: 0.9; font-size: 13px; font-style: italic; line-height: 1.3; padding: 0 10px; word-wrap: break-word;">${receiptData.storeAddress}</p>
            <p style="margin: 5px 0; opacity: 0.9; font-size: 12px; line-height: 1.3; padding: 0 10px; word-wrap: break-word;">Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• ${receiptData.storeEmail}` : ''}</p>
            ${receiptData.tinNumber ? `<p style="margin: 5px 0; opacity: 0.9; font-size: 12px; line-height: 1.3; padding: 0 10px; word-wrap: break-word;">TIN: ${receiptData.tinNumber}</p>` : ''}
            
            <!-- Elegant Category Notice -->
            ${hasCategoryData ? `
              <div style="margin-top: 10px; display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.15); border-radius: 12px; border: 1px solid rgba(255,255,255,0.3); max-width: 90%;">
                <span style="font-size: 11px; opacity: 0.9; font-style: italic; word-wrap: break-word;">📋 Detailed specification receipt</span>
              </div>
            ` : ''}
          </div>
          
          <!-- Receipt Details -->
          <div style="padding: 0 15px; box-sizing: border-box; width: 100%;">
            <!-- Document Info - Responsive Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px dashed #E5E7EB; width: 100%;">
              <div style="text-align: center;">
                <div style="color: #8B5CF6; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 0.5px; word-wrap: break-word;">${receiptData.receiptType} Number</div>
                <div style="font-size: 16px; font-weight: 700; color: #111827; line-height: 1.2; word-wrap: break-word;">${receiptData.receiptNumber}</div>
                ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? `
                  <div style="color: #6B7280; font-size: 11px; margin-top: 3px; font-style: italic; line-height: 1.2; word-wrap: break-word;">Invoice: ${receiptData.invoiceNumber}</div>
                ` : ''}
                ${receiptData.poNumber ? `<div style="color: #6B7280; font-size: 11px; margin-top: 3px; font-style: italic; line-height: 1.2; word-wrap: break-word;">PO: ${receiptData.poNumber}</div>` : ''}
              </div>
              <div style="text-align: center;">
                <div style="color: #8B5CF6; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 0.5px; word-wrap: break-word;">Date & Time</div>
                <div style="font-size: 13px; color: #4B5563; font-weight: 500; line-height: 1.2; word-wrap: break-word;">${receiptData.date}</div>
                <div style="font-size: 13px; color: #4B5563; font-weight: 500; line-height: 1.2; word-wrap: break-word;">${receiptData.time}</div>
                ${receiptData.dueDate ? `<div style="color: #7C3AED; font-size: 11px; margin-top: 3px; font-weight: 600; line-height: 1.2; word-wrap: break-word;">Due: ${receiptData.dueDate}</div>` : ''}
              </div>
              <div style="text-align: center;">
                <div style="color: #8B5CF6; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 0.5px; word-wrap: break-word;">Details</div>
                <div style="font-size: 13px; color: #4B5563; font-weight: 500; line-height: 1.2; word-wrap: break-word;">Cashier: ${receiptData.cashierName}</div>
                ${receiptData.rcNumber ? `<div style="font-size: 11px; color: #6B7280; margin-top: 3px; font-style: italic; line-height: 1.2; word-wrap: break-word;">RC: ${receiptData.rcNumber}</div>` : ''}
              </div>
            </div>
            
            <!-- Customer Info -->
            ${receiptData.includeBillTo && receiptData.billToName ? `
              <div style="background: linear-gradient(135deg, #F3E8FF, #E9D5FF); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #8B5CF6; width: 100%; box-sizing: border-box; word-wrap: break-word;">
                <h3 style="color: #7C3AED; font-size: 14px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">BILL TO</h3>
                <p style="color: #111827; margin: 4px 0; font-weight: 500; font-size: 14px; line-height: 1.3;">${receiptData.billToName}</p>
                ${receiptData.billToAddress ? `<p style="color: #6B7280; margin: 4px 0; font-size: 12px; font-style: italic; line-height: 1.3;">${receiptData.billToAddress}</p>` : ''}
                ${receiptData.billToPhone ? `<p style="color: #6B7280; margin: 4px 0; font-size: 12px; font-style: italic; line-height: 1.3;">Tel: ${receiptData.billToPhone}</p>` : ''}
              </div>
            ` : ''}
            
            <!-- Items Section with Mobile Responsive Table -->
            <div style="margin-bottom: 25px; width: 100%; overflow: hidden;">
              <div style="color: #7C3AED; font-size: 16px; font-weight: 600; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">Items Purchased</div>
              
              <!-- Desktop Table -->
              <table style="width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; display: table;" class="mobile-hide">
                <thead>
                  <tr>
                    <th style="padding: 12px 8px; text-align: left; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED; font-size: 12px;">Item Description</th>
                    <th style="padding: 12px 8px; text-align: center; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED; font-size: 12px;">Qty</th>
                    <th style="padding: 12px 8px; text-align: center; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED; font-size: 12px;">Unit</th>
                    <th style="padding: 12px 8px; text-align: right; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED; font-size: 12px;">Price</th>
                    <th style="padding: 12px 8px; text-align: right; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED; font-size: 12px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${receiptData.items.map((item, index) => {
                    // Format ALL custom fields for display
                    const customFields = item.customFields ? Object.entries(item.customFields)
                      .filter(([key, value]) => value && value.toString().trim() !== '')
                      .map(([key, value]) => ({
                        key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                        value: value.toString()
                      })) : [];
                    
                    // Get category icon
                    const categoryIcon = item.category ? getCategoryIcon(item.category) : '';
                    const categoryName = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : '';
                    
                    return `
                      <tr>
                        <td style="padding: 15px 8px; border-bottom: 1px solid #E5E7EB; color: #111827; vertical-align: top;">
                          <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
                            ${categoryIcon ? `<div style="font-size: 14px; flex-shrink: 0;">${categoryIcon}</div>` : ''}
                            <div style="flex: 1; min-width: 0;">
                              <div style="font-weight: 500; margin-bottom: 4px; font-size: 14px; word-wrap: break-word;">${item.name}</div>
                              
                              <!-- Elegant Category Display -->
                              ${categoryName && categoryName !== 'General' ? `
                                <div style="display: inline-block; font-size: 10px; padding: 2px 8px; background: #F5F3FF; color: #7C3AED; border-radius: 10px; margin-bottom: 6px; border: 1px solid #DDD6FE; font-style: italic; word-wrap: break-word;">
                                  ${categoryName}
                                </div>
                              ` : ''}
                            </div>
                          </div>
                          
                          <!-- Item Description -->
                          ${item.description ? `
                            <div style="font-size: 12px; color: #6B7280; font-style: italic; margin-top: 4px; padding-left: 8px; border-left: 1px dashed #DDD6FE; line-height: 1.3; word-wrap: break-word;">
                              ${item.description}
                            </div>
                          ` : ''}
                          
                          <!-- Elegant Custom Fields Display -->
                          ${customFields.length > 0 ? `
                            <div style="margin-top: 8px; padding: 8px; background: #FAF9FF; border-radius: 4px; border: 1px dashed #DDD6FE; word-wrap: break-word;">
                              <div style="font-size: 10px; font-weight: 600; color: #7C3AED; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px;">
                                Specifications
                              </div>
                              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                ${customFields.map((field) => `
                                  <div style="flex: 1 1 calc(33.333% - 6px); min-width: 120px; font-size: 10px; padding: 6px; background: white; border-radius: 3px; border: 1px solid #E5E7EB; word-break: break-word;">
                                    <div style="font-weight: 600; color: #6B7280; margin-bottom: 2px; font-size: 9px; text-transform: uppercase;">${field.key}</div>
                                    <div style="color: #111827; font-weight: 500; font-size: 11px;">${field.value}</div>
                                  </div>
                                `).join('')}
                              </div>
                            </div>
                          ` : ''}
                        </td>
                        <td style="padding: 15px 8px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #4B5563; font-weight: 500; vertical-align: top; font-size: 13px;">${item.quantity}</td>
                        <td style="padding: 15px 8px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #4B5563; font-style: italic; vertical-align: top; font-size: 12px;">
                          ${item.unit && item.unit !== 'Piece' ? item.unit : '-'}
                        </td>
                        <td style="padding: 15px 8px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #4B5563; font-weight: 500; vertical-align: top; font-size: 13px;">${formatNaira(item.price)}</td>
                        <td style="padding: 15px 8px; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: 600; color: #111827; font-size: 14px; vertical-align: top;">${formatNaira(item.price * item.quantity)}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
              
              <!-- Mobile Items List -->
              <div style="display: none;" class="mobile-stack">
                ${receiptData.items.map((item, index) => {
                  const customFields = item.customFields ? Object.entries(item.customFields)
                    .filter(([key, value]) => value && value.toString().trim() !== '')
                    .map(([key, value]) => ({
                      key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                      value: value.toString()
                    })) : [];
                  
                  const categoryIcon = item.category ? getCategoryIcon(item.category) : '';
                  const categoryName = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : '';
                  
                  return `
                    <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 15px; margin-bottom: 15px; word-wrap: break-word;">
                      <!-- Item Header -->
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div style="flex: 1;">
                          <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 5px;">
                            ${categoryIcon ? `<div style="font-size: 16px; flex-shrink: 0;">${categoryIcon}</div>` : ''}
                            <div>
                              <div style="font-weight: 600; color: #111827; font-size: 14px; margin-bottom: 3px; line-height: 1.2;">${item.name}</div>
                              ${categoryName && categoryName !== 'General' ? `
                                <div style="display: inline-block; font-size: 10px; padding: 2px 8px; background: #F5F3FF; color: #7C3AED; border-radius: 10px; margin-bottom: 5px; border: 1px solid #DDD6FE; font-style: italic;">
                                  ${categoryName}
                                </div>
                              ` : ''}
                            </div>
                          </div>
                        </div>
                        <div style="text-align: right; flex-shrink: 0;">
                          <div style="font-weight: 700; color: #111827; font-size: 15px;">${formatNaira(item.price * item.quantity)}</div>
                        </div>
                      </div>
                      
                      <!-- Item Details -->
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px; font-size: 12px; color: #4B5563;">
                        <div>
                          <span style="font-weight: 600; color: #6B7280;">Quantity:</span> ${item.quantity}
                        </div>
                        <div>
                          <span style="font-weight: 600; color: #6B7280;">Unit:</span> ${item.unit && item.unit !== 'Piece' ? item.unit : 'PCS'}
                        </div>
                        <div style="grid-column: span 2;">
                          <span style="font-weight: 600; color: #6B7280;">Price:</span> ${formatNaira(item.price)} each
                        </div>
                      </div>
                      
                      <!-- Item Description -->
                      ${item.description ? `
                        <div style="font-size: 12px; color: #6B7280; font-style: italic; margin-bottom: 10px; padding-left: 8px; border-left: 1px dashed #DDD6FE; line-height: 1.3;">
                          ${item.description}
                        </div>
                      ` : ''}
                      
                      <!-- Custom Fields -->
                      ${customFields.length > 0 ? `
                        <div style="margin-top: 10px; padding: 10px; background: #FAF9FF; border-radius: 6px; border: 1px dashed #DDD6FE;">
                          <div style="font-size: 11px; font-weight: 600; color: #7C3AED; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.3px;">
                            Specifications
                          </div>
                          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;">
                            ${customFields.map((field) => `
                              <div style="font-size: 10px; padding: 6px; background: white; border-radius: 4px; border: 1px solid #E5E7EB; word-break: break-word;">
                                <div style="font-weight: 600; color: #6B7280; margin-bottom: 2px; font-size: 9px; text-transform: uppercase;">${field.key}</div>
                                <div style="color: #111827; font-weight: 500; font-size: 11px;">${field.value}</div>
                              </div>
                            `).join('')}
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            
           
            <!-- Totals in Elegant Box -->
            <div style="background: white; border: 2px solid #8B5CF6; border-radius: 8px; padding: 20px; margin-bottom: 25px; position: relative; width: 100%; box-sizing: border-box;">
              <div style="position: absolute; top: -12px; left: 20px; background: #8B5CF6; color: white; padding: 6px 15px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; max-width: calc(100% - 40px); word-wrap: break-word;">
                AMOUNT DUE
              </div>
              <div style="max-width: 100%;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #E5E7EB;">
                  <span style="color: #4B5563; font-weight: 500; font-size: 13px;">Subtotal</span>
                  <span style="font-weight: 500; font-size: 13px;">${formatNaira(subtotal)}</span>
                </div>
                
                ${receiptData.includeDiscount && receiptData.discount > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #E5E7EB; color: #DC2626;">
                    <span style="font-weight: 500; font-size: 13px;">Discount</span>
                    <span style="font-weight: 500; font-size: 13px;">-${formatNaira(discount)}</span>
                  </div>
                ` : ''}
                
                ${deliveryFee > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #E5E7EB;">
                    <span style="color: #4B5563; font-weight: 500; font-size: 13px;">Delivery Fee</span>
                    <span style="font-weight: 500; font-size: 13px;">${formatNaira(deliveryFee)}</span>
                  </div>
                ` : ''}
                
                ${receiptData.includeVAT ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #E5E7EB;">
                    <span style="color: #4B5563; font-weight: 500; font-size: 13px;">VAT (${receiptData.vatRate}%)</span>
                    <span style="font-weight: 500; font-size: 13px;">${formatNaira(vat)}</span>
                  </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: #8B5CF6; margin-top: 15px; padding-top: 15px; border-top: 2px solid #8B5CF6; font-family: 'Playfair Display', serif; line-height: 1.2;">
                  <span>Grand Total</span>
                  <span>${formatNaira(total)}</span>
                </div>
              </div>
            </div>
            
            <!-- Payment -->
            <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #F59E0B; width: 100%; box-sizing: border-box;">
              <div style="display: flex; align-items: center; margin-bottom: 10px; flex-wrap: wrap;">
                <div style="width: 8px; height: 8px; background: #92400E; border-radius: 50%; margin-right: 8px; flex-shrink: 0;"></div>
                <h3 style="color: #92400E; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 14px; line-height: 1.2; word-wrap: break-word;">Payment Method: ${receiptData.paymentMethod}</h3>
              </div>
              ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 15px; margin-top: 15px;">
                  <div>
                    <div style="color: #92400E; font-size: 11px; font-weight: 500;">Amount Paid</div>
                    <div style="font-weight: 600; font-size: 15px; color: #111827; font-family: 'Playfair Display', serif; line-height: 1.2;">${formatNaira(receiptData.amountPaid)}</div>
                  </div>
                  <div>
                    <div style="color: #92400E; font-size: 11px; font-weight: 500;">Change</div>
                    <div style="font-weight: 600; font-size: 15px; color: #111827; font-family: 'Playfair Display', serif; line-height: 1.2;">${formatNaira(change)}</div>
                  </div>
                </div>
              ` : ''}
            </div>
            
            <!-- Complete Details Notice -->
            ${hasCustomFields ? `
              <div style="background: linear-gradient(135deg, #F5F3FF, #EDE9FE); padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #DDD6FE; width: 100%; box-sizing: border-box;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <div style="font-size: 16px; flex-shrink: 0;">✅</div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="color: #7C3AED; font-size: 13px; font-weight: 600; margin-bottom: 3px; font-family: 'Playfair Display', serif; line-height: 1.2; word-wrap: break-word;">
                      Complete Specifications Included
                    </div>
                    <div style="color: #6B7280; font-size: 11px; font-style: italic; line-height: 1.2; word-wrap: break-word;">
                      All item details and specifications elegantly presented above
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}
            
            <!-- Notes -->
            ${receiptData.customerNotes ? `
              <div style="background: #F5F3FF; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid #8B5CF6; width: 100%; box-sizing: border-box; word-wrap: break-word;">
                <h3 style="color: #7C3AED; font-size: 13px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Notes</h3>
                <p style="color: #6B7280; font-size: 12px; line-height: 1.4; font-style: italic; font-family: 'Playfair Display', serif;">"${receiptData.customerNotes}"</p>
              </div>
            ` : ''}
            
            <!-- Terms & Conditions -->
            ${receiptData.includeTerms && receiptData.termsAndConditions ? `
              <div style="border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; margin-bottom: 15px; background: white; width: 100%; box-sizing: border-box; word-wrap: break-word;">
                <h3 style="color: #4B5563; font-size: 13px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Terms & Conditions</h3>
                <p style="color: #6B7280; font-size: 11px; line-height: 1.4; white-space: pre-line; font-style: italic; word-wrap: break-word;">${receiptData.termsAndConditions}</p>
              </div>
            ` : ''}
            
            <!-- Signature -->
            ${receiptData.includeSignature ? `
              <div style="margin: 30px 0; width: 100%;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                  <div style="text-align: center;">
                    <div style="height: 50px; border-bottom: 2px solid #7C3AED; margin-bottom: 10px; position: relative;">
                      ${receiptData.signatureData ? `
                        <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 40px; max-width: 80%; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);">
                      ` : ''}
                    </div>
                    <div style="color: #7C3AED; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">AUTHORIZED SIGNATURE</div>
                    <div style="color: #9CA3AF; font-size: 10px; margin-top: 5px; font-style: italic; line-height: 1.2;">
                      ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div style="text-align: center;">
                    <div style="height: 50px; border-bottom: 2px solid #7C3AED; margin-bottom: 10px;"></div>
                    <div style="color: #7C3AED; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Customer</div>
                    <div style="color: #9CA3AF; font-size: 10px; margin-top: 5px; font-style: italic;">Date</div>
                  </div>
                </div>
              </div>
            ` : ''}
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 3px double #8B5CF6; color: #6B7280; font-size: 12px; width: 100%; box-sizing: border-box;">
              <p style="margin: 10px 0; font-style: italic; font-family: 'Playfair Display', serif; font-size: 14px; line-height: 1.3; word-wrap: break-word;">"${receiptData.footerMessage || 'Thank you for your gracious patronage.'}"</p>
              <p style="margin: 15px 0; color: #374151; font-weight: 500; font-size: 13px; line-height: 1.2; word-wrap: break-word;">${receiptData.receiptNumber}</p>
              <p style="margin-top: 15px; font-size: 11px; color: #9CA3AF; font-style: italic; line-height: 1.2; word-wrap: break-word;">
                Elegantly crafted • ${new Date().toLocaleDateString()} • ReceipIt
              </p>
            </div>
          </div>
        </div>
        
        <!-- Mobile Responsive Script -->
        <script>
          // Detect mobile and switch layouts
          function isMobile() {
            return window.innerWidth <= 768;
          }
          
          function updateLayout() {
            const mobileItems = document.querySelector('.mobile-stack');
            const desktopTable = document.querySelector('.mobile-hide');
            
            if (isMobile()) {
              if (mobileItems) mobileItems.style.display = 'block';
              if (desktopTable) desktopTable.style.display = 'none';
            } else {
              if (mobileItems) mobileItems.style.display = 'none';
              if (desktopTable) desktopTable.style.display = 'table';
            }
          }
          
          // Initial check
          document.addEventListener('DOMContentLoaded', updateLayout);
          window.addEventListener('resize', updateLayout);
        </script>
      </body>
      </html>
    `;
  },

 minimal: (receiptData, companyLogo, formatNaira, calculations, importantFields) => {
    const { subtotal, discount, vat, total, change, deliveryFee = 0 } = calculations;
    
    // Helper function to get category icon emoji
    const getCategoryIcon = (category) => {
      const icons = {
        electronics: '📱',
        books: '📚',
        agriculture: '🌾',
        clothing: '👕',
        food: '☕',
        services: '✂️',
        liquids: '💧',
        construction: '🏠',
        logistics: '🚚',
        general: '📦'
      };
      return icons[category] || '';
    };

    // Check if there's category data
    const hasCategoryData = receiptData.items?.some(item => item.category && item.category !== 'general');
    const hasCustomFields = receiptData.items?.some(item => item.customFields && Object.keys(item.customFields).length > 0);
    
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 210mm; margin: 0 auto; padding: 20px;">
        <!-- watermark -->
        <p style='font-size: 9px; text-align: start; color: #9CA3AF; margin-bottom: 15px;'>
          Generated by ReceipIt • MayorDev
        </p> 
        
        <!-- Simple Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 40px; margin-bottom: 10px; opacity: 0.8;">` : ''}
          <h1 style="color: #111827; margin: 5px 0; font-size: 18px; font-weight: 400;">${receiptData.storeName}</h1>
          <p style="color: #6B7280; margin: 3px 0; font-size: 12px;">${receiptData.storeAddress}</p>
          <p style="color: #6B7280; margin: 3px 0; font-size: 12px;">Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• ${receiptData.storeEmail}` : ''}</p>
          ${receiptData.tinNumber ? `<p style="color: #6B7280; margin: 3px 0; font-size: 11px; font-weight: 600;">TIN: ${receiptData.tinNumber}</p>` : ''}
          ${receiptData.rcNumber ? `<p style="color: #6B7280; margin: 3px 0; font-size: 11px;">RC: ${receiptData.rcNumber}</p>` : ''}
          
          <!-- Minimal Category Notice -->
          ${hasCategoryData ? `
            <div style="margin-top: 10px; padding: 3px 8px; background: #F3F4F6; border-radius: 3px; display: inline-block;">
              <span style="font-size: 10px; color: #6B7280;">📋 Detailed receipt</span>
            </div>
          ` : ''}
        </div>
        
        <!-- Simple Info -->
        <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #F3F4F6;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6B7280;">
            <span>${receiptData.receiptType} #${receiptData.receiptNumber}</span>
            <span>${receiptData.date}</span>
          </div>
          ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? `
            <div style="font-size: 12px; color: #6B7280; margin-top: 5px;">
              Invoice #: ${receiptData.invoiceNumber}
            </div>
          ` : ''}
          ${receiptData.poNumber ? `<div style="font-size: 12px; color: #6B7280; margin-top: 5px;">PO #: ${receiptData.poNumber}</div>` : ''}
          ${receiptData.dueDate ? `<div style="font-size: 12px; color: #6B7280; margin-top: 5px;">Due: ${receiptData.dueDate}</div>` : ''}
          <div style="font-size: 12px; color: #6B7280; margin-top: 5px;">
            Cashier: ${receiptData.cashierName} • ${receiptData.time}
          </div>
        </div>
        
        <!-- Customer Info -->
        ${receiptData.includeBillTo && receiptData.billToName ? `
          <div style="margin-bottom: 20px; padding: 10px; background: #F9FAFB; border-radius: 4px;">
            <div style="font-size: 12px; font-weight: 600; color: #4B5563; margin-bottom: 5px;">Bill To:</div>
            <div style="font-size: 12px;">${receiptData.billToName}</div>
            ${receiptData.billToAddress ? `<div style="font-size: 11px; color: #6B7280;">${receiptData.billToAddress}</div>` : ''}
            ${receiptData.billToPhone ? `<div style="font-size: 11px; color: #6B7280;">Tel: ${receiptData.billToPhone}</div>` : ''}
          </div>
        ` : ''}
        
        <!-- Simple Items with Category Data -->
        <div style="margin-bottom: 25px;">
          ${receiptData.items.map((item, index) => {
            // Format ALL custom fields for display
            const customFields = item.customFields ? Object.entries(item.customFields)
              .filter(([key, value]) => value && value.toString().trim() !== '')
              .map(([key, value]) => ({
                key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                value: value.toString()
              })) : [];
            
            // Get category icon
            const categoryIcon = item.category ? getCategoryIcon(item.category) : '';
            const categoryName = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : '';
            
            return `
              <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #F3F4F6;">
                <!-- Main Item Row -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: flex-start; gap: 6px;">
                      ${categoryIcon ? `<div style="font-size: 12px; flex-shrink: 0;">${categoryIcon}</div>` : ''}
                      <div>
                        <div style="font-size: 13px; color: #111827;">${item.name}</div>
                        
                        <!-- Minimal Category Display -->
                        ${categoryName && categoryName !== 'General' ? `
                          <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">
                            [${categoryName}]
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                  <div style="font-size: 13px; font-weight: 500; color: #111827; text-align: right;">
                    ${formatNaira(item.price * item.quantity)}
                  </div>
                </div>
                
                <!-- Item Details -->
                <div style="font-size: 11px; color: #6B7280; margin: 3px 0 5px 0;">
                  ${item.quantity} × ${formatNaira(item.price)}
                  ${item.unit && item.unit !== 'Piece' ? ` (${item.unit})` : ''}
                </div>
                
                <!-- Item Description -->
                ${item.description ? `
                  <div style="font-size: 11px; color: #4B5563; margin: 5px 0; padding-left: 8px; border-left: 1px solid #E5E7EB;">
                    ${item.description}
                  </div>
                ` : ''}
                
                <!-- Minimal Custom Fields -->
                ${customFields.length > 0 ? `
                  <div style="margin-top: 8px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                      ${customFields.map((field) => `
                        <div style="font-size: 9px; padding: 2px 5px; background: #F3F4F6; color: #4B5563; border-radius: 2px; border: 1px solid #E5E7EB; word-break: break-word; max-width: 100%;">
                          <span style="font-weight: 600;">${field.key}:</span> ${field.value}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
        
      
        
        <!-- Simple Totals -->
        <div style="margin-bottom: 25px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #6B7280;">
            <span>Subtotal</span>
            <span>${formatNaira(subtotal)}</span>
          </div>
          
          ${receiptData.includeDiscount && receiptData.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #DC2626;">
              <span>Discount</span>
              <span>-${formatNaira(discount)}</span>
            </div>
          ` : ''}
          
          ${deliveryFee > 0 ? `
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #6B7280;">
              <span>Delivery Fee</span>
              <span>${formatNaira(deliveryFee)}</span>
            </div>
          ` : ''}
          
          ${receiptData.includeVAT ? `
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #6B7280;">
              <span>VAT (${receiptData.vatRate}%)</span>
              <span>${formatNaira(vat)}</span>
            </div>
          ` : ''}
          
          <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 600; margin-top: 15px; padding-top: 15px; border-top: 1px solid #E5E7EB; color: #111827;">
            <span>Total</span>
            <span>${formatNaira(total)}</span>
          </div>
        </div>
        
        <!-- Simple Payment -->
        <div style="font-size: 12px; color: #6B7280; margin-bottom: 25px;">
          <div style="margin-bottom: 3px;">Payment: ${receiptData.paymentMethod}</div>
          ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
            <div style="margin-top: 5px;">
              <div style="margin-bottom: 2px;">Paid: ${formatNaira(receiptData.amountPaid)}</div>
              <div>Change: ${formatNaira(change)}</div>
            </div>
          ` : ''}
        </div>
        
        <!-- Complete Details Notice -->
        ${hasCustomFields ? `
          <div style="margin-bottom: 20px; padding: 8px; background: #F3F4F6; border-radius: 3px; border: 1px solid #E5E7EB;">
            <div style="font-size: 10px; color: #4B5563; text-align: center;">
              ✅ Complete item details included
            </div>
          </div>
        ` : ''}
        
        <!-- Notes -->
        ${receiptData.customerNotes ? `
          <div style="font-size: 11px; color: #6B7280; margin-bottom: 15px; padding: 10px; background: #F9FAFB; border-radius: 4px;">
            <div style="font-weight: 600; color: #4B5563; margin-bottom: 3px;">Note:</div>
            <div>${receiptData.customerNotes}</div>
          </div>
        ` : ''}
        
        <!-- Terms & Conditions -->
        ${receiptData.includeTerms && receiptData.termsAndConditions ? `
          <div style="font-size: 10px; color: #6B7280; margin-bottom: 15px; padding: 10px; background: #F3F4F6; border-radius: 4px;">
            <div style="font-weight: 600; color: #4B5563; margin-bottom: 3px;">Terms:</div>
            <div>${receiptData.termsAndConditions}</div>
          </div>
        ` : ''}
        
        <!-- Signature -->
        ${receiptData.includeSignature ? `
          <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <div style="text-align: center;">
              <div style="height: 40px; border-bottom: 1px solid #9CA3AF; margin-bottom: 10px; position: relative;">
                ${receiptData.signatureData ? `
                  <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 30px; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); opacity: 0.8;">
                ` : ''}
              </div>
              <div style="font-size: 11px; color: #6B7280;">Customer</div>
              <div style="font-size: 10px; color: #9CA3AF; margin-top: 5px;">
                ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        ` : ''}
        
        <!-- Simple Footer -->
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #F3F4F6; color: #9CA3AF; font-size: 11px;">
          <div style="margin-bottom: 10px; font-weight: 600; color: #6B7280;">${receiptData.receiptNumber}</div>
          <div>${receiptData.footerMessage || 'Thank you for your business'}</div>
          <div style="margin-top: 10px; font-size: 10px;">
            Generated ${new Date().toLocaleDateString()} • ReceipIt
          </div>
        </div>
      </div>
    `;
  },

 bold: (receiptData, companyLogo, formatNaira, calculations, importantFields) => {
    const { subtotal, discount, vat, total, change, deliveryFee = 0 } = calculations;
    
    // Helper function to get category icon emoji
    const getCategoryIcon = (category) => {
      const icons = {
        electronics: '📱',
        books: '📚',
        agriculture: '🌾',
        clothing: '👕',
        food: '☕',
        services: '✂️',
        liquids: '💧',
        construction: '🏠',
        logistics: '🚚',
        general: '📦'
      };
      return icons[category] || icons.general;
    };

    // Check if there's category data
    const hasCategoryData = receiptData.items?.some(item => item.category && item.category !== 'general');
    const hasCustomFields = receiptData.items?.some(item => item.customFields && Object.keys(item.customFields).length > 0);
    
    return `
      <div style="font-family: 'Montserrat', sans-serif; max-width: 210mm; margin: 0 auto;">
        <!-- watermark -->
        <p style='font-size: 9px; text-align: start; color: #9CA3AF; margin-bottom: 5px; padding: 0 20px;'>
          This Receipt was Generated by ReceipIt. Built by MayorDev
        </p> 
        
        <!-- Bold Header -->
        <div style="background: #EF4444; color: white; padding: 30px; text-align: center; margin-bottom: 30px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 60px; margin-bottom: 15px; filter: brightness(0) invert(1);">` : ''}
          <h1 style="margin: 10px 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">${receiptData.storeName}</h1>
          <p style="margin: 5px 0; opacity: 0.9; font-weight: 500;">${receiptData.storeAddress}</p>
          <p style="margin: 5px 0; opacity: 0.9;">Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• ${receiptData.storeEmail}` : ''}</p>
          ${receiptData.tinNumber ? `<p style="margin: 5px 0; opacity: 0.9; font-weight: 600;">TIN: ${receiptData.tinNumber}</p>` : ''}
          ${receiptData.rcNumber ? `<p style="margin: 5px 0; opacity: 0.9;">RC: ${receiptData.rcNumber}</p>` : ''}
          
          <!-- Category Badge -->
          ${hasCategoryData ? `
            <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; margin-top: 10px; font-size: 11px; font-weight: 600;">
              📋 DETAILED RECEIPT
            </div>
          ` : ''}
        </div>
        
        <!-- Bold Info -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 30px; padding: 0 20px;">
          <div style="text-align: center;">
            <div style="color: #DC2626; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">Receipt No.</div>
            <div style="font-size: 18px; font-weight: 800; color: #111827;">${receiptData.receiptNumber}</div>
            ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? `
              <div style="color: #6B7280; font-size: 12px; margin-top: 3px;">Inv: ${receiptData.invoiceNumber}</div>
            ` : ''}
            ${receiptData.poNumber ? `<div style="color: #6B7280; font-size: 12px; margin-top: 3px;">PO: ${receiptData.poNumber}</div>` : ''}
          </div>
          <div style="text-align: center;">
            <div style="color: #DC2626; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">Date</div>
            <div style="font-size: 14px; font-weight: 600; color: #374151;">${receiptData.date}</div>
            <div style="font-size: 12px; color: #6B7280; margin-top: 3px;">${receiptData.time}</div>
            ${receiptData.dueDate ? `<div style="color: #EF4444; font-size: 12px; font-weight: 600; margin-top: 3px;">Due: ${receiptData.dueDate}</div>` : ''}
          </div>
          <div style="text-align: center;">
            <div style="color: #DC2626; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">Cashier</div>
            <div style="font-size: 14px; font-weight: 600; color: #374151;">${receiptData.cashierName}</div>
            <div style="font-size: 12px; color: #6B7280; margin-top: 3px;">${receiptData.receiptType.toUpperCase()}</div>
          </div>
        </div>
        
        <!-- Customer Info -->
        ${receiptData.includeBillTo && receiptData.billToName ? `
          <div style="background: #FEE2E2; padding: 20px; margin: 0 20px 25px 20px; border-radius: 10px; border: 2px solid #EF4444;">
            <div style="color: #DC2626; font-size: 14px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase;">BILL TO</div>
            <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 5px;">${receiptData.billToName}</div>
            ${receiptData.billToAddress ? `<div style="font-size: 13px; color: #6B7280; margin-bottom: 3px;">${receiptData.billToAddress}</div>` : ''}
            ${receiptData.billToPhone ? `<div style="font-size: 13px; color: #6B7280;">Tel: ${receiptData.billToPhone}</div>` : ''}
          </div>
        ` : ''}
        
        <!-- Bold Items -->
        <div style="padding: 0 20px;">
          <div style="background: #FEE2E2; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
            <div style="display: flex; align-items: center; margin-bottom: 25px;">
              <div style="width: 20px; height: 4px; background: #EF4444; margin-right: 15px;"></div>
              <div style="color: #DC2626; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">ITEMS PURCHASED</div>
              <div style="width: 20px; height: 4px; background: #EF4444; margin-left: 15px; flex-grow: 1;"></div>
            </div>
            
            ${receiptData.items.map((item, index) => {
              // Format ALL custom fields for display
              const customFields = item.customFields ? Object.entries(item.customFields)
                .filter(([key, value]) => value && value.toString().trim() !== '')
                .map(([key, value]) => ({
                  key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                  value: value.toString()
                })) : [];
              
              // Get category icon
              const categoryIcon = item.category ? getCategoryIcon(item.category) : '';
              const categoryName = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : '';
              
              return `
                <!-- Item Block -->
                <div style="margin-bottom: ${customFields.length > 0 ? '20px' : '15px'}; padding-bottom: ${customFields.length > 0 ? '20px' : '15px'}; border-bottom: 2px solid #FECACA; page-break-inside: avoid;">
                  <!-- Main Item Row -->
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
                    <div style="flex: 1; min-width: 200px;">
                      <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 6px;">
                        <div style="font-size: 16px; flex-shrink: 0;">${categoryIcon}</div>
                        <div>
                          <div style="font-size: 15px; font-weight: 800; color: #111827; margin-bottom: 3px;">${item.name}</div>
                          
                          <!-- Category Display -->
                          ${categoryName && categoryName !== 'General' ? `
                            <div style="display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; background: rgba(239, 68, 68, 0.1); color: #DC2626; border-radius: 3px; margin-bottom: 6px; border: 1px solid #FCA5A5;">
                              ${categoryName}
                            </div>
                          ` : ''}
                        </div>
                      </div>
                      
                      <!-- Item Details -->
                      <div style="font-size: 12px; color: #6B7280; display: flex; flex-wrap: wrap; gap: 12px; margin-top: 5px;">
                        <div style="font-weight: 600;">
                          Qty: <span style="color: #111827; font-weight: 800;">${item.quantity}</span>
                        </div>
                        ${item.unit && item.unit !== 'Piece' ? `
                          <div style="font-weight: 600;">
                            Unit: <span style="color: #111827; font-weight: 800;">${item.unit}</span>
                          </div>
                        ` : ''}
                        <div style="font-weight: 600;">
                          Price: <span style="color: #111827; font-weight: 800;">${formatNaira(item.price)}</span>
                        </div>
                      </div>
                      
                      <!-- Item Description -->
                      ${item.description ? `
                        <div style="font-size: 12px; color: #4B5563; margin-top: 8px; padding: 6px 10px; background: rgba(255,255,255,0.7); border-radius: 4px; border-left: 3px solid #DC2626;">
                          ${item.description}
                        </div>
                      ` : ''}
                    </div>
                    
                    <!-- Amount -->
                    <div style="text-align: right; flex-shrink: 0;">
                      <div style="font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 3px;">${formatNaira(item.price * item.quantity)}</div>
                      <div style="font-size: 11px; color: #6B7280; font-weight: 600;">
                        ${formatNaira(item.price)} × ${item.quantity}
                      </div>
                    </div>
                  </div>
                  
                  <!-- ALL Custom Fields - Responsive Display -->
                  ${customFields.length > 0 ? `
                    <div style="margin-top: 12px; padding: 12px; background: white; border-radius: 8px; border: 2px solid #FCA5A5;">
                      <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <div style="width: 12px; height: 12px; background: #DC2626; border-radius: 50%; margin-right: 8px;"></div>
                        <div style="color: #DC2626; font-size: 12px; font-weight: 800; text-transform: uppercase;">Item Specifications:</div>
                      </div>
                      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${customFields.map((field) => `
                          <div style="flex: 1 1 calc(50% - 10px); min-width: 180px; font-size: 11px; padding: 8px; background: #FEF2F2; border-radius: 5px; border: 1px solid #FECACA; word-break: break-word;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                              <div style="font-weight: 700; color: #7F1D1D; text-transform: uppercase; font-size: 10px;">${field.key}</div>
                              <div style="width: 6px; height: 6px; background: #DC2626; border-radius: 50%;"></div>
                            </div>
                            <div style="font-weight: 800; color: #111827; font-size: 12px;">${field.value}</div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
          
          
          
          <!-- Bold Totals -->
          <div style="background: #111827; color: white; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
            <div style="display: flex; align-items: center; margin-bottom: 25px;">
              <div style="width: 20px; height: 4px; background: #EF4444; margin-right: 15px;"></div>
              <div style="color: #FCA5A5; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Payment Summary</div>
              <div style="width: 20px; height: 4px; background: #EF4444; margin-left: 15px; flex-grow: 1;"></div>
            </div>
            
            <div style="max-width: 400px; margin: 0 auto;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #374151;">
                <span style="color: #9CA3AF; font-weight: 600;">Subtotal:</span>
                <span style="font-weight: 800; font-size: 15px;">${formatNaira(subtotal)}</span>
              </div>
              
              ${receiptData.includeDiscount && receiptData.discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #374151; color: #F87171;">
                  <span style="font-weight: 600;">Discount:</span>
                  <span style="font-weight: 800; font-size: 15px;">-${formatNaira(discount)}</span>
                </div>
              ` : ''}
              
              ${deliveryFee > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #374151;">
                  <span style="color: #9CA3AF; font-weight: 600;">Delivery Fee:</span>
                  <span style="font-weight: 800; font-size: 15px;">${formatNaira(deliveryFee)}</span>
                </div>
              ` : ''}
              
              ${receiptData.includeVAT ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #374151;">
                  <span style="color: #9CA3AF; font-weight: 600;">VAT (${receiptData.vatRate}%):</span>
                  <span style="font-weight: 800; font-size: 15px;">${formatNaira(vat)}</span>
                </div>
              ` : ''}
              
              <div style="display: flex; justify-content: space-between; font-size: 22px; font-weight: 900; margin-top: 25px; padding-top: 20px; border-top: 3px solid #EF4444;">
                <span style="color: #FCA5A5;">GRAND TOTAL:</span>
                <span>${formatNaira(total)}</span>
              </div>
            </div>
          </div>
          
          <!-- Bold Payment -->
          <div style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); padding: 25px; border-radius: 10px; margin-bottom: 30px; border: 3px solid #92400E;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <div style="width: 16px; height: 16px; background: #92400E; border-radius: 50%; margin-right: 12px;"></div>
              <div style="color: #92400E; font-size: 18px; font-weight: 900; text-transform: uppercase;">Payment: ${receiptData.paymentMethod.toUpperCase()}</div>
            </div>
            
            ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                  <div style="color: #92400E; font-size: 13px; font-weight: 800; margin-bottom: 8px;">Amount Paid</div>
                  <div style="font-size: 22px; font-weight: 900; color: #111827; padding: 10px; background: white; border-radius: 8px; text-align: center; border: 2px solid #FBBF24;">
                    ${formatNaira(receiptData.amountPaid)}
                  </div>
                </div>
                <div>
                  <div style="color: #92400E; font-size: 13px; font-weight: 800; margin-bottom: 8px;">Change</div>
                  <div style="font-size: 22px; font-weight: 900; color: #DC2626; padding: 10px; background: white; border-radius: 8px; text-align: center; border: 2px solid #FBBF24;">
                    ${formatNaira(change)}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Notes -->
          ${receiptData.customerNotes ? `
            <div style="background: #F3F4F6; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 6px solid #DC2626;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="font-size: 20px; margin-right: 10px;">📝</div>
                <div style="color: #DC2626; font-size: 16px; font-weight: 800; text-transform: uppercase;">Customer Notes</div>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #E5E7EB;">
                <p style="color: #111827; font-size: 14px; line-height: 1.6; white-space: pre-wrap; font-weight: 500;">${receiptData.customerNotes}</p>
              </div>
            </div>
          ` : ''}
          
          <!-- Complete Details Notice -->
          ${hasCustomFields ? `
            <div style="background: linear-gradient(135deg, #DBEAFE, #BFDBFE); border: 3px solid #3B82F6; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="font-size: 20px; margin-right: 12px;">✅</div>
                <div style="color: #1D4ED8; font-size: 15px; font-weight: 900; text-transform: uppercase;">Complete Details Included</div>
              </div>
              <div style="color: #374151; font-size: 13px; font-weight: 600; line-height: 1.5;">
                This receipt contains full item specifications, categories, and important details.
                All information is displayed above for your records.
              </div>
            </div>
          ` : ''}
          
          <!-- Terms & Conditions -->
          ${receiptData.includeTerms && receiptData.termsAndConditions ? `
            <div style="background: #1F2937; color: white; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 20px; height: 4px; background: #F87171; margin-right: 15px;"></div>
                <div style="color: #F87171; font-size: 16px; font-weight: 800; text-transform: uppercase;">Terms & Conditions</div>
                <div style="width: 20px; height: 4px; background: #F87171; margin-left: 15px; flex-grow: 1;"></div>
              </div>
              <div style="background: #374151; padding: 20px; border-radius: 8px; border: 1px solid #4B5563;">
                <p style="color: #D1D5DB; font-size: 13px; line-height: 1.6; white-space: pre-line; font-weight: 500;">${receiptData.termsAndConditions}</p>
              </div>
            </div>
          ` : ''}
          
          <!-- Signature -->
          ${receiptData.includeSignature ? `
            <div style="margin: 40px 0;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                <div style="text-align: center;">
                  <div style="height: 70px; border-bottom: 4px solid #EF4444; margin-bottom: 15px; position: relative;">
                    ${receiptData.signatureData ? `
                      <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 60px; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);">
                    ` : ''}
                  </div>
                  <div style="color: #EF4444; font-size: 14px; font-weight: 900; text-transform: uppercase; margin-bottom: 5px;">Authorized Signature</div>
                  <div style="color: #9CA3AF; font-size: 12px; font-weight: 600;">
                    ${receiptData.cashierName}
                  </div>
                  <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px;">
                    ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="height: 70px; border-bottom: 4px solid #EF4444; margin-bottom: 15px;"></div>
                  <div style="color: #EF4444; font-size: 14px; font-weight: 900; text-transform: uppercase; margin-bottom: 5px;">Customer Signature</div>
                  <div style="color: #9CA3AF; font-size: 12px; font-weight: 600;">Customer/Representative</div>
                  <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px;">Date: _________________</div>
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Bold Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 4px solid #EF4444;">
            <div style="color: #111827; font-size: 18px; font-weight: 900; margin-bottom: 10px; letter-spacing: 2px;">
              ${receiptData.receiptNumber}
            </div>
            <div style="color: #6B7280; font-size: 14px; font-weight: 600; margin-bottom: 15px; padding: 0 20px;">
              ${receiptData.footerMessage || 'THANK YOU FOR YOUR BUSINESS!'}
            </div>
            <div style="color: #9CA3AF; font-size: 11px; font-weight: 700; padding: 10px; background: #F3F4F6; border-radius: 5px; display: inline-block;">
              Printed on ${new Date().toLocaleString()} • ReceipIt by MayorDev
            </div>
          </div>
        </div>
      </div>
    `;
  },
classic: (receiptData, companyLogo, formatNaira, calculations, importantFields) => {
    const { subtotal, discount, vat, total, change, deliveryFee = 0 } = calculations;
    
    // Helper function to get category icon emoji
    const getCategoryIcon = (category) => {
      const icons = {
        electronics: '📱',
        books: '📚',
        agriculture: '🌾',
        clothing: '👕',
        food: '☕',
        services: '✂️',
        liquids: '💧',
        construction: '🏠',
        logistics: '🚚',
        general: '📦'
      };
      return icons[category] || icons.general;
    };

    // Check if there's category data
    const hasCategoryData = receiptData.items?.some(item => item.category && item.category !== 'general');
    const hasCustomFields = receiptData.items?.some(item => item.customFields && Object.keys(item.customFields).length > 0);
    
    return `
      <div style="font-family: 'Courier New', monospace; max-width: 210mm; margin: 0 auto; padding: 20px;">
        <!-- watermark -->
        <p style='font-size: 9px; text-align: start; color: #9CA3AF; margin-bottom: 15px;'>
          This Receipt was Generated by ReceipIt. Built by MayorDev
        </p> 
        
        <!-- Classic Header -->
        <div style="text-align: center; margin-bottom: 25px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 40px; margin-bottom: 10px; filter: grayscale(100%); opacity: 0.8;">` : ''}
          <h1 style="color: #111827; margin: 5px 0; font-size: 16px; font-weight: bold; letter-spacing: 1px;">${receiptData.storeName}</h1>
          <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 8px 0; margin: 10px 0; font-size: 11px; line-height: 1.4;">
            ${receiptData.storeAddress}<br/>
            Tel: ${receiptData.storePhone}
            ${receiptData.storeEmail ? `<br/>Email: ${receiptData.storeEmail}` : ''}
            ${receiptData.tinNumber ? `<br/>TIN: ${receiptData.tinNumber}` : ''}
            ${receiptData.rcNumber ? `<br/>RC: ${receiptData.rcNumber}` : ''}
          </div>
        </div>
        
        <!-- Category Notice -->
        ${hasCategoryData ? `
          <div style="margin-bottom: 15px; padding: 8px; background: #F3F4F6; border: 1px dashed #6B7280; font-size: 10px; text-align: center;">
            📋 <strong>DETAILED RECEIPT</strong> • Category information included
          </div>
        ` : ''}
        
        <!-- Classic Info -->
        <div style="margin-bottom: 20px; font-size: 11px; line-height: 1.6;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span><strong>${receiptData.receiptType.toUpperCase()}:</strong> ${receiptData.receiptNumber}</span>
            <span><strong>Date:</strong> ${receiptData.date}</span>
          </div>
          
          ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? `
            <div style="margin-bottom: 3px;">
              <strong>Invoice #:</strong> ${receiptData.invoiceNumber}
            </div>
          ` : ''}
          
          ${receiptData.poNumber ? `
            <div style="margin-bottom: 3px;">
              <strong>PO #:</strong> ${receiptData.poNumber}
            </div>
          ` : ''}
          
          ${receiptData.dueDate ? `
            <div style="margin-bottom: 3px;">
              <strong>Due Date:</strong> ${receiptData.dueDate}
            </div>
          ` : ''}
          
          <div style="display: flex; justify-content: space-between;">
            <span><strong>Cashier:</strong> ${receiptData.cashierName}</span>
            <span><strong>Time:</strong> ${receiptData.time}</span>
          </div>
        </div>
        
        <!-- Customer Info -->
        ${receiptData.includeBillTo && receiptData.billToName ? `
          <div style="margin-bottom: 20px; padding: 12px; border: 1px dashed #000; background: #F9FAFB;">
            <div style="font-size: 11px; font-weight: bold; margin-bottom: 6px; text-decoration: underline;">BILL TO:</div>
            <div style="font-size: 11px; font-weight: bold;">${receiptData.billToName}</div>
            ${receiptData.billToAddress ? `
              <div style="font-size: 10px; margin-top: 3px;">${receiptData.billToAddress}</div>
            ` : ''}
            ${receiptData.billToPhone ? `
              <div style="font-size: 10px; margin-top: 3px;"><strong>Tel:</strong> ${receiptData.billToPhone}</div>
            ` : ''}
          </div>
        ` : ''}
        
        <!-- Separator -->
        <div style="border-top: 1px solid #000; margin: 20px 0;"></div>
        
        <!-- Classic Items Header -->
        <div style="margin-bottom: 15px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #000; padding-bottom: 8px;">
            <span style="flex: 2; padding-left: 5px;">ITEM</span>
            <span style="text-align: center; flex: 0.7;">QTY</span>
            <span style="text-align: center; flex: 0.7;">UNIT</span>
            <span style="text-align: right; flex: 1.3;">PRICE</span>
            <span style="text-align: right; flex: 1.3;">AMOUNT</span>
          </div>
          
          <!-- Items List -->
          ${receiptData.items.map((item, index) => {
            // Format ALL custom fields for display
            const customFields = item.customFields ? Object.entries(item.customFields)
              .filter(([key, value]) => value && value.toString().trim() !== '')
              .map(([key, value]) => ({
                key: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                value: value.toString()
              })) : [];
            
            // Get category icon
            const categoryIcon = item.category ? getCategoryIcon(item.category) : '';
            const categoryName = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : '';
            
            return `
              <!-- Item Row -->
              <div style="margin-bottom: ${customFields.length > 0 ? '12px' : '8px'}; page-break-inside: avoid;">
                <!-- Main Item Row -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                  <span style="flex: 2; padding-left: 5px; font-weight: 500;">
                    ${categoryIcon} ${item.name}
                  </span>
                  <span style="text-align: center; flex: 0.7; font-weight: bold;">${item.quantity}</span>
                  <span style="text-align: center; flex: 0.7; font-size: 10px;">
                    ${item.unit && item.unit !== 'Piece' ? item.unit : 'PCS'}
                  </span>
                  <span style="text-align: right; flex: 1.3;">${formatNaira(item.price)}</span>
                  <span style="text-align: right; flex: 1.3; font-weight: bold;">${formatNaira(item.price * item.quantity)}</span>
                </div>
                
                <!-- Category Display -->
                ${categoryName && categoryName !== 'General' ? `
                  <div style="font-size: 9px; color: #4B5563; margin-left: 5px; margin-bottom: 4px; padding-left: 3px; border-left: 1px solid #9CA3AF;">
                    <strong>Category:</strong> ${categoryName}
                  </div>
                ` : ''}
                
                <!-- Item Description -->
                ${item.description ? `
                  <div style="font-size: 10px; color: #6B7280; margin-left: 8px; margin-bottom: 6px; padding-left: 3px; border-left: 1px dashed #D1D5DB;">
                    <em>${item.description}</em>
                  </div>
                ` : ''}
                
                <!-- ALL Custom Fields - Responsive Grid -->
                ${customFields.length > 0 ? `
                  <div style="margin-left: 10px; margin-top: 6px; padding: 6px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 3px;">
                    <div style="font-size: 9px; font-weight: bold; color: #374151; margin-bottom: 5px; text-transform: uppercase;">
                      Specifications:
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                      ${customFields.map((field) => `
                        <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; font-size: 9px; padding: 4px 6px; background: white; border: 1px solid #D1D5DB; border-radius: 2px; word-break: break-word;">
                          <div style="font-weight: 600; color: #6B7280; margin-bottom: 1px;">${field.key}</div>
                          <div style="color: #111827; word-break: break-all;">${field.value}</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
              
              <!-- Separator for items except last -->
              ${index < receiptData.items.length - 1 ? `
                <div style="border-bottom: 1px dashed #E5E7EB; margin: 8px 0;"></div>
              ` : ''}
            `;
          }).join('')}
        </div>
        
        <!-- Separator -->
        <div style="border-top: 1px solid #000; margin: 20px 0;"></div>
        
        <!-- Classic Totals -->
        <div style="margin-bottom: 20px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; padding-bottom: 3px; border-bottom: 1px dotted #D1D5DB;">
            <span>Subtotal:</span>
            <span>${formatNaira(subtotal)}</span>
          </div>
          
          ${receiptData.includeDiscount && receiptData.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; padding-bottom: 3px; border-bottom: 1px dotted #D1D5DB; color: #DC2626;">
              <span>Discount:</span>
              <span>-${formatNaira(discount)}</span>
            </div>
          ` : ''}
          
          ${deliveryFee > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; padding-bottom: 3px; border-bottom: 1px dotted #D1D5DB;">
              <span>Delivery Fee:</span>
              <span>${formatNaira(deliveryFee)}</span>
            </div>
          ` : ''}
          
          ${receiptData.includeVAT ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; padding-bottom: 3px; border-bottom: 1px dotted #D1D5DB;">
              <span>VAT (${receiptData.vatRate}%):</span>
              <span>${formatNaira(vat)}</span>
            </div>
          ` : ''}
          
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 12px; padding-top: 10px; border-top: 2px solid #000; font-size: 12px;">
            <span>TOTAL:</span>
            <span>${formatNaira(total)}</span>
          </div>
        </div>
        

        🔍 Important Item Details
       
        <!-- Classic Payment -->
        <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 12px 0; margin: 20px 0; font-size: 11px;">
          <div style="margin-bottom: 8px;">
            <strong>Payment Method:</strong> ${receiptData.paymentMethod}
          </div>
          ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
            <div style="display: flex; justify-content: space-between;">
              <span><strong>Amount Paid:</strong> ${formatNaira(receiptData.amountPaid)}</span>
              <span><strong>Change:</strong> ${formatNaira(change)}</span>
            </div>
          ` : ''}
        </div>
        
        <!-- Notes -->
        ${receiptData.customerNotes ? `
          <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #E5E7EB; background: #F9FAFB; font-size: 10px;">
            <div style="font-weight: bold; margin-bottom: 5px; text-decoration: underline;">Customer Notes:</div>
            <div style="white-space: pre-wrap; line-height: 1.4;">${receiptData.customerNotes}</div>
          </div>
        ` : ''}
        
        <!-- Terms & Conditions -->
        ${receiptData.includeTerms && receiptData.termsAndConditions ? `
          <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #000; font-size: 9px;">
            <div style="font-weight: bold; margin-bottom: 6px; text-decoration: underline;">Terms & Conditions:</div>
            <div style="white-space: pre-line; line-height: 1.3;">${receiptData.termsAndConditions}</div>
          </div>
        ` : ''}
        
        <!-- Signature -->
        ${receiptData.includeSignature ? `
          <div style="margin: 30px 0;">
            <div style="display: flex; justify-content: space-between; gap: 20px;">
              <div style="text-align: center; flex: 1;">
                <div style="height: 50px; border-bottom: 2px solid #000; margin-bottom: 8px; position: relative;">
                  ${receiptData.signatureData ? `
                    <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 40px; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); filter: grayscale(100%);">
                  ` : ''}
                </div>
                <div style="font-size: 10px; font-weight: bold;">AUTHORIZED SIGNATURE</div>
                <div style="font-size: 9px; color: #6B7280; margin-top: 3px;">
                  ${receiptData.cashierName}
                </div>
                <div style="font-size: 8px; color: #9CA3AF; margin-top: 2px;">
                  ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="height: 50px; border-bottom: 2px solid #000; margin-bottom: 8px;"></div>
                <div style="font-size: 10px; font-weight: bold;">CUSTOMER SIGNATURE</div>
                <div style="font-size: 9px; color: #6B7280; margin-top: 3px;">
                  Customer/Representative
                </div>
                <div style="font-size: 8px; color: #9CA3AF; margin-top: 2px;">
                  Date: _________________
                </div>
              </div>
            </div>
          </div>
        ` : ''}
        
        <!-- Complete Details Notice -->
        ${hasCustomFields ? `
          <div style="margin: 20px 0; padding: 10px; border: 1px dashed #6B7280; background: #F3F4F6; text-align: center; font-size: 9px;">
            <div style="font-weight: bold; color: #111827; margin-bottom: 3px;">
              ✅ COMPLETE DETAILS INCLUDED
            </div>
            <div style="color: #6B7280;">
              All item specifications and categories shown above • This is a detailed receipt
            </div>
          </div>
        ` : ''}
        
        <!-- Classic Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 3px solid #000; font-size: 10px;">
          <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0; margin: 15px 0; font-weight: bold;">
            ${receiptData.footerMessage || 'THANK YOU FOR YOUR BUSINESS'}
          </div>
          
          <div style="margin-top: 15px; line-height: 1.4;">
            <div style="font-weight: bold; margin-bottom: 5px;">${receiptData.receiptNumber}</div>
            <div style="color: #6B7280;">
              Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            <div style="margin-top: 10px; font-size: 9px; color: #9CA3AF;">
              Please retain this receipt for your records
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

// Helper function to generate print HTML
export const generatePrintHTML = (templateId, receiptData, companyLogo, formatNaira, calculations, qrCodeUrl , verificationUrl   ) => {
  const template = printTemplates[templateId] || printTemplates.modern;
  return template(receiptData, companyLogo, formatNaira, calculations, qrCodeUrl , verificationUrl);
};