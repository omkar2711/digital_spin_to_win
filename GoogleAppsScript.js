/**
 * Google Apps Script to check if a phone number exists in a spreadsheet
 * and handle form submissions from the Spin to Win application.
 */

// Replace with your actual spreadsheet ID
const SPREADSHEET_ID = '1pXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

/**
 * Handle GET requests to check if a phone number exists
 */
function doGet(e) {
  const params = e.parameter;
  const phone = params.phone;
  
  // Log the incoming request
  console.log('Received check request for phone:', phone);
  
  if (!phone) {
    return ContentService.createTextOutput(JSON.stringify({
      exists: false,
      error: 'No phone number provided'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    // Normalize the phone number by removing non-digits
    const normalizedPhone = phone.toString().replace(/\D/g, '');
    console.log('Normalized phone:', normalizedPhone);
    
    // Check if phone number exists in the spreadsheet
    const exists = checkPhoneExists(normalizedPhone);
    console.log('Phone exists check result:', exists);
    
    return ContentService.createTextOutput(JSON.stringify({
      exists: exists
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({
      exists: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Check if a phone number exists in the spreadsheet
 */
function checkPhoneExists(phone) {
  try {
    // Open the spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheets()[0]; // Assuming data is in the first sheet
    
    // Get all phone numbers from column C (3rd column)
    const dataRange = sheet.getRange(2, 3, sheet.getLastRow(), 1);
    const phoneNumbers = dataRange.getValues();
    
    // Convert all values to strings and normalize them
    const normalizedPhoneNumbers = phoneNumbers.map(row => {
      if (!row[0]) return '';
      return row[0].toString().replace(/\D/g, '');
    });
    
    // Check if the normalized phone number exists
    const exists = normalizedPhoneNumbers.some(num => num === phone);
    console.log('Phone check against', normalizedPhoneNumbers.length, 'records. Result:', exists);
    
    return exists;
  } catch (error) {
    console.error('Error in checkPhoneExists:', error);
    throw error;
  }
}

/**
 * Handle POST requests (called directly from doGet for now)
 */
function doPost(e) {
  return doGet(e);
}

/**
 * Test function to verify the script is working correctly
 */
function testPhoneCheck() {
  const result = checkPhoneExists('1234567890');
  console.log('Test result for phone 1234567890:', result);
} 