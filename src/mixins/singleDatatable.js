
import _ from 'lodash'; // Import lodash
export default {
    data() {
        return {
            loading: true,
            itemsPerPage: 10, // Default items per page
            itemsPerPageOptions: [10, 25, 50, 100, -1], // Options for dropdown (-1 for "All")
            currentPage: 1,
            totalItems: 0,
            totalPages: 1,
        };
    },
    mounted() {
        setTimeout(() => {
            this.loading = false; // Set loading to false once the page is ready
        }, 2000); // Adjust this delay as necessary
    },
    methods: {
        handlePageChange(newOptions) {
            // Capture the new page and itemsPerPage from the updated options
            this.currentPage = newOptions.page;
            this.itemsPerPage = newOptions.itemsPerPage;
            this.fetchData(); // Fetch the data again when page or items per page change
        },
        onSearchChange: _.debounce(function () {
            this.currentPage = 1; // Reset to page 1 on search
            this.fetchData();
        }, 300), // Debounce to delay search
    },
    watch: {
        currentPage() {
            this.fetchData(); // Fetch data when page changes
        },
        itemsPerPage() {
            this.currentPage = 1; // Reset to page 1 when items per page changes
            this.fetchData();
        },
    },

};