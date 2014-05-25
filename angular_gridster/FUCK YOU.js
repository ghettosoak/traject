//The an Array of Embedded Docs does have the push method. Simply add Embedded Documents after initially creating the item:

var item = new Catalog;
item.name = "Seat 1003";
item.pattern = "91003";
item.categories.push({year: 1998, make: 'Toyota', model: 'Camry', body: 'sedan' });

var color = new Color({name: 'color regular', id: '2asdfasdfad', surcharge: 10.00});
var material = new Material({name: 'material regular', surcharge: 10.00});
var style = new Style({name: 'regular', surcharge: 10.00});
//then you can push each embedded doc into their parents:

material.colors.push(color);
style.materials.push(material);
item.styles.push(style);
//Then you can save the entire object the database as you where already doing:

item.save(function(err){});
//That's it! And you have Embedded DocumentArrays.

//A few other notes about your code, you have pattern twice in your Catalog model. And in order to access your other model types, you'll need to also export those:

exports.Catalog = mongoose.model('Catalog', CatalogSchema);
exports.Color = mongoose.model('Colors', ColorsSchema);
exports.Material = mongoose.model('Materials', MaterialsSchema);
exports.Style = mongoose.model('Style', StyleSchema);