export default function handler(req, res) {
  res.status(200).json({
    message: 'API da ACAPRA funcionando!',
    timestamp: new Date(),
    status: 'ok',
    method: req.method,
    url: req.url
  });
}
