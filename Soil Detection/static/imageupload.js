document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");
  const imageUpload = document.getElementById("imageUpload");
  const imageDisplay = document.getElementById("imageDisplay");
  const contentDisplay = document.getElementById("contentDisplay");

  uploadForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const file = imageUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Display the uploaded image
        imageDisplay.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%;">`;

        // Display content related to the image (modify this as needed)
        contentDisplay.innerHTML = `<p><b>Powdery Mildew:</b><br>
        Description: A fungal disease characterized by white or gray powdery spots on the leaves and stems. It can affect a wide variety of plants, including vegetables, fruits, and ornamental plants.<br>
        Control: Use fungicides, ensure proper air circulation, and avoid overhead watering.</p>`;
      };
      reader.readAsDataURL(file);
    }
  });
});
