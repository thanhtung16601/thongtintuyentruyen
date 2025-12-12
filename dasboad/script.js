const API_URL =
  "https://script.google.com/macros/s/AKfycbyOqQzjfJWyEoRwRXqL4vf3fsSlpkK92QPdlRwKmlB18YiWa1JfuM0Daw_ZDN3d4yCS/exec";
let data = [];

document.getElementById("reloadBtn").addEventListener("click", loadData);
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

function renderTable() {
  const body = document.getElementById("adminBody");
  body.innerHTML = "";

  data.forEach((row, index) => {
    body.innerHTML += `
      <tr>
        <td>${row.hoten || ""}</td>
        <td>${row.cccd || ""}</td>
        <td>${row.quanhe || ""}</td>
        <td>${row.quannhan || ""}</td>
        <td>${row.sdt || ""}</td>
        <td>${row.tinhthanhpho || ""}</td>
        <td>${row.xahuyen || ""}</td>
        <td>${row.donvi || ""}</td>
        <td>${row.trangthai || "đăng ký"}</td>
        <td>
          ${
            row.trangthai == "đã xác nhận"
              ? `<button class="btn-xoa" style="width: 100%;" onclick="showPopup(${index})">Loại bỏ</button>`
              : `<button class="btn-duyet" style="width: 100%;" onclick="duyet(${index})">Xác nhận</button>`
          }
        </td>
      </tr>
    `;
  });

  totalVisiter(); // <== THÊM DÒNG NÀY
}

function totalVisiter() {
  const daDuyet = data.filter((x) => x.trangthai === "đã xác nhận").length;
  const chuaDuyet = data.filter((x) => x.trangthai !== "đã xác nhận").length;
  const tong = data.length;

  document.getElementById("tk-confirm").textContent = daDuyet;
  document.getElementById("tk-wait").textContent = chuaDuyet;
  document.getElementById("tk-total").textContent = tong;
}

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

function iDelete(i) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "delete", row: i }),
  })
    .then(() => loadData())
    .catch((err) => console.error("Lỗi xóa:", err));
}

let i = 0;
function showPopup(index) {
  i = index;
  document.getElementById("popupMessage").textContent =
    "Bạn có muốn xoá không?";
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
function confirmPopup() {
  iDelete(i);
  document.getElementById("popup").style.display = "none";
}
//================================
loadData();
// setInterval(() => {
//   loadData();
// }, 2000);
