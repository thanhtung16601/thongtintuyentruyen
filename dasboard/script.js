/**
 * ==============================
 * BIẾN & DỮ LIỆU TOÀN CỤC
 * ==============================
 */
let i = 0; // Biến tạm cho popup
let DATA_STORE = [];

/**
 * ==============================
 * KHỞI TẠO SỰ KIỆN
 * ==============================
 */
document.getElementById("reloadBtn").addEventListener("click", loadData);
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

const imgInput = document.getElementById("imgPost");
const previewBox = document.getElementById("previewImages");
imgInput.addEventListener("change", () => {
  previewBox.innerHTML = "";
  const files = imgInput.files;
  Array.from(files).forEach((file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      previewBox.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

/**
 * ==============================
 * FETCH & LOAD DỮ LIỆU
 * ==============================
 */
function loadData() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((d) => {
      DATA_STORE = d;
      renderTable([]);
      renderPostman();
    })
    .catch((err) => {
      console.error("Lỗi fetch data:", err);
      document.getElementById("adminBody").innerHTML =
        '<tr><td colspan="9">Lỗi tải dữ liệu</td></tr>';
    });
}

/**
 * ==============================
 * RENDER GIAO DIỆN
 * ==============================
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
 * XỬ LÝ DUYỆT, TỪ CHỐI, XOÁ
 * ==============================
 */
function iConfirm(visitCode) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      token: localStorage.getItem("token"),
      action: "update",
      visitCode,
      trangthai: "đã xác nhận",
    }),
  })
    .then(() => loadData())
    .catch((err) => console.error("Lỗi duyệt:", err));
}

function iRefuse(visitCode) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      token: localStorage.getItem("token"),
      action: "update",
      visitCode,
      trangthai: "đã từ chối",
    }),
  })
    .then(() => loadData())
    .catch((err) => console.error("Lỗi duyệt:", err));
}

function iDelete(visitCode) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      token: localStorage.getItem("token"),
      action: "delete",
      visitCode,
    }),
  })
    .then(() => loadData())
    .catch((err) => console.error("Lỗi xóa:", err));
}

/**
 * ==============================
 * XỬ LÝ POPUP
 * ==============================
 */
function showPopup(index) {
  i = index;
  document.getElementById("showMesage").textContent =
    "Bạn có muốn từ chối không?";
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function confirmPopup() {
  iRefuse(i);
  closePopup();
}

function showPostPopup() {
  const mess = `Viết thành công!`;
  document.getElementById("popupMessage").textContent = mess;
  document.getElementById("popup").style.display = "flex";
}

function btnPostShow() {
  // code html cho popup comment có thể được thêm vào đây
  document.getElementById("popup-comment").style.display = "flex";
}

function btnDeleteImage() {
  document.getElementById("imgPost").value = "";
  document.getElementById("preview").innerHTML = "";
}

function clearPoster() {
  document.getElementById("previewImages").innerHTML = "";
  document.getElementById("txtPost").value = "";
  document.getElementById("imgPost").value = "";
  document.getElementById("popup-comment").style.display = "none";
}

function btnPushImage() {
  document.getElementById("imgPost").click();
}

/**
 * ==============================
 * HÀM HỖ TRỢ, PHỤ TRỢ
 * ==============================
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

  if (startDate) startDate.setHours(0, 0, 0, 0);
  if (endDate) endDate.setHours(23, 59, 59, 999);

  if (startDate && endDate && startDate > endDate) {
    showPopup("❌ Ngày bắt đầu không được lớn hơn ngày kết thúc!");
    return;
  }

  const filteredData = DATA_STORE.filter((row) => {
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

function parseVNDateTime(str) {
  if (!str) return null;
  const [datePart, timePart = "00:00"] = str.split(" ");
  const [dd, mm, yyyy] = datePart.split("/");
  const [hh, mi] = timePart.split(":");
  return new Date(yyyy, mm - 1, dd, hh, mi);
}

/**
 * ==============================
 * KHỞI ĐẦU
 * ==============================
 */
loadData();
