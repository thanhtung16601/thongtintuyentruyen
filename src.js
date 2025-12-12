document.getElementById("visitForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    hoten: document.getElementById("hoten").value,
    cccd: document.getElementById("cccd").value,
    quanhe: document.getElementById("quanhe").value,
    quannhan: document.getElementById("quannhan").value,
    sdt: document.getElementById("sdt").value,
    tinhthanhpho: document.getElementById("tinhthanh").value,
    xahuyen: document.getElementById("xahuyen").value,
    donvi: document.getElementById("donvi").value,
    thoigian: new Date().toLocaleString(),
  };
  addPeople(formData);
});

function addPeople(formData) {
  // Gửi dữ liệu lên server
  fetch(
    "https://script.google.com/macros/s/AKfycbxHbbs0-qi0VwpZfApOmA6HwpFdSWqVHCuxs-4O2ospRvblXAHGX2cghqvs-jmr_Z7-uw/exec",
    {
      method: "POST",
      body: JSON.stringify(formData),
    }
  )
    .then((data) => {
      document.getElementById("mess-thamthan").innerHTML =
        "Đăng ký thành công! Chờ phê duyệt.";
      return data;
    })
    .catch((err) => {
      document.getElementById("mess-thamthan").innerHTML =
        "Đăng ký thất bại! vui lòng thử lại.";
      return err;
    })
    .finally(() => {
      setTimeout(() => {
        document.getElementById("visitForm").reset();
        document.getElementById("mess-thamthan").innerHTML = "";
      }, 5500);
    });
}
