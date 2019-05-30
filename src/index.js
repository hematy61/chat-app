const express = require('express')

const app = express()
const port = process.env.PORT


/*******************************************************************
 ***************** listener ****************************************
 *******************************************************************/
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})