import CryptoJS from 'crypto-js';

// 환경 변수에서 암호화 키를 가져오거나 기본값 사용
const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || 'your-secret-key';

// 데이터 암호화
export const encrypt = (data) => {
  // 데이터를 JSON 문자열로 변환 후 AES 암호화
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// 암호화된 데이터를 복호화
export const decrypt = (ciphertext) => {
  // AES 복호화 수행
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  try {
    // 복호화된 데이터를 JSON 파싱하여 반환
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    // 복호화 실패 시 null 반환
    return null;
  }
};