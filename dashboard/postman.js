/**
 * =========================================================
 * XỬ LÝ BÀI VIẾT (POST)
 * Tác giả: Hồ Ngọc Khánh
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
  const post = CONTAINER_POST.find((p) => p.idPost === index);
  console.log(post);

  iPopup("flex");
  iPopupMess("Update?");
}

/**
 * Hiển thị popup xác nhận xoá bài viết
 * @param {number} index - ID bài viết
 */
function deletePopupPost(index) {
  i = index;
  const post = CONTAINER_POST.find((p) => p.idPost === index);
  console.log(post);
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

function btnPostShow() {
  // code html cho popup comment có thể được thêm vào đây
  document.getElementById("popup-comment").style.display = "flex";
}

function clearPoster() {
  document.getElementById("previewImages").innerHTML = "";
  document.getElementById("content_txtPost").value = "";
  document.getElementById("content_imgPost").value = "";
  document.getElementById("popup-comment").style.display = "none";
}

function btnPushImage() {
  document.getElementById("content_imgPost").click();
}

function btnDeleteImage() {
  document.getElementById("content_imgPost").value = "";
  document.getElementById("preview").innerHTML = "";
}

/**
 * =========================================================
 * POPUP CONTROL
 * =========================================================
 */

/**
 * Hiển thị / ẩn popup
 * @param {string} display - CSS display (flex | none)
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

var CONTAINER_POST = [];

/**
 * Load dữ liệu bài viết từ API
 * Gán dữ liệu vào biến toàn cục CONTAINER_POST
 * Và gọi các hàm hiển thị dữ liệu
 */
loadDataPost();
function loadDataPost() {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      token: localStorage.getItem("token"),
      action: "routerPost",
      status: "get",
    }),
  })
    .then((response) => response.json())
    .then((res) => {
      // Lưu dữ liệu vào biến toàn cục
      CONTAINER_POST = res;

      // Hiển thị dữ liệu dưới dạng block
      showPostmans();

      // Hiển thị dữ liệu dạng bảng quản lý
      renderPostman();

      return res;
    })
    .catch((err) => {
      console.log(err);
      console.log("⚠️ Lỗi hệ thống, vui lòng thử lại!");
    });
}
function uploadPoster() {
  const txtHeaderEl = document.getElementById("content_txtHeader");
  const txtContentEl = document.getElementById("content_txtPost");
  const txtPositionEl = document.getElementById("content_position");
  const imgEl = document.getElementById("content_imgPost");

  const data = {
    token: localStorage.getItem("token"),
    action: "routerPost",
    status: "save",
    txtPosition: txtPositionEl.value,
    txtHeader: txtHeaderEl.value,
    img: imgEl.value,
    txtContent: txtContentEl.value,
  };

  console.log(data);

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Upload thất bại");
      return res.json(); // nếu API có trả JSON
    })
    .then(() => {
      // reset form
      txtHeaderEl.value = "";
      txtContentEl.value = "";
      txtPositionEl.value = "";
      imgEl.value = "";

      loadData();
    })
    .catch((err) => console.error("Lỗi upload:", err));
}

/**
 * Hiển thị bài viết dưới dạng các block nhỏ (GUI index)
 * Lấy dữ liệu từ CONTAINER_POST
 */
function showPostmans() {
  const container = document.getElementById("container-posmans");
  var posts = CONTAINER_POST;

  if (container == null) return;
  container.innerHTML = "";

  // Lấy các bài viết mới nhất, bỏ bài đầu tiên
  posts
    .slice(1, 5)
    .reverse()
    .forEach((post) => {
      const item = document.createElement("div");
      item.id = `posterHasId-${post.idPost}`;
      item.className = `poster ${post.states}`;

      item.innerHTML = `
        <div class="poster-date">${post.date}</div>
        <div class="poster-content">
          <div class="poster-img">
            <img src="${post.img}" alt="Ảnh bài viết"/>
          </div>
          <div class="poster-para">${post.content}</div>
        </div>
      `;

      container.appendChild(item);
    });
}

/**
 * Render bảng quản lý bài viết ở trang manager
 * Hiển thị các bài viết trong bảng với nút thao tác
 */
function renderPostman() {
  var posts = CONTAINER_POST;
  const box = document.getElementById("postmans");

  if (box == null) return;

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
          <th>Ảnh hưởng</th>
          <th>Nội dung</th>
          <th>Ngày đăng</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Hiển thị các bài viết (mới nhất đầu tiên)
  posts.reverse().forEach((p, i) => {
    html += `
      <tr key="${p.idPost}">
        <td>${i + 1}</td>
        <td>
          <img src="${p.img}"
            style="width: 80px; height: 80px;
            object-fit: cover; border-radius: 6px;"
            alt="Ảnh bài viết"/>
        </td>
        <td>${p.states}</td>
        <td style="max-width: 350px;">
          ${p.content}
        </td>
        <td>${p.date}</td>
        <td>
          <button onclick="updatePopupPost(${p.idPost})">Sửa</button>
          <button onclick="deletePopupPost(${p.idPost})">Xóa</button>
          <button onclick="uploadPopupPost(${p.idPost})">Đẩy lên</button>
        </td>
      </tr>
      `;
  });

  html += `</tbody></table>`;
  box.innerHTML = html;
}
