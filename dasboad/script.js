/**
 * ==============================
 * BIẾN & DỮ LIỆU TOÀN CỤC
 * ==============================
 */

/**
 * Danh sách dữ liệu lấy từ API (Google Apps Script)
 * @type {Array}
 */
let data = [];

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
 * Lấy dữ liệu từ API
 * - Fetch danh sách người đăng ký
 * - Render bảng admin
 * - Render danh sách bài viết (postman)
 */
function loadData() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((d) => {
      data = d;
      renderTable();
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
function renderTable() {
  const body = document.getElementById("adminBody");
  body.innerHTML = "";

  data.forEach((row, index) => {
    body.innerHTML += `
      <tr id="${row.visitCode}">
        <td>${row.hoten || ""}</td>
        <td>${row.cccd || ""}</td>
        <td>${row.quanhe || ""}</td>
        <td>${row.quannhan || ""}</td>
        <td>${row.sdt || ""}</td>
        <td>${row.tinhthanhpho || ""}</td>
        <td>${row.xahuyen || ""}</td>
        <td>${row.donvi || ""}</td>
        <td>${formatDateTimeVN(row.ngaytham) || ""}</td>
        <td>${row.trangthai || "đăng ký"}</td>
        <td>
          ${
            row.trangthai == "đã xác nhận"
              ? `<button class="btn-xoa" style="width:100%" onclick="showPopup(${index})">Loại bỏ</button>`
              : `<button class="btn-duyet" style="width:100%" onclick="duyet(${index})">Xác nhận</button>`
          }
        </td>
      </tr>
    `;
  });

  totalVisiter(); // Cập nhật thống kê
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
function totalVisiter() {
  const daDuyet = data.filter((x) => x.trangthai === "đã xác nhận").length;
  const chuaDuyet = data.filter((x) => x.trangthai !== "đã xác nhận").length;
  const tong = data.length;

  document.getElementById("tk-confirm").textContent = daDuyet;
  document.getElementById("tk-wait").textContent = chuaDuyet;
  document.getElementById("tk-total").textContent = tong;
}
/**
 * ==============================
 * DUYỆT & XOÁ ĐĂNG KÝ
 * ==============================
 */

/**
 * Duyệt đăng ký (chuyển trạng thái sang "đã xác nhận")
 * @param {number} i - index của dòng dữ liệu
 */
function duyet(i) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "update",
      row: i,
      trangthai: "đã xác nhận",
    }),
  })
    .then(() => loadData())
    .catch((err) => console.error("Lỗi duyệt:", err));
}

/**
 * Xoá đăng ký khỏi hệ thống
 * @param {number} i - index của dòng dữ liệu
 */
function iDelete(i) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "delete",
      row: i,
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
    "Bạn có muốn xoá không?";
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
  iDelete(i);
  document.getElementById("popup").style.display = "none";
}
/**
 * ==============================
 * KHỞI CHẠY KHI LOAD TRANG
 * ==============================
 */

/**
 * Load dữ liệu lần đầu
 */
loadData();

/**
 * (Tuỳ chọn) Auto reload mỗi 2 giây
 */
// setInterval(() => {
//   loadData();
// }, 2000);
