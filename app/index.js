const axios = require("axios")
const mongoose = require("mongoose");
const config = require("./config");
const Product = require("./models/product")

mongoose.connect(config.mongo.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

async function startMonitor() {
    try {
        let webProducts = await axios.post('https://mnrwefss2q-dsn.algolia.net/1/indexes/Listing_production/query', {
            params: config.grailed.params
        }, {
            headers: {
                'User-Agent': 'Algolia for Swift (6.2.0); iOS (13.3)',
                'X-Algolia-Application-Id': 'MNRWEFSS2Q',
                'X-Algolia-API-Key': 'a3a4de2e05d9e9b463911705fb6323ad',
                'X-NewRelic-ID': 'UAEPUldQGwIGUVhaDggCVQ=='
            }
        })
        let mongoProducts = await Product.find({})
        webProducts.data.hits.forEach(webProduct => {
            if (mongoProducts.some((mongoProduct) => mongoProduct.id === webProduct.id && mongoProduct.price !== webProduct.price)) {
                productPriceChange(webProduct)
            } else if (!(mongoProducts.some((mongoProduct) => mongoProduct.id === webProduct.id))) {
                newProduct(webProduct)
            }
        })
        console.log('Done')
        await new Promise(resolve =>
            setTimeout(resolve, 10000)
        );
        startMonitor()
    } catch (error) {
        console.log(error.response)
        await new Promise(resolve =>
            setTimeout(resolve, 60000)
        );
        startMonitor()
    }
}

async function productPriceChange(webProduct) {
    try {
        await Product.findOneAndUpdate({id: webProduct.id}, {price: webProduct.price})
        await axios.post(config.discord.webhook, {
            embeds: [{
                title: `Updated: ${webProduct.title}`,
                url: `https://www.grailed.com/listings/${webProduct.id}`,
                description: webProduct.description.split('\n').join(' '),
                thumbnail: {
                    url: webProduct.cover_photo.url
                },
                fields: [
                    {
                        name: `Price:`,
                        value: `${webProduct.currency.toUpperCase()} ${webProduct.price}`,
                        inline: true
                    },
                    {
                        name: `Size:`,
                        value: `${webProduct.size}`,
                        inline: true
                    },
                    {
                        name: `Condition:`,
                        value: `${webProduct.condition.split('_').join(' ')}`,
                        inline: true
                    },
                    {
                        name: `User Rating:`,
                        value: `${webProduct.user.aggregate_feedback_count}`,
                        inline: true
                    },
                    {
                        name: `Previous Prices:`,
                        value: `${webProduct.price_drops.join(', ')}`,
                        inline: true
                    },
                    {
                        name: `Created At:`,
                        value: `${webProduct.created_at}`,
                        inline: true
                    }
                ],
                footer: {
                    icon_url: 'https://cdn.discordapp.com/avatars/194601739523981313/a_5b6e39123ea5815756ae89ece2796787.png',
                    text: `By: iNcizzle#1337 - ${(new Date()).toISOString()}`
                }
            }]
        })
        return 
    } catch (error) {
        console.log(error)
        return
    }
}

async function newProduct(webProduct) {
    try {
        new Product({
            _id: new mongoose.Types.ObjectId(),
            ...webProduct
        }).save()
        await axios.post(config.discord.webhook, {
            embeds: [{
                title: `New: ${webProduct.title}`,
                url: `https://www.grailed.com/listings/${webProduct.id}`,
                description: webProduct.description.split('\n').join(' '),
                thumbnail: {
                    url: webProduct.cover_photo.url
                },
                fields: [
                    {
                        name: `Price:`,
                        value: `${webProduct.currency.toUpperCase()} ${webProduct.price}`,
                        inline: true
                    },
                    {
                        name: `Size:`,
                        value: `${webProduct.size}`,
                        inline: true
                    },
                    {
                        name: `Condition:`,
                        value: `${webProduct.condition.split('_').join(' ')}`,
                        inline: true
                    },
                    {
                        name: `User Rating:`,
                        value: `${webProduct.user.aggregate_feedback_count}`,
                        inline: true
                    },
                    {
                        name: `Previous Prices:`,
                        value: `${webProduct.price_drops.join(', ')}`,
                        inline: true
                    },
                    {
                        name: `Created At:`,
                        value: `${webProduct.created_at}`,
                        inline: true
                    }
                ],
                footer: {
                    icon_url: 'https://cdn.discordapp.com/avatars/194601739523981313/a_5b6e39123ea5815756ae89ece2796787.png',
                    text: `By: iNcizzle#1337 - ${(new Date()).toISOString()}`
                }
            }]
        })
        return 
    } catch (error) {
        return
    }
}

startMonitor()