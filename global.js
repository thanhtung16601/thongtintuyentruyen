/**
 * Chuyển đổi thời gian sang định dạng Việt Nam
 * dd/mm/yyyy hh:mm
 *
 * @param {string|Date} isoString - Chuỗi thời gian ISO hoặc đối tượng Date
 * @returns {string} Thời gian đã format theo chuẩn VN
 *
 * @example
 * formatDateTimeVN("2025-12-14T03:37")
 * // => "14/12/2025 10:37"
 *
 * @author NgocKhanh
 */
function formatDateTimeVN(isoString) {
  const d = new Date(isoString);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minute}`;
}

/**
 * Tạo mã định danh cho lượt thăm (visitCode)
 * Cấu trúc mã:
 * [4 số cuối CCCD] - [MMDDYY] - [HHMMSS]
 *
 * @param {string} cccd - Số CCCD (12 chữ số)
 * @param {Date} dateObj - Thời điểm đăng ký / thời gian thăm
 * @returns {string} Mã định danh lượt thăm
 *
 * @example
 * generateVisitCode("012345678912", new Date("2025-12-14T10:37:05"))
 * // => "8912-121425-103705"
 *
 * @author NgocKhanh
 */
function generateVisitCode(cccd, dateObj) {
  // 4 số cuối CCCD
  const last4 = cccd.slice(-4);

  // Ngày
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const yy = String(dateObj.getFullYear()).slice(-2);

  // Giờ
  const hh = String(dateObj.getHours()).padStart(2, "0");
  const mi = String(dateObj.getMinutes()).padStart(2, "0");
  const ss = String(dateObj.getSeconds()).padStart(2, "0");

  return `${last4}-${mm}${dd}${yy}-${hh}${mi}${ss}`;
}
