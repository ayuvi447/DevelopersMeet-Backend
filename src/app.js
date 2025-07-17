import express from 'express'

const app = express(); 



const PORT = 3009

app.use((req, res)=>{
    res.send('Hello from the server')
})



app.get('/',(req,res)=>{
    res.send("hi vicky")
})
app.get('/about',(req,res)=>{
    res.send("About Vicky")
})

app.get('/contact',(req, res)=>{
    res.send("Contact us")
})

app.get('/contact122',(req, res)=>{
    res.send("Contact ufejneagnaefjangaeng")
})

app.listen(PORT, ()=>{
    console.log(`Listining to port ${PORT}`);
})