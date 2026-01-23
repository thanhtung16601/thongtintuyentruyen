const UIUX_CreatePost = ` <div class="groupHeaderContent">
          <input
            placeholder="Tiêu đề bài viết"
            id="content_txtHeader"
            class="content_txtHeader"
            type="text"
          />
          <select
            name="content_position"
            id="content_position"
            class="content_position"
          >
            <option value="Bình thường">Bình thường</option>
            <option value="Khá quan trọng">Khá quan trọng</option>
            <option value="Quan trọng">Quan trọng</option>
          </select>
        </div>
        <textarea
          placeholder="Nội dung bài viết.."
          name="txtPost"
          id="content_txtPost"
          class="txtPost"
          rows="5"
        ></textarea>
        <div class="btn-group">
          <button
            id="btnSelectImage"
            class="btnSelectImage"
            onclick="btnPushImage()"
          >
            📷 Thêm ảnh
          </button>
          <button
            id="btnDeleteImage"
            class="btnDeleteImage"
            onclick="btnDeleteImage()"
          >
            xoá ảnh
          </button>
        </div>
        <input
          type="file"
          id="content_imgPost"
          accept="image/*"
          multiple
          hidden
        />
`;
