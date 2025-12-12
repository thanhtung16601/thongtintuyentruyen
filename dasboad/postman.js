function editPost(id) {
  alert("Sửa bài: " + id);
}

function deletePost(id) {
  alert("Xóa bài: " + id);
}

function uploadPopupPost(index) {
  i = index;
  iPopup("flex");
  iPopupMess("Upload?");
}

function updatePopupPost(index) {
  i = index;
  iPopup("flex");
  iPopupMess("Update?");
}
function deletePopupPost(index) {
  i = index;
  iPopup("flex");
  iPopupMess("Bạn có muốn xoá không?");
}

function closePopup() {
  iPopup("none");
}
function confirmPopup() {
  iDelete(i);
  iPopup("none");
}

function iPopup(arr) {
  document.getElementById("popup").style.display = arr;
}
function iPopupMess(mess) {
  document.getElementById("popupMessage").textContent = mess;
}

function renderPostman(posts) {
  const box = document.getElementById("postmans");

  if (!posts || posts.length === 0) {
    box.innerHTML = "<p>Không có bài viết nào.</p>";
    return;
  }

  let html = `
    <table border="1" cellpadding="10" style="width: 100%; border-collapse: collapse; text-align: left;">
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
          <img src="${
            p.image
          }" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;">
        </td>

        <td style="max-width: 350px;">
          ${p.content}
        </td>

        <td>${p.date}</td>

        <td>
          <button onclick="updatePopupPost(${p.id})">Sửa</button>
          <button onclick="deletePopupPost(${p.id})">Xóa</button>
          <button onclick="uploadPopupPost(${p.id})">đẩy lên</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;

  box.innerHTML = html;
}

const tinhSelect = document.getElementById("tinhthanh");

TINH_34.forEach((name) => {
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  tinhSelect.appendChild(opt);
});
