/**
 * Migration Script: ایجاد ایندکس‌های MongoDB برای تمام Collection‌ها
 * 
 * این اسکریپت ایندکس‌های بهینه را برای تمام collection‌ها ایجاد می‌کند
 * تا جستجوها و query‌ها سریع‌تر شوند.
 */

const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

async function addAllIndexes() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "tamirban";

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is not set");
    process.exit(1);
  }

  console.log(`✅ Using MongoDB URI: ${uri.replace(/:[^:@]+@/, ":****@")}`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db(dbName);

    // ============================================
    // Customers Collection Indexes
    // ============================================
    console.log("📊 Creating indexes for 'customers' collection...\n");
    const customersCollection = db.collection("customers");

    // ایندکس برای contact.phones (array)
    try {
      await customersCollection.createIndex({ "contact.phones": 1 });
      console.log("✅ Index created: contact.phones (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: contact.phones (1)");
      } else {
        console.error("❌ Error creating contact.phones index:", error.message);
      }
    }

    // ایندکس برای contact.primaryPhone
    try {
      await customersCollection.createIndex({ "contact.primaryPhone": 1 });
      console.log("✅ Index created: contact.primaryPhone (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: contact.primaryPhone (1)");
      } else {
        console.error("❌ Error creating contact.primaryPhone index:", error.message);
      }
    }

    // ایندکس برای displayName (text search)
    try {
      await customersCollection.createIndex({ displayName: "text" });
      console.log("✅ Index created: displayName (text)");
    } catch (error) {
      if (error.code === 85 || error.code === 86) {
        console.log("ℹ️  Index already exists: displayName (text)");
      } else {
        console.error("❌ Error creating displayName text index:", error.message);
      }
    }

    // ایندکس برای status
    try {
      await customersCollection.createIndex({ status: 1 });
      console.log("✅ Index created: status (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: status (1)");
      } else {
        console.error("❌ Error creating status index:", error.message);
      }
    }

    // ایندکس برای assignedMarketerId
    try {
      await customersCollection.createIndex({ assignedMarketerId: 1 });
      console.log("✅ Index created: assignedMarketerId (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: assignedMarketerId (1)");
      } else {
        console.error("❌ Error creating assignedMarketerId index:", error.message);
      }
    }

    // ایندکس برای contact.city
    try {
      await customersCollection.createIndex({ "contact.city": 1 });
      console.log("✅ Index created: contact.city (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: contact.city (1)");
      } else {
        console.error("❌ Error creating contact.city index:", error.message);
      }
    }

    // ایندکس ترکیبی برای status و assignedMarketerId
    try {
      await customersCollection.createIndex({ status: 1, assignedMarketerId: 1 });
      console.log("✅ Index created: status (1) + assignedMarketerId (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: status (1) + assignedMarketerId (1)");
      } else {
        console.error("❌ Error creating compound index:", error.message);
      }
    }

    // ایندکس geospatial برای location
    try {
      await customersCollection.createIndex({ "location.coordinates": "2dsphere" });
      console.log("✅ Index created: location.coordinates (2dsphere)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: location.coordinates (2dsphere)");
      } else {
        console.error("❌ Error creating geospatial index:", error.message);
      }
    }

    // ایندکس برای tags
    try {
      await customersCollection.createIndex({ tags: 1 });
      console.log("✅ Index created: tags (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: tags (1)");
      } else {
        console.error("❌ Error creating tags index:", error.message);
      }
    }

    // ============================================
    // Visits Collection Indexes
    // ============================================
    console.log("\n📊 Creating indexes for 'visits' collection...\n");
    const visitsCollection = db.collection("visits");

    // ایندکس برای customerId
    try {
      await visitsCollection.createIndex({ customerId: 1 });
      console.log("✅ Index created: customerId (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: customerId (1)");
      } else {
        console.error("❌ Error creating customerId index:", error.message);
      }
    }

    // ایندکس برای marketerId
    try {
      await visitsCollection.createIndex({ marketerId: 1 });
      console.log("✅ Index created: marketerId (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: marketerId (1)");
      } else {
        console.error("❌ Error creating marketerId index:", error.message);
      }
    }

    // ایندکس برای scheduledAt
    try {
      await visitsCollection.createIndex({ scheduledAt: -1 });
      console.log("✅ Index created: scheduledAt (-1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: scheduledAt (-1)");
      } else {
        console.error("❌ Error creating scheduledAt index:", error.message);
      }
    }

    // ایندکس برای status
    try {
      await visitsCollection.createIndex({ status: 1 });
      console.log("✅ Index created: status (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: status (1)");
      } else {
        console.error("❌ Error creating status index:", error.message);
      }
    }

    // ایندکس برای visitType
    try {
      await visitsCollection.createIndex({ visitType: 1 });
      console.log("✅ Index created: visitType (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: visitType (1)");
      } else {
        console.error("❌ Error creating visitType index:", error.message);
      }
    }

    // ایندکس ترکیبی برای جستجوهای پیشرفته
    try {
      await visitsCollection.createIndex({ marketerId: 1, scheduledAt: -1, status: 1 });
      console.log("✅ Index created: marketerId (1) + scheduledAt (-1) + status (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: marketerId (1) + scheduledAt (-1) + status (1)");
      } else {
        console.error("❌ Error creating compound index:", error.message);
      }
    }

    // ============================================
    // Users Collection Indexes (for Marketers)
    // ============================================
    console.log("\n📊 Creating indexes for 'users' collection...\n");
    const usersCollection = db.collection("users");

    // ایندکس برای profile.region
    try {
      await usersCollection.createIndex({ "profile.region": 1 });
      console.log("✅ Index created: profile.region (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: profile.region (1)");
      } else {
        console.error("❌ Error creating profile.region index:", error.message);
      }
    }

    // ایندکس برای isActive
    try {
      await usersCollection.createIndex({ isActive: 1 });
      console.log("✅ Index created: isActive (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: isActive (1)");
      } else {
        console.error("❌ Error creating isActive index:", error.message);
      }
    }

    // ایندکس برای role
    try {
      await usersCollection.createIndex({ role: 1 });
      console.log("✅ Index created: role (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: role (1)");
      } else {
        console.error("❌ Error creating role index:", error.message);
      }
    }

    // ============================================
    // Customer Interactions Collection Indexes
    // ============================================
    console.log("\n📊 Creating indexes for 'customer_interactions' collection...\n");
    const interactionsCollection = db.collection("customer_interactions");

    // ایندکس برای customerId
    try {
      await interactionsCollection.createIndex({ customerId: 1 });
      console.log("✅ Index created: customerId (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: customerId (1)");
      } else {
        console.error("❌ Error creating customerId index:", error.message);
      }
    }

    // ایندکس برای createdAt (برای مرتب‌سازی)
    try {
      await interactionsCollection.createIndex({ createdAt: -1 });
      console.log("✅ Index created: createdAt (-1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: createdAt (-1)");
      } else {
        console.error("❌ Error creating createdAt index:", error.message);
      }
    }

    // ایندکس ترکیبی برای customerId و createdAt
    try {
      await interactionsCollection.createIndex({ customerId: 1, createdAt: -1 });
      console.log("✅ Index created: customerId (1) + createdAt (-1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: customerId (1) + createdAt (-1)");
      } else {
        console.error("❌ Error creating compound index:", error.message);
      }
    }

    // ============================================
    // Products Collection Indexes
    // ============================================
    console.log("\n📊 Creating indexes for 'products' collection...\n");
    const productsCollection = db.collection("products");

    // ایندکس برای isActive
    try {
      await productsCollection.createIndex({ isActive: 1 });
      console.log("✅ Index created: isActive (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: isActive (1)");
      } else {
        console.error("❌ Error creating isActive index:", error.message);
      }
    }

    // ایندکس برای name (text search)
    try {
      await productsCollection.createIndex({ name: "text" });
      console.log("✅ Index created: name (text)");
    } catch (error) {
      if (error.code === 85 || error.code === 86) {
        console.log("ℹ️  Index already exists: name (text)");
      } else {
        console.error("❌ Error creating name text index:", error.message);
      }
    }

    // ============================================
    // Tasks Collection Indexes
    // ============================================
    console.log("\n📊 Creating indexes for 'tasks' collection...\n");
    const tasksCollection = db.collection("tasks");

    // ایندکس برای assignedTo
    try {
      await tasksCollection.createIndex({ assignedTo: 1 });
      console.log("✅ Index created: assignedTo (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: assignedTo (1)");
      } else {
        console.error("❌ Error creating assignedTo index:", error.message);
      }
    }

    // ایندکس برای status
    try {
      await tasksCollection.createIndex({ status: 1 });
      console.log("✅ Index created: status (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: status (1)");
      } else {
        console.error("❌ Error creating status index:", error.message);
      }
    }

    // ایندکس برای dueAt
    try {
      await tasksCollection.createIndex({ dueAt: 1 });
      console.log("✅ Index created: dueAt (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: dueAt (1)");
      } else {
        console.error("❌ Error creating dueAt index:", error.message);
      }
    }

    // ایندکس ترکیبی برای assignedTo و status
    try {
      await tasksCollection.createIndex({ assignedTo: 1, status: 1 });
      console.log("✅ Index created: assignedTo (1) + status (1)");
    } catch (error) {
      if (error.code === 85) {
        console.log("ℹ️  Index already exists: assignedTo (1) + status (1)");
      } else {
        console.error("❌ Error creating compound index:", error.message);
      }
    }

    console.log("\n✅ All migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// اجرای migration
addAllIndexes().catch(console.error);

