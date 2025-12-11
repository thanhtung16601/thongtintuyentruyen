document.getElementById("visitForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    hoten: document.getElementById("hoten").value,
    cccd: document.getElementById("cccd").value,
    quanhe: document.getElementById("quanhe").value,
    quannhan: document.getElementById("quannhan").value,
    sdt: document.getElementById("sdt").value,
    tinhthanhpho: document.getElementById("tinhthanh").value,
    xaphuong: document.getElementById("xaphuong").value,
    donvi: document.getElementById("donvi").value,
    thoigian: new Date().toLocaleString(),
  };

  addDatatoExcel(formData);
  console.log(formData);
  document.getElementById("mess-thamthan").innerHTML =
    "Đăng ký thành công! Chờ phê duyệt.";

  setTimeout(() => {
    document.getElementById("visitForm").reset();
    document.getElementById("mess-thamthan").innerHTML = "";
  }, 5500);
});

// Gửi POST
function addDatatoExcel(data) {
  fetch(
    "https://script.google.com/macros/s/AKfycbxHbbs0-qi0VwpZfApOmA6HwpFdSWqVHCuxs-4O2ospRvblXAHGX2cghqvs-jmr_Z7-uw/exec",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((res) => console.log("Đã gửi thành công:", res))
    .catch((err) => console.error("Gửi thất bại:", err));
}
