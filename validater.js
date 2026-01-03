function validateVisitForm(form) {
  const errors = {};

  // Họ tên
  if (!form.fullName.value.trim()) {
    errors.fullName = "Vui lòng nhập họ tên khách";
  }

  // CCCD: đúng 12 số
  if (!/^\d{12}$/.test(form.cccd.value.trim())) {
    errors.cccd = "CCCD phải gồm đúng 12 chữ số";
  }

  // Số điện thoại VN
  if (!/^(0|\+84)[0-9]{9}$/.test(form.phone.value.trim())) {
    errors.phone = "Số điện thoại không hợp lệ";
  }

  // Tỉnh / Thành
  if (!form.province.value) {
    errors.province = "Vui lòng chọn tỉnh/thành phố";
  }

  // Xã / Phường
  if (!form.ward.value) {
    errors.ward = "Vui lòng chọn xã/phường";
  }

  // Tên quân nhân
  if (!form.soldierName.value.trim()) {
    errors.soldierName = "Vui lòng nhập tên quân nhân";
  }

  // Mối quan hệ
  if (!form.relation.value.trim()) {
    errors.relation = "Vui lòng nhập mối quan hệ";
  }

  // Đơn vị
  if (!form.unit.value.trim()) {
    errors.unit = "Vui lòng nhập đơn vị";
  }

  // Ngày giờ thăm
  if (!form.visitTime.value) {
    errors.visitTime = "Vui lòng chọn ngày giờ thăm";
  } else {
    const visitDate = new Date(form.visitTime.value);
    if (visitDate < new Date()) {
      errors.visitTime = "Ngày giờ thăm phải lớn hơn hiện tại";
    }
  }

  return errors;
}

document.getElementById("visitForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const errors = validateVisitForm(this);

  if (Object.keys(errors).length > 0) {
    console.log("LỖI FORM:", errors);
    alert(Object.values(errors)[0]); // báo lỗi đầu tiên
    return;
  }

  alert("✅ Dữ liệu hợp lệ, sẵn sàng gửi!");
  // submit / fetch API tại đây
});
