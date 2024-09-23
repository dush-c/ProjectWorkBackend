//#region generateIBAN
function generateRandomDigits(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }
  
  function generateRandomChars(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  function mod97(iban: string): number {
    let remainder = iban;
    let block;
  
    // Process the number in chunks of 9 digits
    while (remainder.length > 2) {
      block = remainder.slice(0, 9); // Take the first 9 digits
      remainder =
        (parseInt(block, 10) % 97).toString() + remainder.slice(block.length);
    }
  
    // Process the final remainder
    return parseInt(remainder, 10) % 97;
  }
  
  function calculateCheckDigits(ibanWithoutCheckDigits: string): string {
    // Move the country code and check digits to the end
    const rearranged =
      ibanWithoutCheckDigits.slice(4) + ibanWithoutCheckDigits.slice(0, 4);
  
    // Replace each letter with two digits (A = 10, B = 11, ..., Z = 35)
    const converted = rearranged.replace(/[A-Z]/g, (char) =>
      (char.charCodeAt(0) - 55).toString()
    );
  
    // Perform modulo 97 on the number
    const remainder = mod97(converted);
  
    // Check digits are 98 minus the remainder of the modulo 97
    const checkDigits = 98 - remainder;
  
    return checkDigits.toString().padStart(2, "0");
  }
  
export default function generateIBAN(): string {
    const countryCode = "IT";
  
    // Bank code: 1 letter + 5 digits
    const bankCode = generateRandomChars(1) + generateRandomDigits(5);
  
    // Branch code: 5 digits
    const branchCode = generateRandomDigits(5);
  
    // Account number: 12 alphanumeric characters
    const accountNumber = generateRandomChars(1) + generateRandomDigits(11);
  
    // Create IBAN without check digits (will calculate them later)
    let ibanWithoutCheckDigits =
      countryCode + "00" + bankCode + branchCode + accountNumber;
  
    // Calculate check digits
    const checkDigits = calculateCheckDigits(ibanWithoutCheckDigits);
  
    // Return final IBAN with correct check digits
    return countryCode + checkDigits + bankCode + branchCode + accountNumber;
  }
  
  //#endregion
  