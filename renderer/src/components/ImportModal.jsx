import React, { useState } from 'react'

export default function ImportModal({ onClose }) {
  const [step,    setStep]    = useState(1)  // 1=pick, 2=map, 3=result
  const [file,    setFile]    = useState(null)
  const [preview, setPreview] = useState(null)
  const [mapping, setMapping] = useState({})
  const [result,  setResult]  = useState(null)

  const pickFile = async () => {
    const path = await window.db.pickCSV()
    if (!path) return
    setFile(path)
    const p = await window.db.previewCSV(path)
    setPreview(p); setMapping(p.mapping); setStep(2)
  }

  const doImport = async () => {
    const r = await window.db.importCSV(file, mapping)
    setResult(r); setStep(3)
  }

  return (
    <div className="import-modal">
      <h2>Importer depuis CSV</h2>

      {step === 1 && (
        <div>
          <p>Sélectionnez un fichier CSV contenant vos véhicules.</p>
          <button className="btn-primary" onClick={pickFile}>📂 Choisir fichier CSV</button>
          <button onClick={onClose}>Annuler</button>
        </div>
      )}

      {step === 2 && preview && (
        <div>
          <p>{preview.total} ligne(s) détectée(s). Vérifiez le mapping des colonnes :</p>
          <table>
            <thead><tr><th>Colonne CSV</th><th>Champ interne</th></tr></thead>
            <tbody>
              {Object.entries(mapping).map(([col, field]) => (
                <tr key={col}>
                  <td>{col}</td>
                  <td>
                    <select value={field} onChange={e =>
                      setMapping(m => ({ ...m, [col]: e.target.value }))}>
                      <option value="">-- ignorer --</option>
                      {['make_name','model_name','year','vin','registration','reg_date',
                        'fuel_type','power_cv','mileage_km','displacement_cc',
                        'engine_code','gearbox','internal_type','folder_ref'].map(f =>
                        <option key={f} value={f}>{f}</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="form-actions">
            <button className="btn-primary" onClick={doImport}> Importer</button>
            <button onClick={() => setStep(1)}>← Retour</button>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div>
          <h3> Import terminé</h3>
          <p>{result.imported} / {result.total} véhicule(s) importés avec succès.</p>
          {result.errors.length > 0 && (
            <details>
              <summary>{result.errors.length} erreur(s)</summary>
              {result.errors.map((e,i) => <p key={i}>{e.error}</p>)}
            </details>
          )}
          <button className="btn-primary" onClick={onClose}>Fermer</button>
        </div>
      )}
    </div>
  )
}