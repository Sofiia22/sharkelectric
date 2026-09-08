const dialogs = document.querySelectorAll("dialog");

document.querySelectorAll("[data-open-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.openDialog)?.showModal();
  });
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog")?.close());
});

dialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const estimateForm = document.getElementById("estimate-form");

estimateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = estimateForm.querySelector("[type='submit']");
  const status = estimateForm.querySelector(".form-status");
  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  status.className = "form-status";
  status.textContent = "";

  try {
    const formData = new FormData(estimateForm);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(estimateForm.action, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error(result.message || "Request could not be sent");
    }

    estimateForm.reset();
    status.classList.add("form-status--success");
    status.textContent = "Done — your request has been sent.";
  } catch (error) {
    status.classList.add("form-status--error");
    status.textContent = "Unable to send right now. ";
    const emailLink = document.createElement("a");
    emailLink.href = "mailto:sharkelectricoffice@gmail.com";
    emailLink.textContent = "Email us directly.";
    status.append(emailLink);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Request";
  }
});
