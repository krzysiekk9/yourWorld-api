# Backend for Your World App

---

### How it's made

Your World API was made using Node.js and Express.js. For routing I used Express Router. DB is made using PostgreSQL for storing trips data, for storing images AWS S3 bucket was used. To recive images from front end I used multer. The application is design in MVC architecture.

### How it's working

After reciving data form frontend, server checks if the recived data containes images, if so, photos are uploaded to AWS, after that app checks if upload was successful for each photo. If everything went well then trip detail are uploaded to database, as well as images details (with links from AWS). If data was uploaded without images then data is just uploaded to database.

Your World API aslo has endpoints for getting data from database about already saved trips and for getting images from specified trip.

### Database scheme

Database consist of 2 tables: trips and images. The relationship between them is one to one on the "trip_id" column.

![sb_scheme_wht drawio](https://github.com/krzysiekk9/yourWorld-api/assets/107801980/55d0c9aa-2192-4220-8791-c1219f16338f)

### API scheme

![API](https://github.com/krzysiekk9/yourWorld-api/assets/107801980/a7bd46e0-ba5f-42bb-9ffe-5427bb9ec49f)
