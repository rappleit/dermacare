import { pdf } from '@react-pdf/renderer';
import ReferralPDF from './PDFGenerator';

/**
 * Generate a PDF blob from referral data
 * @param {Object} referralData - Data from the referral form
 * @param {Object} patientData - Data from the patient history form
 * @param {Array} diagnosisData - Parsed diagnosis data
 * @returns {Promise<Blob>} - PDF blob
 */
export const generateReferralPDF = async (referralData, patientData, diagnosisData) => {
  try {
    // Create the PDF document
    const pdfDocument = <ReferralPDF 
      referralData={referralData} 
      patientData={patientData} 
      diagnosisData={diagnosisData} 
    />;
    
    // Convert to blob
    const blob = await pdf(pdfDocument).toBlob();
    return blob;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate referral PDF");
  }
};

/**
 * Save the PDF blob as a file
 * @param {Blob} blob - PDF blob
 * @param {string} filename - Name of the file to save
 */
export const downloadPDF = (blob, filename = 'dermatology-referral.pdf') => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to the document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the object URL
  URL.revokeObjectURL(url);
};