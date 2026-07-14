
import axios from "axios";

export default {

    data() {
        return {

            stats: {
                // totalGatePasses: 0,
                activeToday: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                inside: 0,
                outside: 0,
                entry: 0,
                exit: 0,
                expired: 0,
                expiringToday: 0,
                waitingApproval: 0,
                completed: 0,
            },

            kpis: [
                {
                    key: "activeToday",
                    label: "Todays Active Passes",
                    value: 0,
                    icon: "mdi-file-document-multiple",
                    color: "#2563eb",
                    bg: "rgba(37,99,235,.12)"
                },
                {
                    key: "expired",
                    label: "Expired Gate Passes",
                    value: 0,
                    icon: "mdi-alert-circle-outline",
                    color: "#ef4444",
                    bg: "rgba(239,68,68,.12)"
                },
                {
                    key: "expiringToday",
                    label: "Expiring Today",
                    value: 0,
                    icon: "mdi-clock-alert-outline",
                    color: "#f59e0b",
                    bg: "rgba(245,158,11,.12)"
                },

                {
                    key: "inside",
                    label: "Visitors Inside",
                    value: 0,
                    icon: "mdi-account-group",
                    color: "#0ea5e9",
                    bg: "rgba(14,165,233,.12)"
                },

                {
                    key: "entry",
                    label: "Today's Entries",
                    value: 0,
                    icon: "mdi-login",
                    color: "#10b981",
                    bg: "rgba(16,185,129,.12)"
                },

                {
                    key: "exit",
                    label: "Today's Exits",
                    value: 0,
                    icon: "mdi-logout",
                    color: "#f59e0b",
                    bg: "rgba(245,158,11,.12)"
                },

                {
                    key: "pending",
                    label: "Pending Requests",
                    value: 0,
                    icon: "mdi-clock-outline",
                    color: "#8b5cf6",
                    bg: "rgba(139,92,246,.12)"
                },

                {
                    key: "approved",
                    label: "Approved Passes",
                    value: 0,
                    icon: "mdi-check-circle",
                    color: "#22c55e",
                    bg: "rgba(34,197,94,.12)"
                },

                {
                    key: "rejected",
                    label: "Rejected Passes",
                    value: 0,
                    icon: "mdi-close-circle",
                    color: "#ef4444",
                    bg: "rgba(239,68,68,.12)"
                },

                {
                    key: "waitingApproval",
                    label: "Waiting Approval",
                    value: 0,
                    icon: "mdi-timer-sand",
                    color: "#f97316",
                    bg: "rgba(249,115,22,.12)"
                },

                {
                    key: "completed",
                    label: "Completed",
                    value: 0,
                    icon: "mdi-shield-check",
                    color: "#14b8a6",
                    bg: "rgba(20,184,166,.12)"
                }
            ],

            visitors: [

                {
                    id: 1,
                    name: "John Doe",
                    company: "ABC Limited",
                    pass_no: "GP-00124",
                    time_in: "08:15 AM",
                    duration: "2h 10m"
                },

                {
                    id: 2,
                    name: "Jane Smith",
                    company: "XYZ Company",
                    pass_no: "GP-00125",
                    time_in: "09:02 AM",
                    duration: "1h 23m"
                }

            ],




            gateStatus: [

                {
                    gate: "Gate 1",
                    status: "ONLINE"
                },

                {
                    gate: "Gate 2",
                    status: "ONLINE"
                }

            ],


        }
    },
 
    mounted() {
        this.fetchCustomRangeData(null, null);
    },

    methods: {

        goTo(route) {

            this.$router.push(route);

        },

        async fetchCustomRangeData(start, end) {
            try {

                const { data } = await axios.get('/dashboard-counts', {
                    params: {
                        start_date: start,
                        end_date: end
                    }
                });

                // SAFE mapping (recommended)
                this.stats.totalGatePasses = data.totalGatePasses ?? 0;
                this.stats.pending = data.pending ?? 0;
                this.stats.approved = data.approved ?? 0;
                this.stats.rejected = data.rejected ?? 0;
                this.stats.inside = data.inside ?? 0;
                this.stats.outside = data.outside ?? 0;
                this.stats.entry = data.entry ?? 0;
                this.stats.expired = data.expired ?? 0;
                this.stats.waitingApproval = data.waitingApproval ?? 0;
                this.stats.completed = data.completed ?? 0;
                this.stats.activeToday = data.activeToday ?? 0;

                this.updateKpis();

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        },
        updateKpis() {
            this.kpis = this.kpis.map(kpi => {
                return {
                    ...kpi,
                    value: this.stats[kpi.key] ?? 0
                };
            });
        },
      

    }

};