// BUG:
// The table creation is on the main thread of route.
// Javascript does not permit await on the main thread.
// Therefore the tables will be created only after a route is requested.

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "public/db.sqlite",
  },
  useNullAsDefault: true,
});
const bookshelf = require("bookshelf")(knex);

// create products table
knex.schema
  .createTable("products", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("description");
    table.string("barcode");
    table.decimal("cost");
    table.decimal("retail");
  })
  .then(() => console.log("Products table created."))
  .catch(() => console.log("Products table exists."));

// model products table
const Product = bookshelf.Model.extend({
  tableName: "products",
});

// create default products if no products exist
Product.where({})
  .count()
  .then(function (count) {
    if (count === 0) {
      const Products = bookshelf.Collection.extend({
        model: Product,
      });
      return Products.forge([
        {
          name: "H7G",
          description: "FORMULA (H7) 1 GALON",
          barcode: "ABC-abc-1234",
          cost: 6.0,
          retail: 10.0,
        },
        {
          name: "H7MP36",
          description: "H7 MULTI PURPOSE CLEANER 36 OZ",
          barcode: "KLM-osj-1234",
          cost: 3.0,
          retail: 6.0,
        },
        {
          name: "GPMP",
          description: "GP-MULTI PURPOSE CLEANR 32 OZ",
          barcode: "EFG-dbc-1234",
          cost: 3.0,
          retail: 6.0,
        },
      ])
        .invokeThen("save")
        .then(() => console.log("Default products created."));
    }
  })
  .catch((err) => console.log("Default products error!", err));

// create settings table
knex.schema
  .createTable("settings", function (table) {
    table.increments("id").primary();
    table.string("type");
    table.json("setting");
  })
  .then(() => console.log("Settings table created."))
  .catch((err) => console.log("Settings table exists."));

// model settings table
const Setting = bookshelf.Model.extend({
  tableName: "settings",
});

// create default email setting if does not exist
new Setting({ type: "email" }).fetch({ require: false }).then((result) => {
  if (!result) {
    return new Setting({
      type: "email",
      setting: JSON.stringify({
        from: "noreply@bot.com",
        subject: "Product Listings",
        html: "This is my default template",
      }),
    })
      .save()
      .then(() => console.log("Default email setting created."))
      .catch((err) => console.log("Default email setting error!", err));
  }
});

module.exports = { Product, Setting };
