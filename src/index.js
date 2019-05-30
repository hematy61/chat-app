const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')


/*******************************************************************
 ***************** home route **************************************
 *******************************************************************/
app.use(express.static(publicDirectoryPath))
app.get('', (req, res) => {
  res.render('index')
})


/*******************************************************************
 ***************** listener ****************************************
 *******************************************************************/
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})