/* Step 1 import */
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const { readdirSync } = require('fs') // ใช้ในการอ่าน directory


/* Step 4 Middleware */
app.use(morgan('dev'))  //ช่วยให้สามารถดูข้อมูลการส่ง req มาได้
app.use(express.json()) //ช่วยให้อ่านข้อมูล json ได้
app.use(cors()) //อนุญาตให้ติดต่อกันแบบข้ามโดเมนได้ (cross domain)


/* Step 3 Route */
/* ใช้ readdirSync อ่านไฟล์ในโฟลเดอร์ routes แล้ววนลูปเพื่อเขียน route */
/* Ex. app.use('/api', require(`./routes/auth.js`)) */
readdirSync('./routes').map((file) => app.use('/api', require(`./routes/${file}`)))


/* Step 2 Start server */
app.listen(5000, () => console.log("Server is running on port 5000"))