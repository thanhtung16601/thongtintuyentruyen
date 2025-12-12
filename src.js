const API_URL =
  "https://script.google.com/macros/s/AKfycbyOqQzjfJWyEoRwRXqL4vf3fsSlpkK92QPdlRwKmlB18YiWa1JfuM0Daw_ZDN3d4yCS/exec";

document.getElementById("visitForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const hoten = document.getElementById("hoten").value.trim();
  const cccd = document.getElementById("cccd").value.trim();
  const quanhe = document.getElementById("quanhe").value.trim();
  const quannhan = document.getElementById("quannhan").value.trim();
  const sdt = document.getElementById("sdt").value.trim();
  const tinh = document.getElementById("tinhthanh").value;
  const xa = document.getElementById("xahuyen").value;
  const donvi = document.getElementById("donvi").value.trim();

  // ===== VALIDATE =====
  if (!hoten) return showPopup("Vui lòng nhập họ tên!");
  if (!cccd) return showPopup("Vui lòng nhập số CCCD!");
  if (cccd.length !== 12 || !/^\d+$/.test(cccd))
    return showPopup("CCCD phải gồm 12 số!");

  if (!quanhe) return showPopup("Vui lòng nhập mối quan hệ!");
  if (!quannhan) return showPopup("Vui lòng nhập tên quân nhân!");
  if (!sdt) return showPopup("Vui lòng nhập số điện thoại!");
  if (!/^0\d{9}$/.test(sdt))
    return showPopup("Số điện thoại không hợp lệ (phải 10 số)!");

  if (!tinh) return showPopup("Vui lòng chọn tỉnh/thành phố!");
  if (!xa) return showPopup("Vui lòng chọn xã/phường!");

  if (!donvi) return showPopup("Vui lòng nhập đơn vị!");

  // ===== DỮ LIỆU GỬI LÊN =====
  const formData = {
    hoten,
    cccd,
    quanhe,
    quannhan,
    sdt,
    tinhthanhpho: tinh,
    xahuyen: xa,
    donvi,
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
