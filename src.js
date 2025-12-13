/**
 * =========================================================
 * XỬ LÝ FORM ĐĂNG KÝ THĂM THÂN
 * - Validate dữ liệu người dùng
 * - Sinh mã định danh (visitCode)
 * - Gửi dữ liệu lên API
 * - Hiển thị popup thông báo
 *
 * @author NgocKhanh
 * =========================================================
 */

/**
 * Lắng nghe sự kiện submit form đăng ký
 * - Validate toàn bộ dữ liệu
 * - Kiểm tra giờ thăm hợp lệ (10:00 – 16:00)
 * - Không cho chọn thời gian quá khứ
 * - Tạo mã visitCode
 * - Gửi dữ liệu lên server
 */
document.getElementById("visitForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const hoten = document.getElementById("hoten").value.trim();
  const cccd = document.getElementById("cccd").value.trim();
  const quanhe = document.getElementById("quanhe").value.trim();
  const quannhan = document.getElementById("quannhan").value.trim();
  const sdt = document.getElementById("sdt").value.trim();
  const tinh = document.getElementById("tinhthanh").value;
  const xa = document.getElementById("xahuyen").value;
  const donvi = document.getElementById("donvi").value.trim();
  const ngayThamValue = document.getElementById("ngaytham").value;

  const date = new Date(ngayThamValue);
  const hour = date.getHours();
  const visitCode = generateVisitCode(cccd, date);

  // ================= VALIDATE =================
  if (!hoten) return showPopup("Vui lòng nhập họ tên!");
  if (!cccd) return showPopup("Vui lòng nhập số CCCD!");
  if (!/^\d{12}$/.test(cccd)) return showPopup("CCCD phải gồm đúng 12 chữ số!");
  if (!quanhe) return showPopup("Vui lòng nhập mối quan hệ!");
  if (!quannhan) return showPopup("Vui lòng nhập tên quân nhân!");
  if (!sdt) return showPopup("Vui lòng nhập số điện thoại!");
  if (!/^0\d{9}$/.test(sdt))
    return showPopup("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)!");
  if (!tinh) return showPopup("Vui lòng chọn tỉnh/thành phố!");
  if (!xa) return showPopup("Vui lòng chọn xã/phường!");
  if (!donvi) return showPopup("Vui lòng nhập đơn vị!");
  if (!ngayThamValue) return showPopup("Vui lòng chọn ngày giờ thăm!");
  if (hour < 10 || hour >= 16)
    return showPopup("Giờ thăm hợp lệ: 10:00 – 16:00");
  if (date.getTime() < Date.now())
    return showPopup("Không được chọn thời gian trong quá khứ!");

  // ================= DỮ LIỆU GỬI =================
  const formData = {
    visitCode,
    hoten,
    cccd,
    quanhe,
    quannhan,
    sdt,
    tinhthanhpho: tinh,
    xahuyen: xa,
    donvi,
    ngaytham: formatDateTimeVN(date),
    thoigian: new Date().toLocaleString(),
  };

  addPeople(formData);
});

/**
 * Gửi dữ liệu đăng ký lên API (Google Apps Script)
 * @param {Object} formData - Dữ liệu đăng ký thăm thân
 */
function addPeople(formData) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(formData),
  })
    .then(() => {
      showPopup("Đăng ký thành công! Chờ phê duyệt.", formData.visitCode);
    })
    .catch(() => {
      showPopup("Đăng ký thất bại! Vui lòng thử lại.");
    })
    .finally(() => {
      document.getElementById("visitForm").reset();
    });
}

/**
 * =========================================================
 * XỬ LÝ NGÀY GIỜ THĂM
 * =========================================================
 */

/**
 * Format Date sang định dạng dd/mm/yyyy hh:mm (VN)
 * @param {Date | string} isoString
 * @returns {string}
 */
const ngayThamInput = document.getElementById("ngaytham");
function formatDateTimeVN(isoString) {
  const d = new Date(isoString);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(
    2,
    "0"
  )}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Đặt thời gian nhỏ nhất cho input datetime-local
 * (Không cho chọn quá khứ)
 */
function setMinDateTime() {
  const now = new Date();
  ngayThamInput.min = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/**
 * Giới hạn giờ thăm trong ngày:
 * - Chỉ cho phép từ 10:00 đến 16:00
 * - Sau 16:00 sẽ tự động chuyển sang ngày hôm sau
 *
 * @author NgocKhanh
 */
function setDateTimeRules() {
  const now = new Date();
  const START_HOUR = 10;
  const END_HOUR = 16;

  let minHour = now.getHours();
  let minMinute = now.getMinutes();

  if (minHour < START_HOUR) {
    minHour = START_HOUR;
    minMinute = 0;
  }

  if (minHour >= END_HOUR) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    ngayThamInput.min = `${tomorrow.getFullYear()}-${String(
      tomorrow.getMonth() + 1
    ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}T10:00`;
  } else {
    ngayThamInput.min = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
      minHour
    ).padStart(2, "0")}:${String(minMinute).padStart(2, "0")}`;
  }
}

/**
 * Kiểm tra giờ khi người dùng thay đổi input
 * - Nếu ngoài khung giờ cho phép → reset
 */
ngayThamInput.addEventListener("change", () => {
  const hour = new Date(ngayThamInput.value).getHours();
  if (hour < 10 || hour >= 16) {
    showPopup("⛔ Giờ thăm chỉ từ 10:00 đến 16:00!");
    ngayThamInput.value = "";
  }
});

/**
 * =========================================================
 * POPUP THÔNG BÁO
 * =========================================================
 */

/**
 * Hiển thị popup thông báo
 * @param {string} message - Nội dung thông báo
 * @param {string} [iCode] - Mã kiểm tra (nếu có)
 */
function showPopup(message, iCode = "") {
  document.getElementById("popupMessage").textContent = message;
  document.getElementById("codeText").textContent = iCode || "";
  document.getElementById("popup").style.display = "flex";
}

/**
 * Đóng popup
 */
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/**
 * Sao chép mã kiểm tra vào clipboard
 */
function copyCode() {
  const codeText = document.getElementById("codeText").innerText;
  if (!codeText) return showPopup("Không có mã để sao chép!");
  navigator.clipboard.writeText(codeText).then(() => {
    document.getElementById("popupMessage").innerText =
      "Đã sao chép mã vào clipboard ✅";
  });
}

/**
 * Khởi tạo khi load trang
 */
setDateTimeRules();
setMinDateTime();
