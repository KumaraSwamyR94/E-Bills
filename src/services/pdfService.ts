import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generateAndShareBillPdf = async (shop: any, bill: any) => {
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
            body { 
                font-family: 'Courier New', Courier, monospace; 
                padding: 40px; 
                color: #000; 
                max-width: 800px; 
                margin: 0 auto;
            }
            .header { 
                text-align: center; 
                margin-bottom: 40px; 
                position: relative;
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: bold; 
                text-transform: uppercase; 
                letter-spacing: 2px;
            }
            .header p { 
                margin: 5px 0; 
                font-size: 16px; 
                font-weight: bold;
            }
            .date-section {
                text-align: right;
                margin-bottom: 20px;
                font-size: 16px;
                font-weight: bold;
            }
            
            .bill-to {
                margin-bottom: 30px;
                font-size: 18px;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
            }

            .bill-table { 
                width: 100%; 
                border-collapse: collapse; 
                font-size: 18px;
                font-weight: bold; 
            }
            .bill-table td { 
                padding: 15px 5px; 
                border-bottom: 1px solid #ccc; 
            }
            .bill-table .label { 
                width: 60%; 
            }
            .bill-table .value { 
                text-align: right; 
                width: 40%; 
            }
            
            .total-row td { 
                border-top: 3px solid #000; 
                border-bottom: 3px double #000;
                padding-top: 20px;
                font-size: 22px; 
            }
        </style>
      </head>
      <body>
        <div class="date-section">
            Date: ${new Date(bill.readingDate).toLocaleDateString()}
        </div>

        <div class="header">
            <h1>Balaji Complex</h1>
            <p>Pavagada Road</p>
            <p>Challakere</p>
            <p>577522</p>
        </div>
        
        <div class="bill-to">
            Shop: ${shop.shopNumber} - ${shop.tenantName}
        </div>
        
        <table class="bill-table">
            <tr>
                <td class="label">Previous reading</td>
                <td class="value">${bill.previousReading} units</td>
            </tr>
            <tr>
                <td class="label">Current reading</td>
                <td class="value">${bill.currentReading} units</td>
            </tr>
            <tr>
                <td class="label">Units used</td>
                <td class="value">${bill.unitsConsumed.toFixed(2)}</td>
            </tr>
            <tr>
                <td class="label">Price Per Unit</td>
                <td class="value">₹ ${bill.ratePerUnit.toFixed(2)}</td>
            </tr>
            <tr>
                <td class="label">Minimum Price</td>
                <td class="value">₹ ${bill.fixedCharges.toFixed(2)}</td>
            </tr>
            
            <tr class="total-row">
                <td class="label">Total Amount Payabele</td>
                <td class="value">₹ ${bill.totalAmount.toFixed(2)}</td>
            </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error("Error generating/sharing PDF:", error);
    throw error;
  }
};
