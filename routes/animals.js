const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Animal } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToSupabase, deleteFromSupabase } = require('../middleware/upload');
const { Op } = require('sequelize');
const { mapEnum, toBool } = require('../client/utils/normalize');

const router = express.Router();

// Listar animais (público) com filtros
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Construir filtros
    const where = {};
    if (req.query.species) where.species = req.query.species;
    if (req.query.size) where.size = req.query.size;
    if (req.query.gender) where.gender = req.query.gender;
    if (req.query.age) where.age = req.query.age;
    if (req.query.city) where.city = { [Op.like]: `%${req.query.city}%` };
    if (req.query.status) where.status = req.query.status;
    else where.status = { [Op.ne]: 'adotado' }; // Por padrão, não mostrar adotados

    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { breed: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } }
      ];
    }

    const { count, rows: animals } = await Animal.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['createdBy'] }
    });

    res.json({
      animals,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar animais:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter animal por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id, {
      attributes: { exclude: ['createdBy'] }
    });
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    res.json(animal);
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar animal (admin/volunteer)
router.post('/', auth, upload.array('photos', 5), [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('species').isIn(['Cão', 'Gato', 'Outro']).withMessage('Espécie inválida'),
  body('age').isIn(['Filhote', 'Jovem', 'Adulto', 'Idoso']).withMessage('Idade inválida'),
  body('size').isIn(['Pequeno', 'Médio', 'Grande']).withMessage('Porte inválido'),
  body('gender').isIn(['Macho', 'Fêmea']).withMessage('Sexo inválido'),
  body('description').trim().isLength({ min: 10 }).withMessage('Descrição deve ter pelo menos 10 caracteres'),
  body('city').trim().isLength({ min: 2 }).withMessage('Cidade é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    req.body.species = mapEnum(req.body.species, {
'Cão': ['cao','cachorro','dog'],
'Gato': ['gato','cat'],
'Outro': ['outro','outros','other']
});
req.body.age = mapEnum(req.body.age, {
'Filhote': ['filhote','bebe','bebê'],
'Jovem': ['jovem'],
'Adulto': ['adulto'],
'Idoso': ['idoso','sênior','senior']
});
req.body.size = mapEnum(req.body.size, {
'Pequeno': ['p','pequeno','small'],
'Médio': ['m','medio','médio','medium'],
'Grande': ['g','grande','large']
});
req.body.gender = mapEnum(req.body.gender, {
'Macho': ['m','macho'],
'Fêmea': ['f','femea','fêmea']
});
[
'vaccinated','neutered','dewormed','specialNeeds',
'friendly','playful','calm','protective','social',
'independent','active','docile','featured'
].forEach(k => req.body[k] = toBool(req.body[k]));
    
    // Preparar dados do animal para Sequelize
    const animalData = {
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      age: req.body.age,
      size: req.body.size,
      gender: req.body.gender,
      description: req.body.description,
      city: req.body.city,
      state: req.body.state || 'SP',
      vaccinated: req.body.vaccinated === 'true' || req.body.vaccinated === true,
      neutered: req.body.neutered === 'true' || req.body.neutered === true,
      dewormed: req.body.dewormed === 'true' || req.body.dewormed === true,
      specialNeeds: req.body.specialNeeds === 'true' || req.body.specialNeeds === true,
      healthNotes: req.body.healthNotes,
      friendly: req.body.friendly === 'true' || req.body.friendly === true,
      playful: req.body.playful === 'true' || req.body.playful === true,
      calm: req.body.calm === 'true' || req.body.calm === true,
      protective: req.body.protective === 'true' || req.body.protective === true,
      social: req.body.social === 'true' || req.body.social === true,
      independent: req.body.independent === 'true' || req.body.independent === true,
      active: req.body.active === 'true' || req.body.active === true,
      docile: req.body.docile === 'true' || req.body.docile === true,
      status: req.body.status || 'disponível',
      featured: req.body.featured === 'true' || req.body.featured === true,
      createdBy: req.user.id
    };

    // Processar fotos e fazer upload para Supabase
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToSupabase(file, 'animals'));
      const uploadedPhotos = await Promise.all(uploadPromises);
      
      animalData.photos = uploadedPhotos.map((photo, index) => ({
        ...photo,
        isMain: index === 0
      }));
    } else {
      animalData.photos = [];
    }

    const animal = await Animal.create(animalData);

    res.status(201).json({
      message: 'Animal cadastrado com sucesso',
      animal
    });
  } catch (error) {
    console.error('Erro ao criar animal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar animal (admin/volunteer)
router.put('/:id', auth, upload.array('photos', 5), async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    // Verificar permissão (admin ou criador)
    if (req.user.role !== 'admin' && animal.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Sem permissão para editar este animal' });
    }

    // NORMALIZAÇÃO — cole antes de montar updateData
if (req.body.species)
  req.body.species = mapEnum(req.body.species, {
    'Cão': ['cao','cachorro','dog'],
    'Gato': ['gato','cat'],
    'Outro': ['outro','outros','other']
  });
if (req.body.age)
  req.body.age = mapEnum(req.body.age, {
    'Filhote': ['filhote','bebe','bebê'],
    'Jovem': ['jovem'],
    'Adulto': ['adulto'],
    'Idoso': ['idoso','sênior','senior']
  });
if (req.body.size)
  req.body.size = mapEnum(req.body.size, {
    'Pequeno': ['p','pequeno','small'],
    'Médio': ['m','medio','médio','medium'],
    'Grande': ['g','grande','large']
  });
if (req.body.gender)
  req.body.gender = mapEnum(req.body.gender, {
    'Macho': ['m','macho'],
    'Fêmea': ['f','femea','fêmea']
  });
[
  'vaccinated','neutered','dewormed','specialNeeds',
  'friendly','playful','calm','protective','social',
  'independent','active','docile','featured'
].forEach(k => (req.body[k] = req.body[k] == null ? undefined : toBool(req.body[k])));


    // Preparar dados de atualização
    const updateData = {
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      age: req.body.age,
      size: req.body.size,
      gender: req.body.gender,
      description: req.body.description,
      city: req.body.city,
      state: req.body.state,
      vaccinated: req.body.vaccinated === 'true' || req.body.vaccinated === true,
      neutered: req.body.neutered === 'true' || req.body.neutered === true,
      dewormed: req.body.dewormed === 'true' || req.body.dewormed === true,
      specialNeeds: req.body.specialNeeds === 'true' || req.body.specialNeeds === true,
      healthNotes: req.body.healthNotes,
      friendly: req.body.friendly === 'true' || req.body.friendly === true,
      playful: req.body.playful === 'true' || req.body.playful === true,
      calm: req.body.calm === 'true' || req.body.calm === true,
      protective: req.body.protective === 'true' || req.body.protective === true,
      social: req.body.social === 'true' || req.body.social === true,
      independent: req.body.independent === 'true' || req.body.independent === true,
      active: req.body.active === 'true' || req.body.active === true,
      docile: req.body.docile === 'true' || req.body.docile === true,
      status: req.body.status,
      featured: req.body.featured === 'true' || req.body.featured === true
    };

    // Processar novas fotos e fazer upload para Supabase
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToSupabase(file, 'animals'));
      const uploadedPhotos = await Promise.all(uploadPromises);
      
      const newPhotos = uploadedPhotos.map(photo => ({
        ...photo,
        isMain: false
      }));
      
      updateData.photos = [...(animal.photos || []), ...newPhotos];
    }

    await animal.update(updateData);
    const updatedAnimal = await Animal.findByPk(req.params.id);

    res.json({
      message: 'Animal atualizado com sucesso',
      animal: updatedAnimal
    });
  } catch (error) {
    console.error('Erro ao atualizar animal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Marcar como adotado (admin/volunteer)
router.patch('/:id/adopt', auth, [
  body('adopterName').trim().isLength({ min: 2 }).withMessage('Nome do adotante é obrigatório'),
  body('adopterContact').trim().isLength({ min: 5 }).withMessage('Contato do adotante é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const animal = await Animal.findByPk(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    await animal.update({
      status: 'adotado',
      adoptedAt: new Date(),
      adopterName: req.body.adopterName,
      adopterContact: req.body.adopterContact,
      adopterNotes: req.body.adopterNotes || ''
    });
    
    const updatedAnimal = await Animal.findByPk(req.params.id);

    if (!updatedAnimal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    res.json({
      message: 'Animal marcado como adotado',
      animal: updatedAnimal
    });
  } catch (error) {
    console.error('Erro ao marcar adoção:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Remover foto (admin/volunteer)
router.delete('/:id/photos/:photoIndex', auth, async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    // Verificar permissão
    if (req.user.role !== 'admin' && animal.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Sem permissão' });
    }

    const photoIndex = parseInt(req.params.photoIndex);
    const photos = animal.photos || [];
    
    if (photoIndex < 0 || photoIndex >= photos.length) {
      return res.status(404).json({ message: 'Foto não encontrada' });
    }

    const photo = photos[photoIndex];
    
    // Remover arquivo do Supabase Storage
    if (photo.supabasePath) {
      await deleteFromSupabase(photo.supabasePath);
    }

    // Remover foto do array
    photos.splice(photoIndex, 1);
    await animal.update({ photos });

    res.json({ message: 'Foto removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover foto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar animal (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    // Remover fotos do Supabase Storage
    if (animal.photos && animal.photos.length > 0) {
      const deletePromises = animal.photos
        .filter(photo => photo.supabasePath)
        .map(photo => deleteFromSupabase(photo.supabasePath));
      await Promise.all(deletePromises);
    }

    await animal.destroy();

    res.json({ message: 'Animal removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar animal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
