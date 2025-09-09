const scriptURL = "https://script.google.com/macros/s/AKfycby1miIB9zSIz0uYsc_bOGdV9_aQLXbM_qRh0LlzbC9yyHdI-p4KOk-e5zlAoHV7TJmm/exec"

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("registerForm");

  // Elements
  const cabReq = document.getElementById("cabReq");
  const addressGroup = document.getElementById("addressGroup");
  const addressInput = document.getElementById("address");
  const submitBtn = form.querySelector("button[type='submit']");
  const kids = document.getElementById("kids");
  const kidsGroup = document.getElementById("kidsGroup");
  const numKids = document.getElementById("numKids");
  const kidAgesGroup = document.getElementById("kidAgesGroup");
  const kidAgeInputs = document.getElementById("kidAgeInputs");

  // Toggle kids section
  kids.addEventListener("change", function () {
    console.log("Kids value changed to:", this.value);
    if (this.value === "Yes") {
      kidsGroup.classList.add("show");
      numKids.required = true;
    } else {
      kidsGroup.classList.remove("show");
      kidAgesGroup.classList.remove("show");
      kidAgeInputs.innerHTML = "";
      numKids.value = "";
      numKids.required = false;
      // Clear required status from kid age inputs
      document.querySelectorAll("[id^='kidAge']").forEach(input => {
        input.required = false;
      });
    }
  });

  // Toggle Address field based on Cab requirement
  cabReq.addEventListener("change", function () {
    console.log("Cab requirement changed to:", this.value);
    if (this.value === "Yes") {
      addressGroup.classList.add("show");
      addressInput.required = true;
    } else {
      addressGroup.classList.remove("show");
      addressInput.required = false;
      addressInput.value = "";
    }
  });

  // Generate kid age fields dynamically
  numKids.addEventListener("change", function () {
    console.log("Number of kids changed to:", this.value);
    kidAgeInputs.innerHTML = "";
    const count = parseInt(this.value);
    if (count > 0) {
      kidAgesGroup.classList.add("show");
      for (let i = 1; i <= count; i++) {
        const div = document.createElement("div");
        div.classList.add("form-group");
        div.innerHTML = `
          <label for="kidAge${i}">Age of Kid ${i} *</label>
          <input type="number" id="kidAge${i}" min="0" required />
        `;
        kidAgeInputs.appendChild(div);
      }
    } else {
      kidAgesGroup.classList.remove("show");
    }
  });

  // Submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Disable button on form submit
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    // Collect individual kid ages for specific columns
    const kidAge1 = document.getElementById("kidAge1") ? document.getElementById("kidAge1").value : "";
    const kidAge2 = document.getElementById("kidAge2") ? document.getElementById("kidAge2").value : "";

    const data = {
      name: document.getElementById("name").value,
      designation: document.getElementById("designation").value,
      companyName: document.getElementById("companyName").value,
      mobileNumber: document.getElementById("mobileNumber").value,
      email: document.getElementById("email").value,
      kids: document.getElementById("kids").value,
      numKids: document.getElementById("numKids").value,
      kidAge1: kidAge1,
      kidAge2: kidAge2,
      cabReq: document.getElementById("cabReq").value,
      address: document.getElementById("address").value,
    };

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.result === "success") {
          alert("Registration submitted successfully!");
          form.reset();
          kidAgeInputs.innerHTML = "";
          kidsGroup.classList.remove("show");
          kidAgesGroup.classList.remove("show");
          addressGroup.classList.remove("show");
        } else {
          throw new Error("Submission failed");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("There was an error submitting the form. Please try again.");
      })
      .finally(() => {
        // Re-enable button
        submitBtn.textContent = "Register Now";
        submitBtn.disabled = false;
      });
  });

  // Success modal function (if needed elsewhere)
  window.showSuccessModal = function() {
    alert("Form submitted successfully!");
  };
});