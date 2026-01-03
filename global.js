/**
 * =========================================================
 * Chuyển đổi thời gian sang định dạng Việt Nam
 * Định dạng: dd/mm/yyyy hh:mm
 * =========================================================
 *
 * @param {string|Date} isoString - Chuỗi ISO hoặc đối tượng Date
 * @returns {string} Thời gian đã format theo chuẩn VN
 *
 * @example
 * formatDateTimeVN("2025-12-14T03:37")
 * // => "14/12/2025 03:37"
 */
function formatDateTimeVN(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d)) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minute}`;
}

/**
 * =========================================================
 * Tạo mã định danh cho lượt thăm (visitCode)
 * Cấu trúc: [4 số cuối CCCD] - [MMDDYY] - [6 ký tự ngẫu nhiên]
 * =========================================================
 *
 * @param {string} cccd - Số CCCD (12 chữ số)
 * @param {Date} dateObj - Thời điểm đăng ký / thời gian thăm
 * @returns {string} Mã định danh lượt thăm
 *
 * @example
 * generateVisitCode("012345678912", new Date("2025-12-14T10:37:05"))
 * // => "8912-121425-A1B2C3"
 */
function generateVisitCode(cccd, dateObj) {
  if (!cccd || !dateObj) return "";

  // Lấy 4 số cuối CCCD
  const last4 = cccd.slice(-4);

  // Lấy ngày tháng năm
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const yy = String(dateObj.getFullYear()).slice(-2);

  // Tạo chuỗi ngẫu nhiên 6 ký tự (A-Z + 0-9)
  const randomStr = random6Chars();

  return `${last4}-${mm}${dd}${yy}-${randomStr}`;
}

/**
 * Tạo chuỗi ngẫu nhiên 6 ký tự (A-Z, 0-9)
 * @returns {string} 6 ký tự
 */
function random6Chars() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * =========================================================
 * Chuyển chuỗi ngày VN dd/mm/yyyy -> đối tượng Date
 * Giờ phút sẽ mặc định là 00:00:00
 * =========================================================
 *
 * @param {string} dateStr - Chuỗi ngày VN (dd/mm/yyyy)
 * @returns {Date|null} Đối tượng Date hoặc null nếu lỗi
 */
function parseVNDate(dateStr) {
  if (!dateStr) return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy) return null;

  return new Date(yyyy, mm - 1, dd, 0, 0, 0);
}

/**
 * =========================================================
 * Lấy ngày (Date) từ field ngày thăm trong row dữ liệu
 * - Chỉ lấy phần ngày, bỏ giờ phút
 * - Hỗ trợ ISO hoặc dd/mm/yyyy hh:mm
 * =========================================================
 *
 * @param {Object} row - Dữ liệu row có thuộc tính ngaytham
 * @returns {Date|null} Ngày thăm hoặc null nếu lỗi
 */
function getRowDate(row) {
  if (!row?.ngaytham) return null;

  // Chuyển sang Date
  let d = new Date(row.ngaytham);
  if (isNaN(d)) {
    // Thử parse dạng dd/mm/yyyy hh:mm
    const vnParts = row.ngaytham.split(" ")[0]; // lấy phần dd/mm/yyyy
    d = parseVNDate(vnParts);
  }

  if (!d) return null;

  // Chỉ giữ phần ngày
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
