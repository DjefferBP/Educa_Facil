//Importação
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const SECRET = 'JAHFJ786s78dsdgsadutdtiu7';
const users = []; //"Banco de Dados" em memória
const posts = [
    {id:1, título: "Projeto de Inovação", comentarios: []},
    {id:2, título: "Semana Academica", comentarios: []}

]
//Cadastro de usuario - POST
//Login com JWT - rota POST
//autenticar o Token(Função)

app.post("/register", async (req, res)=>{
    const {email, password} = req.body;
    const passwordCrypt = await bcrypt.hash(password, 8);
    users.push({email, password:passwordCrypt})
    res.status(201).send("Usuario registrado com sucesso")
})

app.post("/login", async(req, res)=>{
    const{email, password} = req.body;
    const user = user.find(u => u.email === email);
    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(401).send("Credenciais inválidas")
    }
    const token = jwt.sign({email}, SECRET, {expiresIn: '1H'});
    res.json({token})
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split('')[1];
    if(!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    
    })

}

//Rota pública para listar todos os posts
app.get('/posts', (req, res)=> res.json(posts))

//Rota protegida para adicionar comentarios nos posts

app.post('/posts/:id/comments', authenticateToken, (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if(!posts) return res.status(404).send('Post não encontrado');

    const {texto} = req.body;
    if(!texto || texto.trim() === ''){
        return res.status(400).send('Comentário vazio');
    } 

    post.comentarios.push({
        autor: req.user.email,
        texto
    })

    res.send('Comentário adicionado!');

})

app.listen(3000, ()=>console.log("Servidor rodando na porta 3000"))
