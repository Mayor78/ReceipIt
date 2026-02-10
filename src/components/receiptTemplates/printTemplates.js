// Print-optimized templates for generating print HTML
export const printTemplates = {
modern: (receiptData, companyLogo, formatNaira, calculations, importantFields) => {
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
        
        <!-- COMPLETE Important Fields Summary - Show ALL -->
        ${importantFields && importantFields.length > 0 ? `
          <div style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); border: 2px solid #F59E0B; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #92400E; margin-bottom: 15px; font-weight: 700; font-size: 16px; display: flex; align-items: center; gap: 10px; padding-bottom: 10px; border-bottom: 2px solid #F59E0B;">
              <span style="font-size: 18px;">🔍</span> IMPORTANT ITEM DETAILS - COMPLETE LIST
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px;">
              ${importantFields.map((field, idx) => `
                <div style="background: white; padding: 12px 15px; border-radius: 6px; border: 1px solid #FCD34D; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="font-size: 13px; font-weight: 700; color: #92400E;">Item ${field.itemIndex}: ${field.itemName}</div>
                    <div style="font-size: 11px; background: #FEF3C7; color: #92400E; padding: 2px 8px; border-radius: 10px; font-weight: 600;">
                      ${field.field}
                    </div>
                  </div>
                  <div style="font-size: 14px; font-weight: 600; color: #111827; text-align: center; padding: 8px; background: #F9FAFB; border-radius: 4px; border: 1px dashed #D1D5DB;">
                    ${field.value}
                  </div>
                  <div style="font-size: 10px; color: #6B7280; margin-top: 6px; text-align: center;">
                    Record ID: ${receiptData.receiptNumber}-${field.itemIndex}
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #FCD34D;">
              <div style="font-size: 12px; font-weight: 600; color: #92400E;">
                ✅ All ${importantFields.length} important details shown above
              </div>
            </div>
          </div>
        ` : ''}
        
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
          
          <p style="margin-top: 25px; font-size: 10px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 15px;">
            Document Generated: ${new Date().toLocaleString()} • Transaction ID: ${receiptData.receiptNumber} •
            <br>
            <span style="font-weight: 600; color: #6B7280;">Powered by ReceipIt • Build by MayorDev</span>
          </p>
        </div>
      </div>
    `;
  },
  professional: (receiptData, companyLogo, formatNaira, calculations) => {
    const { subtotal, discount, vat, total, change } = calculations;
    
    return `
      <div style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 210mm; margin: 0 auto;">
        <!-- Header -->
          <!-- watermark -->
        <p style='font-size: 10px; text-align: start; color: #6B7280; '>
        This Receipt was Generated by ReceiptIt. Built by MayorDev
       </p> 
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px solid #D1D5DB;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 50px; margin-bottom: 15px;">` : ''}
          <h1 style="color: #111827; margin: 10px 0; font-size: 22px; font-weight: 600; letter-spacing: -0.5px;">${receiptData.storeName}</h1>
          <p style="color: #4B5563; margin: 5px 0; font-size: 13px; font-weight: 400;">${receiptData.storeAddress}</p>
          <p style="color: #4B5563; margin: 5px 0; font-size: 13px;">Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• Email: ${receiptData.storeEmail}` : ''}</p>
          ${receiptData.tinNumber ? `<p style="color: #4B5563; margin: 5px 0; font-size: 13px; font-weight: 600;">TIN: ${receiptData.tinNumber}</p>` : ''}
          ${receiptData.rcNumber ? `<p style="color: #4B5563; margin: 5px 0; font-size: 13px;">RC: ${receiptData.rcNumber}</p>` : ''}
        </div>
        
        <!-- Document Info -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #E5E7EB;">
          <div>
            <p style="margin: 8px 0; color: #4B5563;"><strong>${receiptData.receiptType} #:</strong> ${receiptData.receiptNumber}</p>
            ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? `
              <p style="margin: 8px 0; color: #4B5563;"><strong>Invoice #:</strong> ${receiptData.invoiceNumber}</p>
            ` : ''}
            ${receiptData.poNumber ? `<p style="margin: 8px 0; color: #4B5563;"><strong>PO #:</strong> ${receiptData.poNumber}</p>` : ''}
            <p style="margin: 8px 0; color: #4B5563;"><strong>Date:</strong> ${receiptData.date}</p>
            ${receiptData.dueDate ? `<p style="margin: 8px 0; color: #4B5563;"><strong>Due Date:</strong> ${receiptData.dueDate}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <p style="margin: 8px 0; color: #4B5563;"><strong>Time:</strong> ${receiptData.time}</p>
            <p style="margin: 8px 0; color: #4B5563;"><strong>Cashier:</strong> ${receiptData.cashierName}</p>
          </div>
        </div>
        
        <!-- Customer Info -->
        ${receiptData.includeBillTo && receiptData.billToName ? `
          <div style="background: #10B981; color: white; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">BILL TO</h3>
            <p style="margin: 4px 0;"><strong>${receiptData.billToName}</strong></p>
            ${receiptData.billToAddress ? `<p style="margin: 4px 0; font-size: 13px;">${receiptData.billToAddress}</p>` : ''}
            ${receiptData.billToPhone ? `<p style="margin: 4px 0; font-size: 13px;">Tel: ${receiptData.billToPhone}</p>` : ''}
          </div>
        ` : ''}
        
        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px;">
          <thead>
            <tr>
              <th style="padding: 12px 10px; text-align: left; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981;">Description</th>
              <th style="padding: 12px 10px; text-align: center; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981;">Qty</th>
              <th style="padding: 12px 10px; text-align: center; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981;">Unit</th>
              <th style="padding: 12px 10px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981;">Unit Price</th>
              <th style="padding: 12px 10px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${receiptData.items.map((item, index) => `
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 14px 10px; color: #111827;">
                  <div style="font-weight: 500;">${item.name}</div>
                  ${item.description ? `<div style="font-size: 12px; color: #6B7280; margin-top: 3px;">${item.description}</div>` : ''}
                </td>
                <td style="padding: 14px 10px; text-align: center; color: #4B5563;">${item.quantity}</td>
                <td style="padding: 14px 10px; text-align: center; color: #4B5563;">
                  ${item.unit && item.unit !== 'Piece' ? item.unit : '-'}
                </td>
                <td style="padding: 14px 10px; text-align: right; color: #4B5563;">${formatNaira(item.price)}</td>
                <td style="padding: 14px 10px; text-align: right; font-weight: 600; color: #111827;">${formatNaira(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Totals -->
        <div style="background: #F9FAFB; padding: 25px; border-radius: 6px; margin-bottom: 25px;">
          <div style="max-width: 350px; margin-left: auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #4B5563;">Subtotal:</span>
              <span style="font-weight: 500;">${formatNaira(subtotal)}</span>
            </div>
            ${receiptData.includeDiscount && receiptData.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #DC2626;">
                <span>Discount:</span>
                <span>-${formatNaira(discount)}</span>
              </div>
            ` : ''}
            ${receiptData.deliveryFee > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span>Delivery Fee:</span>
                <span>${formatNaira(receiptData.deliveryFee)}</span>
              </div>
            ` : ''}
            ${receiptData.includeVAT ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span>VAT (${receiptData.vatRate}%):</span>
                <span>${formatNaira(vat)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #10B981; margin-top: 15px; padding-top: 15px; border-top: 1px solid #E5E7EB;">
              <span>TOTAL AMOUNT:</span>
              <span>${formatNaira(total)}</span>
            </div>
          </div>
        </div>
        
        <!-- Payment -->
        <div style="border: 1px solid #D1D5DB; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin-bottom: 15px; font-weight: 600;">Payment Details</h3>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 10px; font-size: 13px;">
            <span style="color: #6B7280;">Payment Method:</span>
            <span style="font-weight: 500;">${receiptData.paymentMethod}</span>
            ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
              <span style="color: #6B7280;">Amount Paid:</span>
              <span>${formatNaira(receiptData.amountPaid)}</span>
              <span style="color: #6B7280;">Change Due:</span>
              <span>${formatNaira(change)}</span>
            ` : ''}
          </div>
        </div>
        
        <!-- Notes -->
        ${receiptData.customerNotes ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Customer Notes:</h3>
            <p style="color: #6B7280; font-size: 13px; line-height: 1.5; padding: 10px; background: #F9FAFB; border-radius: 4px;">
              ${receiptData.customerNotes}
            </p>
          </div>
        ` : ''}
        
        <!-- Terms & Conditions -->
        ${receiptData.includeTerms && receiptData.termsAndConditions ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Terms & Conditions:</h3>
            <p style="color: #6B7280; font-size: 12px; line-height: 1.5; white-space: pre-line; padding: 10px; background: #F9FAFB; border-radius: 4px;">
              ${receiptData.termsAndConditions}
            </p>
          </div>
        ` : ''}
        
        <!-- Signature -->
        ${receiptData.includeSignature ? `
          <div style="margin: 30px 0;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
              <div style="text-align: center;">
                <div style="height: 50px; border-bottom: 1px solid #D1D5DB; margin-bottom: 10px; position: relative;">
                  ${receiptData.signatureData ? `
                    <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 40px; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);">
                  ` : ''}
                </div>
                <div style="color: #6B7280; font-size: 12px;">AUTHORIZED SIGNATURE</div>
                <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px;">
                  ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div style="text-align: center;">
                <div style="height: 50px; border-bottom: 1px solid #D1D5DB; margin-bottom: 10px;"></div>
                <div style="color: #6B7280; font-size: 12px;">Customer</div>
                <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px;">Date</div>
              </div>
            </div>
          </div>
        ` : ''}
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
          <p style="margin: 8px 0; color: #374151;"><strong>${receiptData.receiptNumber}</strong></p>
          <p style="margin: 8px 0;">${receiptData.footerMessage || 'Thank you for your business. We appreciate your patronage.'}</p>
          <p style="margin-top: 20px; font-size: 11px; color: #9CA3AF;">
            This document was electronically generated and is valid without signature.
          </p>
        </div>
      </div>
    `;
  },

  elegant: (receiptData, companyLogo, formatNaira, calculations) => {
    const { subtotal, discount, vat, total, change } = calculations;
    
    return `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 210mm; margin: 0 auto; background: #F9FAFB;">
        <!-- watermark -->
        <p style='font-size: 10px; text-align: start; color: #6B7280; '>
        This Receipt was Generated by ReceiptIt. Built by MayorDev
       </p> 
        <!-- Decorative Header -->
        <div style="text-align: center; margin-bottom: 30px; padding: 30px 0; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #F59E0B, #EC4899);"></div>
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 50px; margin-bottom: 15px; filter: brightness(0) invert(1);">` : ''}
          <h1 style="margin: 10px 0; font-size: 26px; font-weight: 700; letter-spacing: 1px;">${receiptData.storeName}</h1>
          <p style="margin: 5px 0; opacity: 0.9; font-size: 14px;">${receiptData.storeAddress}</p>
          <p style="margin: 5px 0; opacity: 0.9; font-size: 13px;">Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• ${receiptData.storeEmail}` : ''}</p>
          ${receiptData.tinNumber ? `<p style="margin: 5px 0; opacity: 0.9; font-size: 13px;">TIN: ${receiptData.tinNumber}</p>` : ''}
        </div>
        
        <!-- Receipt Details -->
        <div style="padding: 0 30px;">
          <!-- Document Info -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 25px; border-bottom: 2px dashed #E5E7EB;">
            <div style="text-align: center; flex: 1;">
              <div style="color: #8B5CF6; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">${receiptData.receiptType} Number</div>
              <div style="font-size: 18px; font-weight: 700; color: #111827;">${receiptData.receiptNumber}</div>
              ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? `
                <div style="color: #6B7280; font-size: 12px; margin-top: 3px;">Invoice: ${receiptData.invoiceNumber}</div>
              ` : ''}
              ${receiptData.poNumber ? `<div style="color: #6B7280; font-size: 12px; margin-top: 3px;">PO: ${receiptData.poNumber}</div>` : ''}
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="color: #8B5CF6; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">Date & Time</div>
              <div style="font-size: 14px; color: #4B5563;">${receiptData.date}</div>
              <div style="font-size: 14px; color: #4B5563;">${receiptData.time}</div>
              ${receiptData.dueDate ? `<div style="color: #7C3AED; font-size: 12px; margin-top: 3px;">Due: ${receiptData.dueDate}</div>` : ''}
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="color: #8B5CF6; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">Details</div>
              <div style="font-size: 14px; color: #4B5563;">Cashier: ${receiptData.cashierName}</div>
              ${receiptData.rcNumber ? `<div style="font-size: 12px; color: #6B7280; margin-top: 3px;">RC: ${receiptData.rcNumber}</div>` : ''}
            </div>
          </div>
          
          <!-- Customer Info -->
          ${receiptData.includeBillTo && receiptData.billToName ? `
            <div style="background: linear-gradient(135deg, #F3E8FF, #E9D5FF); padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #8B5CF6;">
              <h3 style="color: #7C3AED; font-size: 15px; font-weight: 600; margin-bottom: 8px;">BILL TO</h3>
              <p style="color: #111827; margin: 4px 0; font-weight: 500;">${receiptData.billToName}</p>
              ${receiptData.billToAddress ? `<p style="color: #6B7280; margin: 4px 0; font-size: 13px;">${receiptData.billToAddress}</p>` : ''}
              ${receiptData.billToPhone ? `<p style="color: #6B7280; margin: 4px 0; font-size: 13px;">Tel: ${receiptData.billToPhone}</p>` : ''}
            </div>
          ` : ''}
          
          <!-- Items Table -->
          <div style="margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px;">
              <thead>
                <tr>
                  <th style="padding: 16px 12px; text-align: left; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED;">Item Description</th>
                  <th style="padding: 16px 12px; text-align: center; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED;">Qty</th>
                  <th style="padding: 16px 12px; text-align: center; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED;">Unit</th>
                  <th style="padding: 16px 12px; text-align: right; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED;">Price</th>
                  <th style="padding: 16px 12px; text-align: right; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${receiptData.items.map((item, index) => `
                  <tr>
                    <td style="padding: 18px 12px; border-bottom: 1px solid #E5E7EB; color: #111827;">
                      <div style="font-weight: 500; margin-bottom: 4px;">${item.name}</div>
                      ${item.description ? `<div style="font-size: 13px; color: #6B7280; font-style: italic;">${item.description}</div>` : ''}
                    </td>
                    <td style="padding: 18px 12px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #4B5563;">${item.quantity}</td>
                    <td style="padding: 18px 12px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #4B5563;">
                      ${item.unit && item.unit !== 'Piece' ? item.unit : '-'}
                    </td>
                    <td style="padding: 18px 12px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #4B5563;">${formatNaira(item.price)}</td>
                    <td style="padding: 18px 12px; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: 600; color: #111827;">${formatNaira(item.price * item.quantity)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <!-- Totals in Elegant Box -->
          <div style="background: white; border: 2px solid #8B5CF6; border-radius: 8px; padding: 25px; margin-bottom: 30px; position: relative;">
            <div style="position: absolute; top: -12px; left: 30px; background: #8B5CF6; color: white; padding: 6px 20px; border-radius: 4px; font-size: 12px; font-weight: 600;">
              AMOUNT DUE
            </div>
            <div style="max-width: 300px; margin-left: auto;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #E5E7EB;">
                <span style="color: #4B5563;">Subtotal</span>
                <span>${formatNaira(subtotal)}</span>
              </div>
              ${receiptData.includeDiscount && receiptData.discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #E5E7EB; color: #DC2626;">
                  <span>Discount</span>
                  <span>-${formatNaira(discount)}</span>
                </div>
              ` : ''}
              ${receiptData.deliveryFee > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #E5E7EB;">
                  <span>Delivery Fee</span>
                  <span>${formatNaira(receiptData.deliveryFee)}</span>
                </div>
              ` : ''}
              ${receiptData.includeVAT ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #E5E7EB;">
                  <span>VAT (${receiptData.vatRate}%)</span>
                  <span>${formatNaira(vat)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; color: #8B5CF6; margin-top: 20px; padding-top: 20px; border-top: 2px solid #8B5CF6;">
                <span>Grand Total</span>
                <span>${formatNaira(total)}</span>
              </div>
            </div>
          </div>
          
          <!-- Payment -->
          <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #F59E0B;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="width: 8px; height: 8px; background: #92400E; border-radius: 50%; margin-right: 10px;"></div>
              <h3 style="color: #92400E; font-weight: 600;">Payment Method: ${receiptData.paymentMethod}</h3>
            </div>
            ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
                <div>
                  <div style="color: #92400E; font-size: 12px;">Amount Paid</div>
                  <div style="font-weight: 600; font-size: 16px;">${formatNaira(receiptData.amountPaid)}</div>
                </div>
                <div>
                  <div style="color: #92400E; font-size: 12px;">Change</div>
                  <div style="font-weight: 600; font-size: 16px;">${formatNaira(change)}</div>
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Notes -->
          ${receiptData.customerNotes ? `
            <div style="background: #F5F3FF; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 3px solid #8B5CF6;">
              <h3 style="color: #7C3AED; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Notes</h3>
              <p style="color: #6B7280; font-size: 13px; line-height: 1.5; font-style: italic;">"${receiptData.customerNotes}"</p>
            </div>
          ` : ''}
          
          <!-- Terms & Conditions -->
          ${receiptData.includeTerms && receiptData.termsAndConditions ? `
            <div style="border: 1px solid #E5E7EB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #4B5563; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Terms & Conditions</h3>
              <p style="color: #6B7280; font-size: 12px; line-height: 1.5; white-space: pre-line;">${receiptData.termsAndConditions}</p>
            </div>
          ` : ''}
          
          <!-- Signature -->
          ${receiptData.includeSignature ? `
            <div style="margin: 40px 0;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div style="text-align: center;">
                  <div style="height: 60px; border-bottom: 2px solid #7C3AED; margin-bottom: 10px; position: relative;">
                    ${receiptData.signatureData ? `
                      <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 50px; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);">
                    ` : ''}
                  </div>
                  <div style="color: #7C3AED; font-size: 12px; font-weight: 500;">AUTHORIZED SIGNATURE</div>
                  <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px;">
                    ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="height: 60px; border-bottom: 2px solid #7C3AED; margin-bottom: 10px;"></div>
                  <div style="color: #7C3AED; font-size: 12px; font-weight: 500;">Customer</div>
                  <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px;">Date</div>
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 3px double #8B5CF6; color: #6B7280; font-size: 13px;">
            <p style="margin: 10px 0; font-style: italic;">"${receiptData.footerMessage || 'Thank you for your gracious patronage.'}"</p>
            <p style="margin: 15px 0; color: #374151; font-weight: 500;">${receiptData.receiptNumber}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9CA3AF;">
              This receipt was elegantly crafted • ${new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    `;
  },

  minimal: (receiptData, companyLogo, formatNaira, calculations) => {
    const { subtotal, discount, vat, total, change } = calculations;
    
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 210mm; margin: 0 auto; padding: 20px;">
        <!-- watermark -->
        <p style='font-size: 10px; text-align: start; color: #6B7280; '>
        This Receipt was Generated by ReceiptIt. Built by MayorDev
       </p> 
        <!-- Simple Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 40px; margin-bottom: 10px;">` : ''}
          <h1 style="color: #111827; margin: 5px 0; font-size: 18px; font-weight: 400;">${receiptData.storeName}</h1>
          <p style="color: #6B7280; margin: 3px 0; font-size: 12px;">${receiptData.storeAddress}</p>
          <p style="color: #6B7280; margin: 3px 0; font-size: 12px;">Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• ${receiptData.storeEmail}` : ''}</p>
          ${receiptData.tinNumber ? `<p style="color: #6B7280; margin: 3px 0; font-size: 11px; font-weight: 600;">TIN: ${receiptData.tinNumber}</p>` : ''}
          ${receiptData.rcNumber ? `<p style="color: #6B7280; margin: 3px 0; font-size: 11px;">RC: ${receiptData.rcNumber}</p>` : ''}
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
        
        <!-- Simple Items -->
        <div style="margin-bottom: 25px;">
          ${receiptData.items.map((item, index) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #F3F4F6;">
              <div style="flex: 1;">
                <div style="font-size: 13px; color: #111827; margin-bottom: 3px;">${item.name}</div>
                <div style="font-size: 11px; color: #6B7280;">
                  ${item.quantity} × ${formatNaira(item.price)}
                  ${item.unit && item.unit !== 'Piece' ? ` (${item.unit})` : ''}
                  ${item.description ? `<div style="margin-top: 2px;">${item.description}</div>` : ''}
                </div>
              </div>
              <div style="font-size: 13px; font-weight: 500; color: #111827;">
                ${formatNaira(item.price * item.quantity)}
              </div>
            </div>
          `).join('')}
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
          ${receiptData.deliveryFee > 0 ? `
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #6B7280;">
              <span>Delivery Fee</span>
              <span>${formatNaira(receiptData.deliveryFee)}</span>
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
          <div>Payment: ${receiptData.paymentMethod}</div>
          ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
            <div style="margin-top: 5px;">
              <div>Paid: ${formatNaira(receiptData.amountPaid)}</div>
              <div>Change: ${formatNaira(change)}</div>
            </div>
          ` : ''}
        </div>
        
        <!-- Notes -->
        ${receiptData.customerNotes ? `
          <div style="font-size: 11px; color: #6B7280; margin-bottom: 15px; padding: 10px; background: #F9FAFB; border-radius: 4px;">
            <strong>Note:</strong> ${receiptData.customerNotes}
          </div>
        ` : ''}
        
        <!-- Terms & Conditions -->
        ${receiptData.includeTerms && receiptData.termsAndConditions ? `
          <div style="font-size: 10px; color: #6B7280; margin-bottom: 15px; padding: 10px; background: #F3F4F6; border-radius: 4px;">
            <strong>Terms:</strong> ${receiptData.termsAndConditions}
          </div>
        ` : ''}
        
        <!-- Signature -->
        ${receiptData.includeSignature ? `
          <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <div style="text-align: center;">
              <div style="height: 40px; border-bottom: 1px solid #9CA3AF; margin-bottom: 10px; position: relative;">
                ${receiptData.signatureData ? `
                  <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 30px; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);">
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
          <div style="margin-bottom: 10px;">${receiptData.receiptNumber}</div>
          <div>${receiptData.footerMessage || 'Thank you for your business'}</div>
          <div style="margin-top: 10px; font-size: 10px;">Generated ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
    `;
  },

  bold: (receiptData, companyLogo, formatNaira, calculations) => {
    const { subtotal, discount, vat, total, change } = calculations;
    
    return `
      <div style="font-family: 'Montserrat', sans-serif; max-width: 210mm; margin: 0 auto;">
        <!-- Bold Header -->
          <!-- watermark -->
        <p style='font-size: 10px; text-align: start; color: #6B7280; '>
        This Receipt was Generated by ReceiptIt. Built by MayorDev
       </p> 
        <div style="background: #EF4444; color: white; padding: 30px; text-align: center; margin-bottom: 30px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 60px; margin-bottom: 15px; filter: brightness(0) invert(1);">` : ''}
          <h1 style="margin: 10px 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">${receiptData.storeName}</h1>
          <p style="margin: 5px 0; opacity: 0.9; font-weight: 500;">${receiptData.storeAddress}</p>
          <p style="margin: 5px 0; opacity: 0.9;">Tel: ${receiptData.storePhone} ${receiptData.storeEmail ? `• ${receiptData.storeEmail}` : ''}</p>
          ${receiptData.tinNumber ? `<p style="margin: 5px 0; opacity: 0.9; font-weight: 600;">TIN: ${receiptData.tinNumber}</p>` : ''}
          ${receiptData.rcNumber ? `<p style="margin: 5px 0; opacity: 0.9;">RC: ${receiptData.rcNumber}</p>` : ''}
        </div>
        
        <!-- Bold Info -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; padding: 0 20px;">
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
          </div>
        </div>
        
        <!-- Customer Info -->
        ${receiptData.includeBillTo && receiptData.billToName ? `
          <div style="background: #FEE2E2; padding: 20px; margin: 0 20px 25px 20px; border-radius: 10px; border: 2px solid #EF4444;">
            <div style="color: #DC2626; font-size: 14px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase;">BILL TO</div>
            <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 5px;">${receiptData.billToName}</div>
            ${receiptData.billToAddress ? `<div style="font-size: 13px; color: #6B7280;">${receiptData.billToAddress}</div>` : ''}
            ${receiptData.billToPhone ? `<div style="font-size: 13px; color: #6B7280;">Tel: ${receiptData.billToPhone}</div>` : ''}
          </div>
        ` : ''}
        
        <!-- Bold Items -->
        <div style="padding: 0 20px;">
          <div style="background: #FEE2E2; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <div style="color: #DC2626; font-size: 14px; font-weight: 700; margin-bottom: 20px; text-transform: uppercase;">ITEMS PURCHASED</div>
            ${receiptData.items.map((item, index) => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #FECACA;">
                <div>
                  <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px;">${item.name}</div>
                  <div style="font-size: 12px; color: #6B7280;">
                    Qty: ${item.quantity} ${item.unit && item.unit !== 'Piece' ? `• Unit: ${item.unit}` : ''}
                    ${item.description ? `<div style="margin-top: 2px;">${item.description}</div>` : ''}
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 14px; font-weight: 700; color: #111827;">${formatNaira(item.price * item.quantity)}</div>
                  <div style="font-size: 12px; color: #6B7280;">${formatNaira(item.price)} each</div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <!-- Bold Totals -->
          <div style="background: #111827; color: white; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <span style="color: #9CA3AF;">Subtotal:</span>
              <span style="font-weight: 600;">${formatNaira(subtotal)}</span>
            </div>
            ${receiptData.includeDiscount && receiptData.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #F87171;">
                <span>Discount:</span>
                <span>-${formatNaira(discount)}</span>
              </div>
            ` : ''}
            ${receiptData.deliveryFee > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #9CA3AF;">Delivery Fee:</span>
                <span>${formatNaira(receiptData.deliveryFee)}</span>
              </div>
            ` : ''}
            ${receiptData.includeVAT ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #9CA3AF;">VAT (${receiptData.vatRate}%):</span>
                <span>${formatNaira(vat)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 800; margin-top: 20px; padding-top: 20px; border-top: 2px solid #EF4444;">
              <span>TOTAL:</span>
              <span>${formatNaira(total)}</span>
            </div>
          </div>
          
          <!-- Bold Payment -->
          <div style="background: linear-gradient(90deg, #FEF3C7, #FDE68A); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 3px solid #92400E;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="width: 12px; height: 12px; background: #92400E; border-radius: 50%; margin-right: 10px;"></div>
              <div style="color: #92400E; font-size: 16px; font-weight: 800;">PAYMENT: ${receiptData.paymentMethod.toUpperCase()}</div>
            </div>
            ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <div style="color: #92400E; font-size: 12px; font-weight: 600;">Amount Paid</div>
                  <div style="font-size: 18px; font-weight: 800; color: #111827;">${formatNaira(receiptData.amountPaid)}</div>
                </div>
                <div>
                  <div style="color: #92400E; font-size: 12px; font-weight: 600;">Change</div>
                  <div style="font-size: 18px; font-weight: 800; color: #111827;">${formatNaira(change)}</div>
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Notes -->
          ${receiptData.customerNotes ? `
            <div style="background: #F3F4F6; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #DC2626;">
              <div style="color: #DC2626; font-size: 14px; font-weight: 700; margin-bottom: 10px;">NOTES</div>
              <p style="color: #6B7280; font-size: 13px; line-height: 1.5;">${receiptData.customerNotes}</p>
            </div>
          ` : ''}
          
          <!-- Terms & Conditions -->
          ${receiptData.includeTerms && receiptData.termsAndConditions ? `
            <div style="background: #1F2937; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <div style="color: #F87171; font-size: 14px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase;">TERMS & CONDITIONS</div>
              <p style="color: #D1D5DB; font-size: 12px; line-height: 1.5; white-space: pre-line;">${receiptData.termsAndConditions}</p>
            </div>
          ` : ''}
          
          <!-- Signature -->
          ${receiptData.includeSignature ? `
            <div style="margin: 30px 0;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div style="text-align: center;">
                  <div style="height: 60px; border-bottom: 3px solid #EF4444; margin-bottom: 10px; position: relative;">
                    ${receiptData.signatureData ? `
                      <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 50px; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);">
                    ` : ''}
                  </div>
                  <div style="color: #EF4444; font-size: 12px; font-weight: 700;">AUTHORIZED SIGNATURE</div>
                  <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px;">
                    ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="height: 60px; border-bottom: 3px solid #EF4444; margin-bottom: 10px;"></div>
                  <div style="color: #EF4444; font-size: 12px; font-weight: 700;">Customer</div>
                  <div style="color: #9CA3AF; font-size: 11px; margin-top: 5px;">DATE</div>
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Bold Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 3px solid #EF4444;">
            <div style="color: #111827; font-size: 14px; font-weight: 800; margin-bottom: 10px;">${receiptData.receiptNumber}</div>
            <div style="color: #6B7280; font-size: 12px; margin-bottom: 10px;">${receiptData.footerMessage || 'THANK YOU FOR YOUR BUSINESS!'}</div>
            <div style="color: #9CA3AF; font-size: 10px; font-weight: 600;">
              Printed on ${new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  classic: (receiptData, companyLogo, formatNaira, calculations) => {
    const { subtotal, discount, vat, total, change } = calculations;
    
    return `
      <div style="font-family: 'Courier New', monospace; max-width: 210mm; margin: 0 auto; padding: 20px;">
        <!-- Classic Header -->
          <!-- watermark -->
        <p style='font-size: 10px; text-align: start; color: #6B7280; '>
        This Receipt was Generated by ReceiptIt. Built by MayorDev
       </p> 
        <div style="text-align: center; margin-bottom: 25px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 40px; margin-bottom: 10px; filter: grayscale(100%);">` : ''}
          <h1 style="color: #111827; margin: 5px 0; font-size: 16px; font-weight: bold;">${receiptData.storeName}</h1>
          <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 0; margin: 10px 0; font-size: 11px;">
            ${receiptData.storeAddress} • Tel: ${receiptData.storePhone}
            ${receiptData.storeEmail ? `<br/>Email: ${receiptData.storeEmail}` : ''}
            ${receiptData.tinNumber ? `<br/>TIN: ${receiptData.tinNumber}` : ''}
            ${receiptData.rcNumber ? `<br/>RC: ${receiptData.rcNumber}` : ''}
          </div>
        </div>
        
        <!-- Classic Info -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
            <span>${receiptData.receiptType.toUpperCase()}: ${receiptData.receiptNumber}</span>
            <span>${receiptData.date}</span>
          </div>
          ${receiptData.receiptType === 'invoice' && receiptData.invoiceNumber ? `
            <div style="font-size: 11px; margin-bottom: 5px;">
              Invoice #: ${receiptData.invoiceNumber}
            </div>
          ` : ''}
          ${receiptData.poNumber ? `<div style="font-size: 11px; margin-bottom: 5px;">PO #: ${receiptData.poNumber}</div>` : ''}
          ${receiptData.dueDate ? `<div style="font-size: 11px; margin-bottom: 5px;">Due Date: ${receiptData.dueDate}</div>` : ''}
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span>Cashier: ${receiptData.cashierName}</span>
            <span>${receiptData.time}</span>
          </div>
        </div>
        
        <!-- Customer Info -->
        ${receiptData.includeBillTo && receiptData.billToName ? `
          <div style="margin-bottom: 20px; padding: 10px; border: 1px dashed #000;">
            <div style="font-size: 11px; font-weight: bold; margin-bottom: 5px;">BILL TO:</div>
            <div style="font-size: 11px;">${receiptData.billToName}</div>
            ${receiptData.billToAddress ? `<div style="font-size: 10px;">${receiptData.billToAddress}</div>` : ''}
            ${receiptData.billToPhone ? `<div style="font-size: 10px;">Tel: ${receiptData.billToPhone}</div>` : ''}
          </div>
        ` : ''}
        
        <!-- Separator -->
        <div style="border-top: 1px dashed #000; margin: 20px 0;"></div>
        
        <!-- Classic Items -->
        <div style="margin-bottom: 20px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px;">
            <span style="flex: 2;">ITEM</span>
            <span style="text-align: center; flex: 0.5;">QTY</span>
            <span style="text-align: center; flex: 0.5;">UNIT</span>
            <span style="text-align: right; flex: 1;">PRICE</span>
            <span style="text-align: right; flex: 1;">AMOUNT</span>
          </div>
          ${receiptData.items.map((item, index) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="flex: 2;">${item.name}</span>
              <span style="text-align: center; flex: 0.5;">${item.quantity}</span>
              <span style="text-align: center; flex: 0.5;">
                ${item.unit && item.unit !== 'Piece' ? item.unit : '-'}
              </span>
              <span style="text-align: right; flex: 1;">${formatNaira(item.price)}</span>
              <span style="text-align: right; flex: 1; font-weight: bold;">${formatNaira(item.price * item.quantity)}</span>
            </div>
            ${item.description ? `
              <div style="font-size: 10px; color: #666; margin-left: 10px; margin-bottom: 5px;">
                ${item.description}
              </div>
            ` : ''}
          `).join('')}
        </div>
        
        <!-- Separator -->
        <div style="border-top: 1px dashed #000; margin: 20px 0;"></div>
        
        <!-- Classic Totals -->
        <div style="margin-bottom: 20px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span>${formatNaira(subtotal)}</span>
          </div>
          ${receiptData.includeDiscount && receiptData.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Discount:</span>
              <span>-${formatNaira(discount)}</span>
            </div>
          ` : ''}
          ${receiptData.deliveryFee > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Delivery Fee:</span>
              <span>${formatNaira(receiptData.deliveryFee)}</span>
            </div>
          ` : ''}
          ${receiptData.includeVAT ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>VAT (${receiptData.vatRate}%):</span>
              <span>${formatNaira(vat)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #000;">
            <span>TOTAL:</span>
            <span>${formatNaira(total)}</span>
          </div>
        </div>
        
        <!-- Classic Payment -->
        <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin: 20px 0; font-size: 11px;">
          <div style="margin-bottom: 5px;">Payment: ${receiptData.paymentMethod}</div>
          ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
            <div style="display: flex; justify-content: space-between;">
              <span>Amount Paid: ${formatNaira(receiptData.amountPaid)}</span>
              <span>Change: ${formatNaira(change)}</span>
            </div>
          ` : ''}
        </div>
        
        <!-- Notes -->
        ${receiptData.customerNotes ? `
          <div style="margin-bottom: 15px; font-size: 10px;">
            <div style="font-weight: bold; margin-bottom: 3px;">Notes:</div>
            <div>${receiptData.customerNotes}</div>
          </div>
        ` : ''}
        
        <!-- Terms & Conditions -->
        ${receiptData.includeTerms && receiptData.termsAndConditions ? `
          <div style="margin-bottom: 15px; font-size: 9px;">
            <div style="font-weight: bold; margin-bottom: 3px;">Terms & Conditions:</div>
            <div style="white-space: pre-line;">${receiptData.termsAndConditions}</div>
          </div>
        ` : ''}
        
        <!-- Signature -->
        ${receiptData.includeSignature ? `
          <div style="margin: 25px 0;">
            <div style="display: flex; justify-content: space-between;">
              <div style="text-align: center; flex: 1;">
                <div style="height: 40px; border-bottom: 1px solid #000; margin-bottom: 5px; position: relative;">
                  ${receiptData.signatureData ? `
                    <img src="${receiptData.signatureData}" alt="Signature" style="max-height: 30px; position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);">
                  ` : ''}
                </div>
                <div style="font-size: 9px;">AUTHORIZED SIGNATURE</div>
                <div style="font-size: 8px; color: #666;">
                  ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="height: 40px; border-bottom: 1px solid #000; margin-bottom: 5px;"></div>
                <div style="font-size: 9px;">Customer</div>
              </div>
            </div>
          </div>
        ` : ''}
        
        <!-- Classic Footer -->
        <div style="text-align: center; margin-top: 30px; font-size: 10px;">
          <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 8px 0; margin: 10px 0;">
            ${receiptData.footerMessage || 'Thank you for your purchase!'}
          </div>
          <div style="margin-top: 15px;">
            <div>${receiptData.receiptNumber}</div>
            <div style="margin-top: 5px; color: #666;">
              ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

// Helper function to generate print HTML
export const generatePrintHTML = (templateId, receiptData, companyLogo, formatNaira, calculations) => {
  const template = printTemplates[templateId] || printTemplates.modern;
  return template(receiptData, companyLogo, formatNaira, calculations);
};