import React from 'react';

const ph = (w, h) => `https://via.placeholder.com/${w}x${h}`;

const mockStories = [
  {
    id: 1,
    title: 'Antes e Depois 1',
    image: ph(400,300),
    beforeImage: ph(300,200),
    afterImage: ph(300,200)
  },
  {
    id: 2,
    title: 'Antes e Depois 2',
    image: ph(400,300),
    beforeImage: ph(300,200),
    afterImage: ph(300,200)
  },
];

export default function Stories() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Histórias</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockStories.map(s => (
          <div key={s.id} className="border rounded p-3">
            <img src={s.image} alt={s.title} className="w-full h-auto rounded mb-2" />
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-gray-600 mb-1">Antes</div>
                <img src={s.beforeImage} alt="antes" className="w-full h-auto rounded" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Depois</div>
                <img src={s.afterImage} alt="depois" className="w-full h-auto rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
