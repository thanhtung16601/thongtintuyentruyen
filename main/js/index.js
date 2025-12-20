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
    body: JSON.stringify({
      action: "create",
      ...formData,
    }),
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
  const btnCopy = document.getElementById("btnCopy");

  // Nếu có mã → hiện nút copy
  if (iCode) {
    btnCopy.classList.remove("d-none");
  } else {
    btnCopy.classList.add("d-none");
  }

  document.getElementById("popupMessage").innerHTML = message;
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
 * Kiểm tra mã visitCode người dùng nhập
 * - Tìm trong mảng data (đã load từ API)
 * - Thông báo kết quả
 */
document.getElementById("btnCheck").addEventListener("click", checkVisitCode);
function checkVisitCode() {
  const codeInput = document.getElementById("searchCode").value.trim();

  if (!codeInput) {
    showPopup("Vui lòng nhập mã kiểm tra!");
    return;
  }

  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      // 🔍 Tìm theo visitCode
      const found = data.find(
        (item) => String(item.visitCode).trim() === codeInput
      );

      if (!found) {
        showPopup("❌ Không tìm thấy mã kiểm tra!");
        return;
      }
      let message = "";

      switch (found.trangthai) {
        case "đã từ chối":
          message = `
      <div style="line-height:1.8; text-align:left">
        <div style="font-size:16px; font-weight:600; color:#dc2626; margin-bottom:8px">
          ❌ Đăng ký bị từ chối
        </div>

        <div>👤 <b>Họ tên:</b> ${found.hoten}</div>
        <div>🪖 <b>Quân nhân:</b> ${found.quannhan}</div>
        <div>🏢 <b>Đơn vị:</b> ${found.donvi}</div>
        <div>📅 <b>Ngày thăm:</b> ${formatDateTimeVN(found.ngaytham)}</div>

        <div>
          📌 <b>Trạng thái:</b>
          <span style="font-weight:600; color:red">
            Căn cứ vào tình hình thực hiện nhiệm vụ của đơn vị, nên tuần này đơn vị không giải quyết thăm thâm đối
            với đồng chí ${
              found.quannhan
            }. Kính mong gia đình thông cảm và sắp xếp vào thời gian khác.
          </span>
        </div>
      </div>
    `;
          break;

        case "đăng ký":
          message = `
      <div style="line-height:1.8; text-align:left">
        <div style="font-size:16px; font-weight:600; color:#f59e0b; margin-bottom:8px">
          ⏳ Đang chờ xác nhận
        </div>

        <div>👤 <b>Họ tên:</b> ${found.hoten}</div>
        <div>🪖 <b>Quân nhân:</b> ${found.quannhan}</div>
        <div>🏢 <b>Đơn vị:</b> ${found.donvi}</div>
        <div>📅 <b>Ngày thăm:</b> ${formatDateTimeVN(found.ngaytham)}</div>

        <div>
          <span style="font-weight:600; color:orange">
            ⏳ <i>Đang chờ trực ban kiểm duyệt. Vui lòng thử lại sau.</i>
          </span>
      </div>
    `;
          break;

        default: // đã xác nhận
          message = `
      <div style="line-height:1.8; text-align:left">
        <div style="font-size:16px; font-weight:600; color:#16a34a; margin-bottom:8px">
          ✅ Đăng ký đã được xác nhận
        </div>

        <div>👤 <b>Họ tên:</b> ${found.hoten}</div>
        <div>🪖 <b>Quân nhân:</b> ${found.quannhan}</div>
        <div>🏢 <b>Đơn vị:</b> ${found.donvi}</div>
        <div>📅 <b>Ngày thăm:</b> ${formatDateTimeVN(found.ngaytham)}</div>

        <div>
          📌 <b>Trạng thái:</b>
          <span style="font-weight:600; color:green">
            ✅ Đã xác nhận
          </span>
        </div>
      </div>
    `;
          break;
      }

      showPopup(message);
    })
    .catch((err) => {
      console.error("Lỗi fetch data:", err);
      showPopup("⚠️ Lỗi hệ thống, vui lòng thử lại!");
    });
}

document.getElementById("feedbackForm").addEventListener("submit", sendComment);
function sendComment(e) {
  e.preventDefault(); // ⛔ chặn reload form

  const form = document.getElementById("feedbackForm");
  const formData = new FormData(form);

  const data = {
    hoten: formData.get("hoten"),
    sdt: formData.get("sdt"),
    donvi: formData.get("donvi"),
    noidung: formData.get("noidung"),
  };

  console.log("Dữ liệu góp ý:", data);
  showPopup("Đã gửi ý kiến lên đơn vị.");
  form.reset();
}

function renderLocation() {
  const tinhSelect = document.getElementById("tinhthanh");
  const xaSelect = document.getElementById("xahuyen");

  fetch("https://34tinhthanh.com/api/provinces")
    .then((res) => res.json())
    .then((provinces) => {
      provinces.forEach((tinh) => {
        const opt = document.createElement("option");
        opt.value = tinh.name; // ✅ LƯU TÊN TỈNH
        opt.textContent = tinh.name; // hiển thị tên
        opt.dataset.code = tinh.province_code; // giữ code để dùng nội bộ
        tinhSelect.appendChild(opt);
      });

      tinhSelect.addEventListener("change", () => {
        xaSelect.innerHTML = '<option value="">-- Chọn xã/phường --</option>';

        const selectedOption = tinhSelect.selectedOptions[0];
        if (!selectedOption) return;

        const provinceCode = selectedOption.dataset.code; // lấy code từ dataset

        fetch(`https://34tinhthanh.com/api/wards?province_code=${provinceCode}`)
          .then((res) => res.json())
          .then((wards) => {
            wards.forEach((xa) => {
              const opt = document.createElement("option");
              opt.value = xa.ward_name; // ✅ tên xã
              opt.textContent = xa.ward_name;
              xaSelect.appendChild(opt);
            });
          });
      });
    })
    .catch((err) => console.error("Lỗi tải tỉnh/thành:", err));
}

/**
 * Khởi tạo khi load trang
 */
setDateTimeRules();
setMinDateTime();
renderLocation();
