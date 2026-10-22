db = db.getSiblingDB("three_tier_app");

db.products.createIndex({ name: 1 });
