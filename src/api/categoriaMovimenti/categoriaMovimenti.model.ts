import mongoose from 'mongoose';

const categoriaMovimentoSchema = new mongoose.Schema({
  NomeCategoria: String,
  Tipologia: String
});

export default mongoose.model('CategoriaMovimento', categoriaMovimentoSchema, 'categoriamovimentis');
