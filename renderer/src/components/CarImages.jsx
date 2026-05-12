import React, { useState, useEffect } from 'react'

export default function CarImages({ carId, onPendingChange }) {
    const [saved,   setSaved]   = useState([])
    const [pending, setPending] = useState([])  // { path, previewUrl }
    const [loading, setLoading] = useState(false)

    useEffect(function() {
        if (carId) loadSaved()
    }, [carId])

    async function loadSaved() {
        var imgs = await window.db.getCarImages(carId)
        setSaved(imgs || [])
    }

    async function handlePick() {
        setLoading(true)
        try {
            var paths = await window.db.pickImages()
            if (!paths || paths.length === 0) return
            if (carId) {
                await window.db.uploadImages(carId, paths)
                await loadSaved()
            } else {
                var previews = await window.db.previewImages(paths)
                var added    = paths.map(function(p, i) { return { path: p, previewUrl: previews[i] } })
                var updated  = pending.concat(added)
                setPending(updated)
                if (onPendingChange) onPendingChange(updated.map(function(p) { return p.path }))
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleDeleteSaved(id) {
        await window.db.deleteImage(id)
        await loadSaved()
    }

    function handleDeletePending(index) {
        var updated = pending.filter(function(_, i) { return i !== index })
        setPending(updated)
        if (onPendingChange) onPendingChange(updated.map(function(p) { return p.path }))
    }

    var total = saved.length + pending.length

    return (
        <div className="ci-wrapper">
            <div className="ci-header">
                <h3>Photos ({total})</h3>
                <button className="ci-btn-add" onClick={handlePick} disabled={loading}>
                    {loading ? 'Chargement…' : '+ Ajouter des photos'}
                </button>
            </div>

            {total === 0 && (
                <p className="ci-empty">Aucune photo. Cliquez sur "Ajouter des photos".</p>
            )}

            <div className="ci-grid">
                {saved.map(function(img) {
                    return (
                        <div key={img.id} className="ci-card">
                            <img src={img.previewUrl} alt="" className="ci-img" />
                            <button className="ci-del" title="Supprimer"
                                onClick={function() { handleDeleteSaved(img.id) }}>✕</button>
                        </div>
                    )
                })}
                {pending.map(function(p, i) {
                    return (
                        <div key={'p' + i} className="ci-card ci-card--pending">
                            <img src={p.previewUrl} alt="" className="ci-img" />
                            <span className="ci-pending-label">En attente</span>
                            <button className="ci-del" title="Retirer"
                                onClick={function() { handleDeletePending(i) }}>✕</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}