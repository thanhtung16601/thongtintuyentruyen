/**
 * ==============================
 * BIẾN & DỮ LIỆU TOÀN CỤC
 * ==============================
 */

/**
 * Biến tạm dùng cho popup xác nhận xoá
 * Lưu index của dòng đang thao tác
 */
let i = 0;
/**
 * ==============================
 * LOAD & FETCH DATA
 * ==============================
 */

/**
 * Gán sự kiện reload dữ liệu thủ công
 */
document.getElementById("reloadBtn").addEventListener("click", loadData);

/**
 * Danh sách dữ liệu lấy từ API (Google Apps Script)
 * @type {Array}
 */
let DATA_STORE = [];
/**
 * Lấy dữ liệu từ API
 * - Fetch danh sách người đăng ký
 * - Render bảng admin
 * - Render danh sách bài viết (postman)
 */
function loadData() {
  fetch(API_URL_CRUD)
    .then((res) => res.json())
    .then((d) => {
      DATA_STORE = d;
      renderTable([]);
      renderPostman(DATA_POST);
    })
    .catch((err) => {
      console.error("Lỗi fetch data:", err);
      document.getElementById("adminBody").innerHTML =
        '<tr><td colspan="9">Lỗi tải dữ liệu</td></tr>';
    });
}
/**
 * ==============================
 * RENDER BẢNG QUẢN LÝ ĐĂNG KÝ
 * ==============================
 */

/**
 * Render bảng danh sách người đăng ký thăm
 * - Hiển thị thông tin cá nhân
 * - Hiển thị trạng thái
 * - Nút duyệt / loại bỏ
 */
function renderTable(paramData) {
  const body = document.getElementById("adminBody");
  body.innerHTML = "";

  let renderData = paramData.length === 0 ? DATA_STORE : paramData;

  renderData.forEach((row, index) => {
    body.innerHTML += `
      <tr key="${index}" id="${row.visitCode}">
        <td>${row.hoten || ""}</td>
        <td>${row.cccd || ""}</td>
        <td>${row.sdt || ""}</td>
        <td>
          ${row.tinhthanhpho || ""} <br>
          <small>${row.xahuyen || ""}</small>
        </td>
        <td>${row.quanhe || ""}</td>
        <td>${row.quannhan || ""}</td>
        <!-- GỘP: ĐƠN VỊ + NGÀY THĂM + TRẠNG THÁI -->
        <td>
          <div><b>Đơn vị:</b> ${row.donvi || ""}</div>
          <div><b>Ngày thăm:</b> ${formatDateTimeVN(row.ngaytham) || ""}</div>
          <div>
            <b>Trạng thái:</b>
            <span style="
              font-weight:600;
              color:${
                row.trangthai === "đã xác nhận"
                  ? "green"
                  : row.trangthai === "đăng ký"
                  ? "orange"
                  : "red"
              };
            ">
              ${
                row.trangthai === "đã xác nhận"
                  ? "✅ Đã xác nhận"
                  : row.trangthai === "đăng ký"
                  ? "⏳ Chờ xác nhận"
                  : "❌ Đã từ chối"
              }
            </span>
          </div>
          <div style="margin-top:4px;">
            <b>Mã:</b>
            <span style="font-weight:600; color:#0a7cff;">
              ${row.visitCode || ""}
            </span>
          </div>
        </td>

        <td style="text-align: center;">
          ${
            row.trangthai === "đã xác nhận"
              ? `
            <button 
              class="btn-xoa d-none"
              style="width:100%"
              onclick="showPopup('${row.visitCode}')"
            >
              Loại bỏ
            </button>
          `
              : row.trangthai !== "đăng ký"
              ? `
            <button 
              class="btn-xoa d-none"
              onclick="showPopup('${row.visitCode}')"
            >
              Loại bỏ
            </button>
          `
              : `
            <button 
              class="btn-duyet"
              onclick="iConfirm('${row.visitCode}')"
            >
              Xác nhận
            </button>

            <button 
              class="btn-xoa"
              onclick="showPopup('${row.visitCode}')"
            >
              Từ chối
            </button>
          `
          }
        </td>
      </tr>
    `;
  });

  totalVisiter(renderData);
}

/**
 * ==============================
 * THỐNG KÊ SỐ LƯỢNG
 * ==============================
 */

/**
 * Tính và hiển thị:
 * - Số đã xác nhận
 * - Số đang chờ
 * - Tổng số lượt đăng ký
 */
function totalVisiter(iData) {
  const daDuyet = iData.filter((x) => x.trangthai === "đã xác nhận").length;
  const tuChoi = iData.filter((x) => x.trangthai === "đã từ chối").length;
  const chuaDuyet = iData.filter(
    (x) => x.trangthai !== "đã xác nhận" && x.trangthai !== "đã từ chối"
  ).length;
  const tong = iData.length;

  document.getElementById("tk-confirm").textContent = daDuyet;
  document.getElementById("tk-wait").textContent = chuaDuyet;
  document.getElementById("tk-refuse").textContent = tuChoi;
  document.getElementById("tk-total").textContent = tong;
}
/**
 * ==============================
 * DUYỆT & XOÁ ĐĂNG KÝ
 * ==============================
 */

/**
 * Duyệt đăng ký (chuyển trạng thái sang "đã xác nhận")
 * @param {number} visitCode - index của dòng dữ liệu
 */
function iConfirm(visitCode) {
  fetch(API_URL_CRUD, {
    method: "POST",
    body: JSON.stringify({
      indexGUI: "manager",
      action: "update",
      visitCode,
      trangthai: "đã xác nhận",
    }),
  })
    .then(() => loadData())
    .catch((err) => console.error("Lỗi duyệt:", err));
}

/**
 * Duyệt đăng ký (chuyển trạng thái sang "đã từ chối")
 * @param {number} visitCode - index của dòng dữ liệu
 */
function iRefuse(visitCode) {
  fetch(API_URL_CRUD, {
    method: "POST",
    body: JSON.stringify({
      indexGUI: "manager",
      action: "update",
      visitCode,
      trangthai: "đã từ chối",
    }),
  })
    .then(() => loadData())
    .catch((err) => console.error("Lỗi duyệt:", err));
}

/**
 * Xoá đăng ký khỏi hệ thống
 * @param {number} visitCode - index của dòng dữ liệu
 */
function iDelete(visitCode) {
  fetch(API_URL_CRUD, {
    method: "POST",
    body: JSON.stringify({
      indexGUI: "manager",
      action: "delete",
      visitCode,
    }),
  })
    .then(() => loadData())
    .catch((err) => console.error("Lỗi xóa:", err));
}
/**
 * ==============================
 * POPUP XÁC NHẬN XOÁ
 * ==============================
 */

/**
 * Hiển thị popup xác nhận xoá
 * @param {number} index - index của dòng cần xoá
 */
function showPopup(index) {
  i = index;
  document.getElementById("popupMessage").textContent =
    "Bạn có muốn từ chối không?";
  document.getElementById("popup").style.display = "flex";
}

/**
 * Đóng popup
 */
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/**
 * Xác nhận xoá và đóng popup
 */
function confirmPopup() {
  iRefuse(i);
  document.getElementById("popup").style.display = "none";
}
/**
 * Tìm kiếm dữ liệu
 * - Theo keyword
 * - Theo khoảng ngày (dd/mm/yyyy)
 */
function searchTable() {
  const keyword = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  const startInput = document.getElementById("startTime").value;
  const endInput = document.getElementById("endTime").value;

  const startDate = startInput ? new Date(startInput) : null;
  const endDate = endInput ? new Date(endInput) : null;

  // Reset giờ để chỉ so ngày
  if (startDate) startDate.setHours(0, 0, 0, 0);
  if (endDate) endDate.setHours(23, 59, 59, 999);

  // Validate ngày
  if (startDate && endDate && startDate > endDate) {
    showPopup("❌ Ngày bắt đầu không được lớn hơn ngày kết thúc!");
    return;
  }

  const filteredData = DATA_STORE.filter((row) => {
    /* ===== KEYWORD FILTER ===== */
    const keywordMatch =
      !keyword ||
      String(row.hoten || "")
        .toLowerCase()
        .includes(keyword) ||
      String(row.cccd || "")
        .toLowerCase()
        .includes(keyword) ||
      String(row.sdt || "")
        .toLowerCase()
        .includes(keyword) ||
      String(row.quannhan || "")
        .toLowerCase()
        .includes(keyword) ||
      String(row.donvi || "")
        .toLowerCase()
        .includes(keyword) ||
      String(row.trangthai || "")
        .toLowerCase()
        .includes(keyword) ||
      String(row.visitCode || "")
        .toLowerCase()
        .includes(keyword);

    /* ===== DATE FILTER (dd/mm/yyyy) ===== */
    let dateMatch = true;
    const rowDate = getRowDate(row);

    if (startDate && rowDate < startDate) dateMatch = false;
    if (endDate && rowDate > endDate) dateMatch = false;

    return keywordMatch && dateMatch;
  });

  const body = document.getElementById("adminBody");
  body.innerHTML = "";

  if (filteredData.length === 0) {
    body.innerHTML = `<tr><td colspan="8">Không tìm thấy kết quả</td></tr>`;
    return;
  }

  renderTable(filteredData);
  totalVisiter(filteredData);
}

/**
 * Chuyển dd/mm/yyyy hh:mm → Date object
 */
function parseVNDateTime(str) {
  if (!str) return null;

  const [datePart, timePart = "00:00"] = str.split(" ");
  const [dd, mm, yyyy] = datePart.split("/");
  const [hh, mi] = timePart.split(":");

  return new Date(yyyy, mm - 1, dd, hh, mi);
}

document.getElementById("searchInput").addEventListener("input", function () {
  searchTable(this.value);
});
document.getElementById("searchBtn").addEventListener("click", function () {
  const keyword = document.getElementById("searchInput").value;
  searchTable(keyword);
});
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchTable(this.value);
    }
  });

/**
 * Load dữ liệu lần đầu
 */
loadData();
