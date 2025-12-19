async function checkAuth(allowRoles = []) {
  const token = document.cookie
    .split("; ")
    .find((r) => r.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    location.href = "/login.html";
    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "verify",
      token,
    }),
  });

  const data = await res.json();

  if (!data.ok || (allowRoles.length && !allowRoles.includes(data.role))) {
    location.href = "/login.html";
    return;
  }

  // ĐƯỢC PHÉP → HIỆN PAGE
  document.body.style.display = "block";
}
