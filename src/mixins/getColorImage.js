export default {
    methods: {
        getStatusColor(status) {
            if (!status) return "grey";
            const lower = status.toLowerCase();
            switch (lower) {
                case "published":
                    return "green";
                case "pending":
                    return "orange";
                case "rejected":
                    return "red";
                default:
                    return "grey";
            }
        },
        formatStatus(status) {
            if (!status) return "";
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        },
        getImageUrl(imageName) {
            return this.$getImageUrl(imageName);
        },

    }
}