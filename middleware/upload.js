const multer = require('multer');
const path = require('path');
const supabase = require('../config/supabase');

// Usar memoryStorage para processar o arquivo antes de enviar ao Supabase
const storage = multer.memoryStorage();

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Função helper para fazer upload para o Supabase Storage
const uploadToSupabase = async (file, folder = 'animals') => {
  if (!file) return null;

  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('acapra-files')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    console.error('Erro ao fazer upload para Supabase:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }

  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('acapra-files')
    .getPublicUrl(filePath);

  return {
    filename: fileName,
    originalName: file.originalname,
    path: publicUrl,
    mimetype: file.mimetype,
    size: file.size,
    supabasePath: filePath // Guardar para deletar depois se necessário
  };
};

// Função para deletar arquivo do Supabase
const deleteFromSupabase = async (supabasePath) => {
  if (!supabasePath) return;

  const { error } = await supabase.storage
    .from('acapra-files')
    .remove([supabasePath]);

  if (error) {
    console.error('Erro ao deletar arquivo do Supabase:', error);
  }
};

module.exports = upload;
module.exports.uploadToSupabase = uploadToSupabase;
module.exports.deleteFromSupabase = deleteFromSupabase;
