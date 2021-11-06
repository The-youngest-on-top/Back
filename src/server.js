const express = require('express');
const app = express();
const router = require('./routers/app'); 
const port = process.env.PORT || 3003;

app.use(router);


app.listen(port, () => {
    console.log(`server is listening at localhost:${process.env.PORT}`);
});