function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  // fetch(API_URL, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     action: "login",
  //     user,
  //     pass,
  //   }),
  // })
  //   .then((result) => {
  window.location.href = "/dasboad/";
  //   })
  //   .catch((err) => console.error("Lỗi duyệt:", err));
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
