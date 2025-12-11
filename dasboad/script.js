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
      <td>${row.trangthai || "Chờ duyệt"}</td>
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
        trangthai: "Đã duyệt",
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

// function drawCharts() {
//   const container = document.getElementById("chart-container");

//   // --- Xóa canvas cũ ---
//   ["statusChart", "provinceChart", "unitChart"].forEach((id) => {
//     const old = document.getElementById(id);
//     if (old) old.remove();
//   });

//   // --- Tạo canvas mới ---
//   const newStatus = document.createElement("canvas");
//   newStatus.id = "statusChart";
//   const newProvince = document.createElement("canvas");
//   newProvince.id = "provinceChart";
//   const newUnit = document.createElement("canvas");
//   newUnit.id = "unitChart";
//   container.appendChild(newStatus);
//   container.appendChild(newProvince);
//   container.appendChild(newUnit);

//   // --- Tính dữ liệu ---
//   const cho = data.filter(
//     (r) => (r.trangthai || "Chờ duyệt") === "Chờ duyệt"
//   ).length;
//   const duyet = data.filter((r) => r.trangthai === "Đã duyệt").length;
//   const tu = data.filter((r) => r.trangthai === "Từ chối").length;

//   const provinceCount = data.reduce((acc, r) => {
//     const tinh = r.tinhthanhpho || "Không xác định";
//     acc[tinh] = (acc[tinh] || 0) + 1;
//     return acc;
//   }, {});

//   const unitCount = data.reduce((acc, r) => {
//     const dv = r.donvi || "Không xác định";
//     acc[dv] = (acc[dv] || 0) + 1;
//     return acc;
//   }, {});

//   // --- Pie chart trạng thái ---
//   new Chart(newStatus.getContext("2d"), {
//     type: "pie",
//     data: {
//       labels: ["Chờ duyệt", "Đã duyệt", "Từ chối"],
//       datasets: [
//         {
//           data: [cho, duyet, tu],
//           backgroundColor: ["#FFD700", "#00FF00", "#FF0000"],
//         },
//       ],
//     },
//     options: { responsive: true, plugins: { legend: { position: "top" } } },
//   });

//   // --- Bar chart tỉnh ---
//   new Chart(newProvince.getContext("2d"), {
//     type: "bar",
//     data: {
//       labels: Object.keys(provinceCount),
//       datasets: [
//         {
//           label: "Số đơn theo tỉnh",
//           data: Object.values(provinceCount),
//           backgroundColor: "#87CEEB",
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: { legend: { position: "top" } },
//       scales: { y: { beginAtZero: true } },
//     },
//   });

//   // --- Bar chart đơn vị ---
//   new Chart(newUnit.getContext("2d"), {
//     type: "bar",
//     data: {
//       labels: Object.keys(unitCount),
//       datasets: [
//         {
//           label: "Số đơn theo Đơn vị",
//           data: Object.values(unitCount),
//           backgroundColor: "#FFA500",
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: { legend: { position: "top" } },
//       scales: { y: { beginAtZero: true } },
//     },
//   });
// }

loadData();
setInterval(loadData, 2000); // Realtime 2s
