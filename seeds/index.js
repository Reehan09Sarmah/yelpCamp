const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connected!")
})

const sample = (array) => { return array[Math.floor(Math.random() * array.length)] }

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground(
            {
                author: '649c3b87e30df4513a5f1d45',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
                price,
                images: [
                    {
                        url: 'https://res.cloudinary.com/dfquixj4d/image/upload/v1688125828/YelpCamp/glhw8xknd8p96zdbcqax.jpg',
                        filename: 'YelpCamp/glhw8xknd8p96zdbcqax',

                    },
                    {
                        url: 'https://res.cloudinary.com/dfquixj4d/image/upload/v1688125840/YelpCamp/yopfe9liutuen3umvq3d.jpg',
                        filename: 'YelpCamp/yopfe9liutuen3umvq3d',

                    },
                    {
                        url: 'https://res.cloudinary.com/dfquixj4d/image/upload/v1688125841/YelpCamp/mhzxtate7xkr6n8ciq9y.jpg',
                        filename: 'YelpCamp/mhzxtate7xkr6n8ciq9y',
                    }
                ]
            }
        )
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})


