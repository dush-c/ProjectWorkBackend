import { Request, Response } from 'express';
import CategoriaMovimento from './categoriaMovimenti.model';

export const getAllCategorie = async (req: Request, res: Response) => {
  try {
    const categorie = await CategoriaMovimento.find();
    res.json(categorie);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero delle categorie', error });
  }
};

export const getCategoriaById = async (req: Request, res: Response) => {
    try {
      const categoria = await CategoriaMovimento.findById(req.params.id);
      if (!categoria) {
        return res.status(404).json({ message: 'Categoria non trovata' });
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero della categoria', error });
    }
  };