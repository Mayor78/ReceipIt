// Print-optimized templates for generating print HTML
export const printTemplates = {
  modern: (receiptData, companyLogo, formatNaira, calculations) => {
    const {
      subtotal,
      discount,
      vat,
      total,
      change,
      deliveryFee = 0
    } = calculations;
    
    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 210mm; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #3B82F6;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 60px; margin-bottom: 15px;">` : ''}
          <h1 style="color: #111827; margin: 10px 0; font-size: 24px; font-weight: 700;">${receiptData.storeName}</h1>
          <p style="color: #6B7280; margin: 5px 0; font-size: 13px;">${receiptData.storeAddress}</p>
          <p style="color: #6B7280; margin: 5px 0; font-size: 13px;">Tel: ${receiptData.storePhone}</p>
        </div>
        
        <!-- Document Info -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; background: #F9FAFB; padding: 20px; border-radius: 8px;">
          <div>
            <h3 style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">${receiptData.receiptType} Details</h3>
            <p style="margin: 5px 0; color: #111827;"><strong>Receipt #:</strong> ${receiptData.receiptNumber}</p>
            <p style="margin: 5px 0; color: #111827;"><strong>Cashier:</strong> ${receiptData.cashierName}</p>
          </div>
          <div>
            <h3 style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">Date & Time</h3>
            <p style="margin: 5px 0; color: #111827;"><strong>Date:</strong> ${receiptData.date}</p>
            <p style="margin: 5px 0; color: #111827;"><strong>Time:</strong> ${receiptData.time}</p>
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
        
        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
          <thead>
            <tr style="background: #3B82F6; color: white;">
              <th style="padding: 14px 10px; text-align: left; font-weight: 600;">Item</th>
              <th style="padding: 14px 10px; text-align: center; font-weight: 600;">Qty</th>
              <th style="padding: 14px 10px; text-align: right; font-weight: 600;">Price</th>
              <th style="padding: 14px 10px; text-align: right; font-weight: 600;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${receiptData.items.map((item, index) => `
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 14px 10px;">
                  <div style="font-weight: 500; color: #111827;">${item.name}</div>
                  ${item.description ? `<div style="font-size: 12px; color: #6B7280; margin-top: 3px;">${item.description}</div>` : ''}
                </td>
                <td style="padding: 14px 10px; text-align: center; color: #374151;">${item.quantity}</td>
                <td style="padding: 14px 10px; text-align: right; color: #374151;">${formatNaira(item.price)}</td>
                <td style="padding: 14px 10px; text-align: right; font-weight: 600; color: #111827;">${formatNaira(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Totals -->
        <div style="border-top: 2px solid #E5E7EB; padding-top: 25px;">
          <div style="max-width: 300px; margin-left: auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #F3F4F6;">
              <span style="color: #6B7280;">Subtotal:</span>
              <span style="font-weight: 500;">${formatNaira(subtotal)}</span>
            </div>
            ${receiptData.includeDiscount && receiptData.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #F3F4F6; color: #DC2626;">
                <span>Discount:</span>
                <span>-${formatNaira(discount)}</span>
              </div>
            ` : ''}
            ${receiptData.deliveryFee > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #F3F4F6;">
                <span>Delivery:</span>
                <span>${formatNaira(receiptData.deliveryFee)}</span>
              </div>
            ` : ''}
            ${receiptData.includeVAT ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #F3F4F6;">
                <span>VAT (${receiptData.vatRate}%):</span>
                <span>${formatNaira(vat)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: #3B82F6; margin-top: 15px; padding-top: 15px; border-top: 2px solid #3B82F6;">
              <span>TOTAL:</span>
              <span>${formatNaira(total)}</span>
            </div>
          </div>
        </div>
        
        <!-- Payment Info -->
        <div style="background: linear-gradient(90deg, #FEF3C7, #FDE68A); padding: 20px; margin: 30px 0; border-radius: 8px; border-left: 4px solid #F59E0B;">
          <h3 style="color: #92400E; margin-bottom: 10px; font-weight: 600; font-size: 15px;">PAYMENT INFORMATION</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div>
              <strong style="color: #92400E;">Method:</strong> ${receiptData.paymentMethod}
            </div>
            ${receiptData.paymentMethod === 'Cash' && receiptData.amountPaid > 0 ? `
              <div>
                <strong style="color: #92400E;">Amount Paid:</strong> ${formatNaira(receiptData.amountPaid)}
              </div>
              <div>
                <strong style="color: #92400E;">Change:</strong> ${formatNaira(change)}
              </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #E5E7EB; color: #6B7280; font-size: 12px;">
          <div style="display: flex; justify-content: center; gap: 2px; margin-bottom: 15px; height: 40px;">
            ${Array.from({ length: 40 }).map(() => 
              `<div style="width: 2px; background: #374151; height: ${Math.random() * 30 + 10}px;"></div>`
            ).join('')}
          </div>
          <p style="margin: 8px 0;"><strong style="color: #111827;">${receiptData.receiptNumber}</strong></p>
          <p style="margin: 8px 0;">${receiptData.footerMessage || 'Thank you for your business!'}</p>
          <p style="margin-top: 15px; font-size: 11px; color: #9CA3AF;">
            Generated on ${new Date().toLocaleString()} • Powered by ReceiptIt
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
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px solid #D1D5DB;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 50px; margin-bottom: 15px;">` : ''}
          <h1 style="color: #111827; margin: 10px 0; font-size: 22px; font-weight: 600; letter-spacing: -0.5px;">${receiptData.storeName}</h1>
          <p style="color: #4B5563; margin: 5px 0; font-size: 13px; font-weight: 400;">${receiptData.storeAddress}</p>
          <p style="color: #4B5563; margin: 5px 0; font-size: 13px;">Tel: ${receiptData.storePhone}</p>
        </div>
        
        <!-- Document Info -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #E5E7EB;">
          <div>
            <p style="margin: 8px 0; color: #4B5563;"><strong>${receiptData.receiptType} #:</strong> ${receiptData.receiptNumber}</p>
            <p style="margin: 8px 0; color: #4B5563;"><strong>Date:</strong> ${receiptData.date}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 8px 0; color: #4B5563;"><strong>Time:</strong> ${receiptData.time}</p>
            <p style="margin: 8px 0; color: #4B5563;"><strong>Cashier:</strong> ${receiptData.cashierName}</p>
          </div>
        </div>
        
        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px;">
          <thead>
            <tr>
              <th style="padding: 12px 10px; text-align: left; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981;">Description</th>
              <th style="padding: 12px 10px; text-align: center; color: #374151; font-weight: 600; border-bottom: 2px solid #10B981;">Qty</th>
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
        <!-- Decorative Header -->
        <div style="text-align: center; margin-bottom: 30px; padding: 30px 0; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #F59E0B, #EC4899);"></div>
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 50px; margin-bottom: 15px; filter: brightness(0) invert(1);">` : ''}
          <h1 style="margin: 10px 0; font-size: 26px; font-weight: 700; letter-spacing: 1px;">${receiptData.storeName}</h1>
          <p style="margin: 5px 0; opacity: 0.9; font-size: 14px;">${receiptData.storeAddress}</p>
        </div>
        
        <!-- Receipt Details -->
        <div style="padding: 0 30px;">
          <!-- Document Info -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 25px; border-bottom: 2px dashed #E5E7EB;">
            <div style="text-align: center; flex: 1;">
              <div style="color: #8B5CF6; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">${receiptData.receiptType} Number</div>
              <div style="font-size: 18px; font-weight: 700; color: #111827;">${receiptData.receiptNumber}</div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="color: #8B5CF6; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">Date & Time</div>
              <div style="font-size: 14px; color: #4B5563;">${receiptData.date} • ${receiptData.time}</div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="color: #8B5CF6; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">Cashier</div>
              <div style="font-size: 14px; color: #4B5563;">${receiptData.cashierName}</div>
            </div>
          </div>
          
          <!-- Items Table -->
          <div style="margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px;">
              <thead>
                <tr>
                  <th style="padding: 16px 12px; text-align: left; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED;">Item Description</th>
                  <th style="padding: 16px 12px; text-align: center; color: #7C3AED; font-weight: 600; border-bottom: 2px solid #7C3AED;">Qty</th>
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
        <!-- Simple Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 40px; margin-bottom: 10px;">` : ''}
          <h1 style="color: #111827; margin: 5px 0; font-size: 18px; font-weight: 400;">${receiptData.storeName}</h1>
          <p style="color: #6B7280; margin: 3px 0; font-size: 12px;">${receiptData.storeAddress}</p>
          <p style="color: #6B7280; margin: 3px 0; font-size: 12px;">${receiptData.storePhone}</p>
        </div>
        
        <!-- Simple Info -->
        <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #F3F4F6;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6B7280;">
            <span>${receiptData.receiptType} #${receiptData.receiptNumber}</span>
            <span>${receiptData.date} ${receiptData.time}</span>
          </div>
          <div style="font-size: 12px; color: #6B7280; margin-top: 5px;">
            Cashier: ${receiptData.cashierName}
          </div>
        </div>
        
        <!-- Simple Items -->
        <div style="margin-bottom: 25px;">
          ${receiptData.items.map((item, index) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #F3F4F6;">
              <div style="flex: 1;">
                <div style="font-size: 13px; color: #111827; margin-bottom: 3px;">${item.name}</div>
                <div style="font-size: 11px; color: #6B7280;">${item.quantity} × ${formatNaira(item.price)}</div>
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
          ${receiptData.includeVAT ? `
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #6B7280;">
              <span>VAT</span>
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
        
        <!-- Simple Footer -->
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #F3F4F6; color: #9CA3AF; font-size: 11px;">
          <div style="margin-bottom: 10px;">${receiptData.receiptNumber}</div>
          <div>${receiptData.footerMessage || 'Thank you'}</div>
        </div>
      </div>
    `;
  },

  bold: (receiptData, companyLogo, formatNaira, calculations) => {
    const { subtotal, discount, vat, total, change } = calculations;
    
    return `
      <div style="font-family: 'Montserrat', sans-serif; max-width: 210mm; margin: 0 auto;">
        <!-- Bold Header -->
        <div style="background: #EF4444; color: white; padding: 30px; text-align: center; margin-bottom: 30px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 60px; margin-bottom: 15px; filter: brightness(0) invert(1);">` : ''}
          <h1 style="margin: 10px 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">${receiptData.storeName}</h1>
          <p style="margin: 5px 0; opacity: 0.9; font-weight: 500;">${receiptData.storeAddress}</p>
        </div>
        
        <!-- Bold Info -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; padding: 0 20px;">
          <div style="text-align: center;">
            <div style="color: #DC2626; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">Receipt No.</div>
            <div style="font-size: 18px; font-weight: 800; color: #111827;">${receiptData.receiptNumber}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: #DC2626; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">Date</div>
            <div style="font-size: 14px; font-weight: 600; color: #374151;">${receiptData.date}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: #DC2626; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 5px;">Cashier</div>
            <div style="font-size: 14px; font-weight: 600; color: #374151;">${receiptData.cashierName}</div>
          </div>
        </div>
        
        <!-- Bold Items -->
        <div style="padding: 0 20px;">
          <div style="background: #FEE2E2; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <div style="color: #DC2626; font-size: 14px; font-weight: 700; margin-bottom: 20px; text-transform: uppercase;">Items Purchased</div>
            ${receiptData.items.map((item, index) => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #FECACA;">
                <div>
                  <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px;">${item.name}</div>
                  <div style="font-size: 12px; color: #6B7280;">Qty: ${item.quantity}</div>
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
              <span style="color: #9CA3AF;">Subtotal</span>
              <span style="font-weight: 600;">${formatNaira(subtotal)}</span>
            </div>
            ${receiptData.includeDiscount && receiptData.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #F87171;">
                <span>Discount</span>
                <span>-${formatNaira(discount)}</span>
              </div>
            ` : ''}
            ${receiptData.includeVAT ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span>VAT (${receiptData.vatRate}%)</span>
                <span>${formatNaira(vat)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 800; margin-top: 20px; padding-top: 20px; border-top: 2px solid #EF4444;">
              <span>TOTAL</span>
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
        <div style="text-align: center; margin-bottom: 25px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="max-height: 40px; margin-bottom: 10px; filter: grayscale(100%);">` : ''}
          <h1 style="color: #111827; margin: 5px 0; font-size: 16px; font-weight: bold;">${receiptData.storeName}</h1>
          <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 0; margin: 10px 0; font-size: 11px;">
            ${receiptData.storeAddress} • Tel: ${receiptData.storePhone}
          </div>
        </div>
        
        <!-- Classic Info -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
            <span>${receiptData.receiptType.toUpperCase()}: ${receiptData.receiptNumber}</span>
            <span>${receiptData.date}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span>Cashier: ${receiptData.cashierName}</span>
            <span>${receiptData.time}</span>
          </div>
        </div>
        
        <!-- Separator -->
        <div style="border-top: 1px dashed #000; margin: 20px 0;"></div>
        
        <!-- Classic Items -->
        <div style="margin-bottom: 20px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px;">
            <span>ITEM</span>
            <span>QTY</span>
            <span>PRICE</span>
            <span>AMOUNT</span>
          </div>
          ${receiptData.items.map((item, index) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="flex: 2;">${item.name}</span>
              <span style="text-align: center; flex: 0.5;">${item.quantity}</span>
              <span style="text-align: right; flex: 1;">${formatNaira(item.price)}</span>
              <span style="text-align: right; flex: 1; font-weight: bold;">${formatNaira(item.price * item.quantity)}</span>
            </div>
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
        
        <!-- Classic Footer -->
        <div style="text-align: center; margin-top: 30px; font-size: 10px;">
          <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 8px 0; margin: 10px 0;">
            ${receiptData.footerMessage || 'Thank you for your purchase!'}
          </div>
          <div style="margin-top: 15px;">
            <div>${receiptData.receiptNumber}</div>
            <div style="margin-top: 5px; color: #6B7280;">
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