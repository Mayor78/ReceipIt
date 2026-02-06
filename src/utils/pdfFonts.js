// utils/pdfFonts.js
import { Font } from '@react-pdf/renderer';

// Register fonts with fallbacks
try {
  // Try to register Roboto from Google Fonts
  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
        fontWeight: 'normal',
      },
      {
        src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.ttf',
        fontWeight: 'bold',
      },
    ],
  });
} catch (error) {
  console.log('Failed to load Roboto font, using fallback');
}

// Fallback to Helvetica
Font.register({
  family: 'Helvetica',
});

// Define a default font family
export const defaultFontFamily = 'Roboto';