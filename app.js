const express = require('express')
const app = express()
const port = 3001

app.use(express.json())

var vpayments = []

app.post('/payment', createPayment)

function createPayment(req, res) {
    let { tipo, nome, numero, validade, cvv, chave, valor } = req.body;

    var opayment = {
        id: vpayments.length + 1,
        tipo: tipo,
        nome: nome,
        // Condicionalmente adicionar outros campos
        ...(tipo === 'cartao' ? { numero, validade, cvv } : {}),
        ...(tipo === 'pix' ? { chave } : {}),
        ...(tipo === 'boleto' ? { valor } : {}),
    };

    vpayments.push(opayment);

    return res.status(201).json({ 
        message: 'Dados cadastrados!'
    });
}


app.get('/payment', read_payments)

function read_payments (req, res) {

    return res.status(200).json({
        message: "Todos os cadastros",
        db: vpayments
    })
}

app.get('/payment/:id', read_payment)

function read_payment (req, res) {

    let { id } = req.params;

    const idx = vpayments.findIndex(u => u.id == id)

    if(idx === -1)
        return res.status(404).json({
        message: "Não encontrado",
        db: null
    })

    return res.status(200).json({
        message: "Cadastro encontrado",
        db: vpayments[idx]
    })
}

app.put('/payment/:id', update_payment)

function update_payment (req, res) {

    let { id } = req.params;

    const idx = vpayments.findIndex(u => u.id == id)

    if(idx === -1)
        return res.status(404).json({
        message: "Não encontrado",
        db: null
    })

    let {nome, numero, validade, cvv} = req.body

    if(nome) vpayments[idx].nome = nome
    if(numero) vpayments[idx].numero = numero
    if(validade) vpayments[idx].validade = validade
    if(cvv) vpayments[idx].cvv = cvv

    return res.status(200).json({
        message: "Encontrado",
        db: vpayments[idx]
    })
}


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})