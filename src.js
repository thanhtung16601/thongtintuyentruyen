const API_URL =
  "https://script.google.com/macros/s/AKfycbyOqQzjfJWyEoRwRXqL4vf3fsSlpkK92QPdlRwKmlB18YiWa1JfuM0Daw_ZDN3d4yCS/exec";

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
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(formData),
  })
    .then((data) => {
      showPopup("Đăng ký thành công! Chờ phê duyệt.");
      return data;
    })
    .catch((err) => {
      showPopup("Đăng ký thất bại! vui lòng thử lại.");
      return err;
    })
    .finally(() => {
      document.getElementById("visitForm").reset();
    });
}

function showPopup(message) {
  document.getElementById("popupMessage").textContent = message;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
