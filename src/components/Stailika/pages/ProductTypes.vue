<template>
  <app-bar></app-bar>

  <v-container class="py-12">
    <!-- Heading -->
    <h1 class="text-center mb-6" :style="{ color: darkBlue, fontWeight: '800', fontSize: '2.5rem' }">
      {{ productTitle }}
    </h1>

    <!-- Intro -->
    <p class="text-center mb-10" style="color: #555; font-size: 1.1rem; max-width: 800px; margin: auto;">
      Explore our premium selection of {{ productTitle.toLowerCase() }} crafted with precision and style.
    </p>

    <!-- Variations -->
    <v-row justify="center" align="stretch" dense>
      <v-col v-for="(variation, index) in variations" :key="index" cols="12" md="4" class="mb-8">
        <v-card class="pricing-card" elevation="10">
          <v-img :src="variation.image" height="200px" cover></v-img>
          <div class="plan-header" :style="{ background: variation.color || '#A82228' }">
            <h3>{{ variation.name }}</h3>
          </div>
          <v-card-text class="price-text">
            <span class="currency">TZS</span>
            <span class="amount">{{ variation.price }}</span>
          </v-card-text>
          <v-card-text class="desc-text">
            {{ variation.desc }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <Footer></Footer>
</template>

<script>
import appBar from '../Layout/appBar.vue';
import Footer from '../Layout/Footer.vue';
import axios from 'axios';

export default {
  components: { appBar, Footer },
  data() {
    return {
      darkBlue: '#020B2C',
      productTitle: '',
      variations: []
    };
  },
  async created() {
    const name = this.$route.params.name.replace(/-/g, ' ');
    this.productTitle = name.charAt(0).toUpperCase() + name.slice(1);

    try {
      // Fetch packages from API by type
      const response = await axios.get(`/api/packages?type=${name}`);
      const packages = response.data.data || [];

      this.variations = packages.map(pkg => ({
        name: pkg.name,
        price: pkg.max_price || pkg.min_price || 'N/A',
        desc: pkg.includes ? pkg.includes.join(', ') : 'No description',
        color: '#A82228', // You can set color dynamically if your API provides it
        image: pkg.image ? `${window.location.origin}/${pkg.image}` : '' // full URL
      }));
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  }
};
</script>

<style scoped>
.pricing-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.pricing-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.25);
}
.plan-header {
  padding: 16px;
  color: white;
  font-size: 1.4rem;
  font-weight: 700;
}
.price-text {
  padding-top: 15px;
  font-weight: 700;
  font-size: 1.2rem;
}
.currency {
  font-size: 1rem;
  vertical-align: top;
  margin-right: 2px;
}
.amount {
  font-size: 2rem;
}
.desc-text {
  color: #555;
  font-size: 0.95rem;
  padding: 10px 20px;
}
</style>
