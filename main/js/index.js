/**
 * =========================================================
 * XỬ LÝ FORM ĐĂNG KÝ THĂM THÂN – OPTIMIZED
 * - Validate dữ liệu người dùng
 * - Sinh mã định danh (visitCode) duy nhất
 * - Gửi dữ liệu lên API
 * - Hiển thị popup thông báo
 * =========================================================
 */

const visitForm = document.getElementById("visitForm");
const ngayThamInput = document.getElementById("ngaytham");

// ================= HÀM HỖ TRỢ =================

/**
 * Sinh mã visitCode dựa trên 4 số cuối CCCD + timestamp
 * @param {string} cccd - Số CCCD
 * @param {Date} date - Ngày giờ thăm
 * @returns {string} Mã visitCode
 */
function generateVisitCode(cccd, date) {
  // Lấy 4 chữ số cuối CCCD + 6 chữ số cuối timestamp
  return `${cccd.slice(-4)}-${date.getTime().toString().slice(-6)}`;
}

/**
 * Format Date sang dd/mm/yyyy hh:mm
 * @param {Date} date
 * @returns {string}
 */
function formatDateTimeVN(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Hiển thị popup thông báo
 * @param {string} message - Nội dung
 * @param {string} [code] - Mã kiểm tra, nếu có sẽ hiển thị nút copy
 */
function showPopup(message, code = "") {
  const popup = document.getElementById("popup");
  const btnCopy = document.getElementById("btnCopy");

  document.getElementById("popupMessage").innerHTML = message;
  document.getElementById("codeText").textContent = code;

  btnCopy.classList.toggle("d-none", !code); // ẩn nếu không có code
  popup.style.display = "flex";
}

/**
 * Đóng popup
 */
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/**
 * Sao chép mã visitCode vào clipboard
 */
function copyCode() {
  const code = document.getElementById("codeText").innerText;
  if (!code) return showPopup("Không có mã để sao chép!");
  navigator.clipboard.writeText(code).then(() => {
    showPopup("✅ Đã sao chép mã vào clipboard!", code);
  });
}

/**
 * Cập nhật min date/time cho input
 * - Không cho chọn quá khứ
 * - Giới hạn giờ thăm 10:00 – 16:00
 */
function setMinDateTime() {
  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();

  if (hour < 10) {
    // Trước 10:00 → đặt min là 10:00 hôm nay
    hour = 10;
    minute = 0;
  } else if (hour >= 16) {
    // Sau 16:00 → đặt min là 10:00 ngày mai
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    hour = 10;
    minute = 0;
    now.setFullYear(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate()
    );
  }

  const pad = (n) => String(n).padStart(2, "0");
  ngayThamInput.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(hour)}:${pad(minute)}`;
}

// ================= VALIDATE FORM =================

/**
 * Validate dữ liệu form
 * @param {Object} data - Dữ liệu form
 * @returns {string | null} - Thông báo lỗi, null nếu hợp lệ
 */
function validateFormData(data) {
  const phoneRegex = /^0\d{9}$/;
  const cccdRegex = /^\d{12}$/;
  const date = new Date(data.ngayTham);

  if (!data.hoten) return "Vui lòng nhập họ tên!";
  if (!data.cccd) return "Vui lòng nhập số CCCD!";
  if (!cccdRegex.test(data.cccd)) return "CCCD phải gồm đúng 12 chữ số!";
  if (!data.quanhe) return "Vui lòng nhập mối quan hệ!";
  if (!data.quannhan) return "Vui lòng nhập tên quân nhân!";
  if (!data.sdt) return "Vui lòng nhập số điện thoại!";
  if (!phoneRegex.test(data.sdt))
    return "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)!";
  if (!data.tinhthanhpho) return "Vui lòng chọn tỉnh/thành phố!";
  if (!data.xahuyen) return "Vui lòng chọn xã/phường!";
  if (!data.donvi) return "Vui lòng nhập đơn vị!";
  if (!data.ngayTham) return "Vui lòng chọn ngày giờ thăm!";

  const hour = date.getHours();
  if (hour < 10 || hour >= 16) return "Giờ thăm hợp lệ: 10:00 – 16:00";
  if (date.getTime() < Date.now())
    return "Không được chọn thời gian trong quá khứ!";

  return null; // Hợp lệ
}

// ================= XỬ LÝ SUBMIT =================

visitForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Lấy dữ liệu từ form
  const formData = {
    hoten: document.getElementById("hoten").value.trim(),
    cccd: document.getElementById("cccd").value.trim(),
    quanhe: document.getElementById("quanhe").value.trim(),
    quannhan: document.getElementById("quannhan").value.trim(),
    sdt: document.getElementById("sdt").value.trim(),
    tinhthanhpho: document.getElementById("tinhthanh").value,
    xahuyen: document.getElementById("xahuyen").value,
    donvi: document.getElementById("donvi").value.trim(),
    ngayTham: document.getElementById("ngaytham").value,
  };

  // Validate dữ liệu
  const errorMsg = validateFormData(formData);
  if (errorMsg) return showPopup(`⛔ ${errorMsg}`);

  // Sinh visitCode
  const visitCode = generateVisitCode(
    formData.cccd,
    new Date(formData.ngayTham)
  );

  // Chuẩn hóa ngày giờ VN
  formData.ngaytham = formatDateTimeVN(new Date(formData.ngayTham));
  formData.thoigian = new Date().toLocaleString();
  formData.visitCode = visitCode;

  // Gửi dữ liệu lên API
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "create", ...formData }),
  })
    .then(() => showPopup("✅ Đăng ký thành công! Chờ phê duyệt.", visitCode))
    .catch(() => showPopup("⚠️ Đăng ký thất bại! Vui lòng thử lại."))
    .finally(() => visitForm.reset());
});

// ================= SỰ KIỆN NGÀY GIỜ =================

ngayThamInput.addEventListener("change", () => {
  const hour = new Date(ngayThamInput.value).getHours();
  if (hour < 10 || hour >= 16) {
    showPopup("⛔ Giờ thăm chỉ từ 10:00 đến 16:00!");
    ngayThamInput.value = "";
  }
});

// Khởi tạo min datetime khi load
setMinDateTime();
