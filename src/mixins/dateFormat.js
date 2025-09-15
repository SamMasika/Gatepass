export default {
    methods: {
        formatDate(date) {
            // Ensure date is a Date object
            const d = new Date(date);

            const day = d.getDate();
            const month = d.toLocaleString("default", { month: "long" });
            const year = d.getFullYear();
            const suffix = this.getOrdinalSuffix(day);

            return `${day}${suffix} ${month} ${year}`;
        },
        getOrdinalSuffix(day) {
            if (day > 3 && day < 21) return "th"; // Handles 11th to 20th
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        }

    }
}