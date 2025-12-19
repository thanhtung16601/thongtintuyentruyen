async function login() {
  const user = document.getElementById("username");
  const pass = document.getElementById("password");

  const res = await fetch(API_URL_CRUD, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      user: user.value,
      pass: pass.value,
    }),
  });

  const data = await res.json();
  if (data.ok) {
    document.cookie = `token=${data.token}; max-age=1800; path=/`;
    window.location.href = "dasboad/";
  } else {
    showPopup("Sai tên đăng nhập hoặc mật khẩu!");
  }
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
