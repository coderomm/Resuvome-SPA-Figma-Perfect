document.addEventListener("DOMContentLoaded", function () {
    try {
        function setupScrolling(wrapperSelector, prevSelector, nextSelector, scrollAmount = 300) {
            const wrapper = document.querySelector(wrapperSelector);
            const prevButton = document.querySelector(prevSelector);
            const nextButton = document.querySelector(nextSelector);

            if (!wrapper || !prevButton || !nextButton) {
                console.warn(`Missing elements for: ${wrapperSelector}`);
                return;
            }

            prevButton.onclick = () => wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            nextButton.onclick = () => wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }

        setupScrolling(".ogs-items-wrapper", ".ogs-items-wrapper .btn-next-prev.prev", ".ogs-items-wrapper .btn-next-prev.next");
        setupScrolling(".blogs-items-wrapper", ".blogs-items-wrapper .btn-next-prev.prev", ".blogs-items-wrapper .btn-next-prev.next");

    } catch (error) {
        console.error("Error initializing scrolling:", error);
    }

    // Initialize email service
    try {
        emailjs.init(""); // Public Key

        document.getElementById("contact-form").onsubmit = function (event) {
            event.preventDefault();

            const serviceID = ""; // Service ID
            const templateID = ""; // Template ID

            const templateParams = {
                user_name: document.getElementById("user_name").value,
                user_email: document.getElementById("user_email").value,
                contact_number: document.getElementById("contact_number").value,
                message: document.getElementById("message").value,
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(response => {
                    console.log("Email Sent Successfully!", response);
                    const responseMessage = document.getElementById("response-message");
                    responseMessage.style.display = "flex";
                    responseMessage.innerHTML = `Email sent successfully! <span id="message-close">X</span>`;
                    document.getElementById("contact-form").reset();

                    setTimeout(() => {
                        responseMessage.innerText = "";
                        responseMessage.style.display = "none";
                    }, 5000);
                })
                .catch(error => {
                    console.error("Error sending email:", error);
                    document.getElementById("response-message").innerText = "Failed to send email. Try again.";
                });
        };
    } catch (error) {
        console.error("Error initializing email service:", error);
    }

    // Popups
    try {

        let activePopup = null;

        const items = document.querySelectorAll(".ogs-item");

        if (!items.length) {
            console.warn("No .ogs-item elements found!");
            return;
        }

        items.forEach((item) => {
            try {
                const popup = item.querySelector(".ogs-popup");
                const openBtn = item.querySelector(".ogs-item-btn-wrapper");
                const closeBtn = item.querySelector(".ogs-popup-close");

                if (!popup || !openBtn || !closeBtn) {
                    console.warn("Missing popup, open button, or close button inside an .ogs-item:", item);
                    return;
                }

                // Open popup only when clicking on 'Read More' button
                openBtn.addEventListener("click", function (event) {
                    event.stopPropagation(); // Prevent event bubbling

                    // Close any previously opened popup
                    if (activePopup && activePopup !== popup) {
                        activePopup.style.display = "none";
                        document.body.classList.remove("ogs-popup-open");
                    }

                    popup.style.display = "block";
                    document.body.classList.add("ogs-popup-open");
                    activePopup = popup;
                });

                // Close popup when clicking the close button
                closeBtn.addEventListener("click", function (event) {
                    event.stopPropagation();
                    popup.style.display = "none";
                    document.body.classList.remove("ogs-popup-open");
                    activePopup = null;
                });

                // Close popup when clicking anywhere outside the popup
                document.addEventListener("click", function (event) {
                    if (activePopup && !activePopup.contains(event.target) && !event.target.closest(".ogs-item-btn-wrapper")) {
                        activePopup.style.display = "none";
                        document.body.classList.remove("ogs-popup-open");
                        activePopup = null;
                    }
                });

            } catch (error) {
                console.error("Error processing .ogs-item:", error);
            }
        });
    } catch (error) {
        console.error("Unexpected error in popup script:", error);
    }
});
