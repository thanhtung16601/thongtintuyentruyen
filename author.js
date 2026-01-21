/**
 * =========================================================
 * Kiểm tra xác thực người dùng (Auth)
 * - Kiểm tra token trong cookie
 * - Gửi API xác thực token
 * - Kiểm tra role người dùng (nếu cần)
 * - Chuyển hướng nếu không hợp lệ
 * =========================================================
 *
 * @param {Array<string>} allowRoles - Danh sách role được phép truy cập (mặc định không giới hạn)
 */
async function checkAuth(allowRoles = []) {
  try {
    // 1️⃣ Lấy token từ cookie
    const token = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      // Không có token → chuyển hướng về login
      return (location.href = "/login.html");
    }

    // 2️⃣ Gọi API xác thực token
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Cần thiết để server parse JSON
      },
      body: JSON.stringify({
        action: "verify",
        token,
      }),
    });

    if (!res.ok) {
      // Lỗi HTTP (500, 404...) → coi như không hợp lệ
      return (location.href = "/login.html");
    }

    const data = await res.json();

    // 3️⃣ Kiểm tra kết quả xác thực và role
    const hasAccess =
      data.ok && (!allowRoles.length || allowRoles.includes(data.role));
    if (!hasAccess) {
      return (location.href = "/login.html");
    }

    // 4️⃣ Nếu được phép → hiện page
    document.body.style.display = "block";
  } catch (err) {
    console.error("Lỗi kiểm tra xác thực:", err);
    location.href = "/login.html";
  }
}
