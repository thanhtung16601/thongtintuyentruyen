let data = [];

function loadData() {
  fetch(
    "https://script.google.com/macros/s/AKfycbxHbbs0-qi0VwpZfApOmA6HwpFdSWqVHCuxs-4O2ospRvblXAHGX2cghqvs-jmr_Z7-uw/exec"
  )
    .then((res) => res.json())
    .then((d) => {
      data = d;
      renderTable();
      //drawCharts();
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
  console.log(data);
  data.forEach((row, index) => {
    body.innerHTML += `<tr>
      <td>${row.hoten || ""}</td>
      <td>${row.cccd || ""}</td>
      <td>${row.quanhe || ""}</td>
      <td>${row.quannhan || ""}</td>
      <td>${row.sdt || ""}</td>
      <td>${row.tinhthanhpho || ""}</td>
      <td>${row.xahuyen || ""}</td>
      <td>${row.donvi || ""}</td>
      <td>${row.trangthai || "waiting"}</td>
      <td>
        <button class="btn-duyet" onclick="duyet(${index})">Duyệt</button>
        <button class="btn-xoa" onclick="xoa(${index})">Xóa</button>
      </td>
    </tr>`;
  });
}

function duyet(index) {
  fetch(
    "https://script.google.com/macros/s/AKfycbxHbbs0-qi0VwpZfApOmA6HwpFdSWqVHCuxs-4O2ospRvblXAHGX2cghqvs-jmr_Z7-uw/exec",
    {
      method: "POST",
      body: JSON.stringify({
        action: "update",
        row: index,
        trangthai: "done",
      }),
    }
  )
    .then(() => loadData())
    .catch((err) => console.error("Lỗi duyệt:", err));
}

function xoa(index) {
  if (confirm("Xóa đơn?")) {
    fetch(
      "https://script.google.com/macros/s/AKfycbxHbbs0-qi0VwpZfApOmA6HwpFdSWqVHCuxs-4O2ospRvblXAHGX2cghqvs-jmr_Z7-uw/exec",
      {
        method: "POST",
        body: JSON.stringify({ action: "delete", row: index }),
      }
    )
      .then(() => loadData())
      .catch((err) => console.error("Lỗi xóa:", err));
  }
}

loadData();
//setInterval(loadData, 2000); // Realtime 2s
