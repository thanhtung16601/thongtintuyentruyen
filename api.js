/**
 * =========================================================
 * CẤU HÌNH API & DỮ LIỆU BÀI ĐĂNG
 * =========================================================
 */

/**
 * API Google Apps Script
 * - Dùng để:
 *   + Gửi dữ liệu đăng ký thăm thân (POST)
 *   + Lấy danh sách đăng ký / duyệt / xóa (GET)
 *
 * @constant {string}
 * @author NgocKhanh
 */
const API_URL =
  "https://script.google.com/macros/s/AKfycbyQoEIdjbx_xPIjeYPcY9uRhperE171d-YpGsnBg3ReblIjDQIpgSepeJJvKrsw_7SBtA/exec";

/**
 * Danh sách bài đăng / thông báo nội bộ
 * - Dùng để hiển thị bảng quản lý bài viết
 * - Có thể thay thế bằng dữ liệu từ API sau này
 *
 * @typedef {Object} Post
 * @property {number} id       - ID bài đăng
 * @property {string} image    - URL hình ảnh minh họa
 * @property {string} content  - Nội dung bài đăng
 * @property {string} date     - Ngày đăng (dd/mm/yyyy hh:mm)
 *
 * @type {Post[]}
 * @author NgocKhanh
 */
const DATA_POST = [
  {
    id: 1,
    image:
      "https://drive.google.com/uc?export=view&id=13lWiJb4XyvH3awbPkpSJq6UwF0vMZO75",
    content: "Thông báo huấn luyện cấp đơn vị.",
    date: "11/02/2025 10:15",
  },
  {
    id: 2,
    image: "https://i.imgur.com/3JjVg9d.jpeg",
    content: "Cảnh quan doanh trại - cập nhật mới.",
    date: "12/02/2025 09:00",
  },
];
