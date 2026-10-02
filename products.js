/* =====================================================
   GLOW & GRACE COSMETICS - products.js

   THIS IS THE ONLY PLACE WHERE YOU MANAGE PRODUCTS.
   Add, edit or delete products here. The website builds
   the product cards automatically from this list.

   Each product has 6 fields:

   id          -> a unique number (1, 2, 3 ...). Never repeat a number.
   name        -> product name shown on the card
   category    -> one of: "Makeup", "Skincare", "Haircare",
                  "Fragrances", "Lip Products"
   price       -> price in PKR, numbers only (no "Rs." and no comma)
   description -> one short sentence about the product
   image       -> the picture's file name, saved in images/products/

   HOW TO ADD A PRODUCT:
   1. Copy one product block (from { to },) and paste it below the last one.
   2. Give it a new id and change the details.
   3. Put the picture in images/products/ with the same file name.

   HOW TO REMOVE A PRODUCT:
   Delete its block (from { to },).

   Be careful with: commas after each block "}," and quotes "..."
   ===================================================== */

const products = [
  {
    id: 1,
    name: "Foundation",
    category: "Makeup",
    price: 1800,
    description: "Smooth coverage for an even, natural look.",
    image: "foundation.webp"
  },
  {
    id: 2,
    name: "Mascara",
    category: "Makeup",
    price: 900,
    description: "Makes lashes look longer and fuller.",
    image: "maskara.webp"
  },
  {
    id: 3,
    name: "Vitamin C Serum",
    category: "Skincare",
    price: 2400,
    description: "Helps skin look fresh and bright.",
    image: "vitamincserum.webp"
  },
  {
    id: 4,
    name: "Moisturizer",
    category: "Skincare",
    price: 1200,
    description: "Keeps skin soft and hydrated all day.",
    image: "moisturizer.webp"
  },
  {
    id: 5,
    name: "Hair Oil",
    category: "Haircare",
    price: 1300,
    description: "Adds shine and softness to dry hair.",
    image: "hairoil.avif"
  },
  {
    id: 6,
    name: "Perfume",
    category: "Fragrances",
    price: 3500,
    description: "A fresh scent that lasts long.",
    image: "perfume.webp"
  },
  {
    id: 7,
    name: "Lipstick",
    category: "Lip Products",
    price: 800,
    description: "Rich colour with a smooth finish.",
    image: "lipstick.webp"
  },
  {
    id: 8,
    name: "Lip Balm",
    category: "Lip Products",
    price: 450,
    description: "Soothes dry lips and keeps them soft.",
    image: "lipbalm.webp"
  }
];
