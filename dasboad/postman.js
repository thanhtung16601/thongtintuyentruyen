/**
 * =========================================================
 * XỬ LÝ BÀI VIẾT (POST)
 * =========================================================
 */

/**
 * Mở popup sửa bài viết
 * @param {number} id - ID bài viết
 */
function editPost(id) {
  alert("Sửa bài: " + id);
}

/**
 * Mở popup xoá bài viết
 * @param {number} id - ID bài viết
 */
function deletePost(id) {
  alert("Xóa bài: " + id);
}

/**
 * Hiển thị popup xác nhận upload bài viết
 * @param {number} index - ID bài viết
 */
function uploadPopupPost(index) {
  i = index;
  iPopup("flex");
  iPopupMess("Upload?");
}

/**
 * Hiển thị popup xác nhận cập nhật bài viết
 * @param {number} index - ID bài viết
 */
function updatePopupPost(index) {
  i = index;
  iPopup("flex");
  iPopupMess("Update?");
}

/**
 * Hiển thị popup xác nhận xoá bài viết
 * @param {number} index - ID bài viết
 */
function deletePopupPost(index) {
  i = index;
  iPopup("flex");
  iPopupMess("Bạn có muốn xoá không?");
}

/**
 * Đóng popup
 */
function closePopup() {
  iPopup("none");
}

/**
 * Xác nhận popup (ví dụ: xoá bài)
 * Gọi hàm xử lý delete
 */
function confirmPopup() {
  iDelete(i);
  iPopup("none");
}

/**
 * =========================================================
 * POPUP CONTROL
 * =========================================================
 */

/**
 * Hiển thị / ẩn popup
 * @param {string} display - css display (flex | none)
 */
function iPopup(display) {
  document.getElementById("popup").style.display = display;
}

/**
 * Cập nhật nội dung thông báo popup
 * @param {string} mess - Nội dung thông báo
 */
function iPopupMess(mess) {
  document.getElementById("popupMessage").textContent = mess;
}

/**
 * =========================================================
 * RENDER BẢNG QUẢN LÝ BÀI VIẾT
 * =========================================================
 */

/**
 * Render danh sách bài viết ra table
 * @param {Array} posts - Danh sách bài viết
 */
function renderPostman(posts) {
  const box = document.getElementById("postmans");

  if (!posts || posts.length === 0) {
    box.innerHTML = "<p>Không có bài viết nào.</p>";
    return;
  }

  let html = `
    <table border="1" cellpadding="10"
      style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr>
          <th>#</th>
          <th>Hình ảnh</th>
          <th>Nội dung</th>
          <th>Ngày đăng</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
  `;

  posts.forEach((p, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>

        <td>
          <img src="${p.image}"
            style="width: 80px; height: 80px;
            object-fit: cover; border-radius: 6px;">
        </td>

        <td style="max-width: 350px;">
          ${p.content}
        </td>

        <td>${p.date}</td>

        <td>
          <button onclick="updatePopupPost(${p.id})">Sửa</button>
          <button onclick="deletePopupPost(${p.id})">Xóa</button>
          <button onclick="uploadPopupPost(${p.id})">Đẩy lên</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  box.innerHTML = html;
}
