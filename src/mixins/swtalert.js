import confetti from "canvas-confetti";

const ALERT_STYLES = {
    success: {
        title: "Success",
        icon: "success",
        iconColor: "#2ecc71",
        showConfirmButton: false,
        timer: 2500,
        confirmButtonText: "",
    },
    error: {
        title: "Oops!",
        icon: "error",
        iconColor: "#e74c3c",
        showConfirmButton: true,
        timer: null,
        confirmButtonText: "Got it!",
    },
};

export default {
    data() {
        return {
            confirmDialogVisible: false,
            itemToDelete: {},
        };
    },


    methods: {
        showAlert(message, type = "success") {
            const config = ALERT_STYLES[type] || ALERT_STYLES.success;
            this.$swal.fire({
                title: config.title,

                html: `
                    <div class="swal-message">
                        ${message}
                    </div>
                `,

                icon: config.icon,
                iconColor: config.iconColor,

                background: "#ffffff",
                color: "#1f2937",

                showConfirmButton: config.showConfirmButton,
                confirmButtonText: config.confirmButtonText,
                confirmButtonColor: "#3498db",

                timer: config.timer,
                timerProgressBar: !!config.timer,

                backdrop: "rgba(15, 23, 42, 0.45)",

                showClass: {
                    popup: "animate__animated animate__zoomIn animate__faster",
                },
                hideClass: {
                    popup: "animate__animated animate__zoomOut animate__faster",
                },

                customClass: {
                    popup: "premium-swal-popup",
                    title: "premium-swal-title",
                    htmlContainer: "premium-swal-content",
                },

                didOpen: () => {
                    if (type === "success") {
                        this.triggerConfetti();
                    }
                },
            });
        },

        triggerConfetti() {
            confetti({
                particleCount: 70,
                spread: 90,
                origin: { y: 0.65 },
                gravity: 1,
                scalar: 1,
            });
        },

        handleError(err) {
            const data = err?.response?.data;

            if (data?.errors) {
                const firstKey = Object.keys(data.errors)[0];
                const firstError = data.errors[firstKey];

                return Array.isArray(firstError) ? firstError[0] : firstError;
            }

            return data?.message || "Something went wrong. Please try again.";
        },

        deleteDialog(item) {
            this.itemToDelete = item;
            this.confirmDialogVisible = true;
        },
    },
};


