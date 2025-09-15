<template>
<app-bar></app-bar>

<v-container class="shop-container py-12">
    <!-- Page Heading -->
    <h1 class=" text-center mb-8" :style="{ color: darkBlue, fontWeight: '800', fontSize: '2.5rem' }">
        Suit Accessories Shop
    </h1>

    <!-- Intro -->
    <p class="shop-intro text-center mb-14 mx-auto">
        Discover premium accessories to complete your perfect suit look — from silk ties to gold cufflinks, all crafted with exceptional quality.
    </p>

    <!-- Category Filter -->
    <v-row justify="center" class="mb-12">
        <v-col cols="12" md="8" class="d-flex justify-center">
            <v-btn-toggle v-model="selectedCategory" mandatory rounded class="category-toggle" dense>
                <v-btn v-for="category in categories" :key="category" :value="category" class="category-btn" :class="{ active: selectedCategory === category }" elevation="0">
                    {{ category }}
                </v-btn>
            </v-btn-toggle>
        </v-col>
    </v-row>

    <!-- Product Cards -->
    <v-row justify="center" align="stretch" dense>
        <v-col v-for="(product, i) in filteredProducts" :key="i" cols="12" sm="6" md="4" lg="3" class="mb-8">
            <v-card class="product-card" elevation="10">
                <!-- Product Image -->
                <v-img :src="product.image" height="220" class="product-image" cover></v-img>

                <!-- Product Info -->
                <v-card-text class="text-center px-6 py-4">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="product-price">
                        <span class="currency">TZS</span>
                        <span class="amount">{{ product.price }}</span>
                    </p>
                </v-card-text>

                <!-- Add to Cart Button -->
                <v-card-actions class="justify-center pb-6">
                    <v-btn color="primary" class="add-cart-btn" large rounded elevation="0" @click.stop="addToCart(product)">
                        <v-icon left>mdi-cart-plus</v-icon>
                        Add to Cart
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</v-container>

<Footer></Footer>
</template>

<script>
import appBar from '../Layout/appBar.vue';
import Footer from '../Layout/Footer.vue';

import tieImage from '@/assets/accessories/bowtie.jpg';
import socksImage from '@/assets/accessories/sock1.jpeg';
import cufflinksImage from '@/assets/accessories/cufflick2.jpg';
import shirtImage from '@/assets/accessories/shirt.jpeg';

export default {
    components: {
        appBar,
        Footer,
    },
    data() {
        return {
            selectedCategory: 'All',
            categories: ['All', 'Ties', 'Socks', 'Cufflinks', 'Shirts'],
            products: [{
                    name: 'Silk Tie',
                    price: '25,000',
                    category: 'Ties',
                    image: tieImage,
                },
                {
                    name: 'Luxury Socks',
                    price: '15,000',
                    category: 'Socks',
                    image: socksImage,
                },
                {
                    name: 'Gold Cufflinks',
                    price: '45,000',
                    category: 'Cufflinks',
                    image: cufflinksImage,
                },
                {
                    name: 'Formal Shirt',
                    price: '40,000',
                    category: 'Shirts',
                    image: shirtImage,
                },
            ],
        };
    },
    computed: {
        filteredProducts() {
            if (this.selectedCategory === 'All') return this.products;
            return this.products.filter((p) => p.category === this.selectedCategory);
        },
    },
    methods: {
        addToCart(product) {
            alert(`Added ${product.name} to cart`);
        },
    },
};
</script>

<style scoped>
.shop-container {
    max-width: 1140px;
    margin: 0 auto;
    padding-left: 2rem;
    padding-right: 2rem;
}

/* Title */
.shop-title {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #1a1a1a;
    font-weight: 700;
    font-size: 2.8rem;
    letter-spacing: 0.03em;
    user-select: none;
}

/* Intro */
.shop-intro {
    max-width: 680px;
    color: #444444;
    font-size: 1.15rem;
    line-height: 1.5;
    font-weight: 400;
    user-select: none;
}

/* Category toggle buttons */
.category-toggle {
    background-color: transparent;
    border-radius: 40px;
    box-shadow: none;
}

.category-btn {
    font-size: 1rem;
    padding: 8px 26px !important;
    font-weight: 500;
    color: #666;
    background-color: #f0f0f0;
    border: 1.8px solid transparent;
    border-radius: 40px;
    text-transform: none;
    transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
    user-select: none;
    cursor: pointer;
}

.category-btn:hover {
    background-color: #e0e0e0;
}

.category-btn.active {
    background-color: #a82228;
    color: #fff !important;
    border-color: #7b1b1f;
    font-weight: 600;
    box-shadow: 0 3px 6px rgb(168 34 40 / 0.3);
}

/* Product card */
.product-card {
    display: flex;
    flex-direction: column;
    border-radius: 14px;
    /* border: 1px solid #ddd; */
    background: #fff;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    cursor: default;
    user-select: none;
}

.product-card:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-6px);
}

/* Product image */
.product-image {
    border-top-left-radius: 14px !important;
    border-top-right-radius: 14px !important;
}

/* Product name */
.product-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: #222;
    margin: 0;
    letter-spacing: 0.02em;
}

/* Price */
.product-price {
    margin-top: 6px;
    font-weight: 600;
    font-size: 1rem;
    color: #a82228;
}

.currency {
    font-size: 1rem;
    vertical-align: top;
    margin-right: 5px;
    font-weight: 600;
    letter-spacing: 0.03em;
}

.amount {
    letter-spacing: 0.08em;
}

/* Add to Cart button */
.add-cart-btn {
    background-color: #a82228 !important;
    color: #fff !important;
    text-transform: none;
    font-weight: 600;
    padding-left: 28px !important;
    padding-right: 28px !important;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 6px rgb(168 34 40 / 0.4);
    user-select: none;
}

.add-cart-btn:hover,
.add-cart-btn:focus {
    background-color: #8a1c20 !important;
    box-shadow: 0 4px 12px rgb(138 28 32 / 0.5);
}

.add-cart-btn:active {
    background-color: #6c1417 !important;
    box-shadow: none;
}

/* Prevent text selection on buttons */
.v-btn,
.v-btn * {
    user-select: none !important;
}
</style>
