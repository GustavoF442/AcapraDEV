export default function handler(req, res) {
  res.status(200).json({
    message: 'API Test funcionando!',
    timestamp: new Date(),
    method: req.method,
    url: req.url,
    status: 'ok'
  });
}
