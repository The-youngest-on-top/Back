const express = require('express');
const app = express();
const router = require('./routers/weather_router'); 
const port = process.env.PORT || 3003;
const body_parser = require('body-parser')

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))
app.use(router);


app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});