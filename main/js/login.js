function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      user,
      pass,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        window.location.href = "/dashboard/";
      } else {
        showPopup("Tài khoản hoặc mật khẩu không đúng!");
      }
    })
    .catch((err) => {
      console.error("Lỗi duyệt:", err);
      showPopup("Lỗi kết nối server!");
    });
}

/**
 * Hiển thị popup xác nhận xoá
 * @param {number} index - index của dòng cần xoá
 */
function showPopup(mess) {
  document.getElementById("popupMessage").textContent = mess;
  document.getElementById("popup").style.display = "flex";
}

/**
 * Đóng popup
 */
function closePopup() {
  document.getElementById("popup").style.display = "none";
}
