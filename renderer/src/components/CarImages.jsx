// @ts-nocheck
import React, { useState, useEffect } from 'react'

export default function CarImages({ carId, onPendingChange }) {
    const [saved,   setSaved]   = useState([])  // from DB
    const [pending, setPending] = useState([])  // { path, previewUrl } before save
    const [loading, setLoading] = useState(false)

    useEffect(function() {
        if (carId) {
            loadSaved()
        }
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
                // Car exists — upload straight to DB
                await window.db.uploadImages(carId, paths)
                await loadSaved()
            } else {
                // New car not saved yet — preview locally via base64
                var previews = await window.db.previewImages(paths)
                var added = paths.map(function(p, i) {
                    return { path: p, previewUrl: previews[i] }
                })
                var updated = pending.concat(added)
                setPending(updated)
                if (onPendingChange) onPendingChange(updated.map(function(p) { return p.path }))
            }
        } finally {
            setLoading(false)
        }
    }

    function removePending(index) {
        var updated = pending.filter(function(_, i) { return i !== index })
        setPending(updated)
        if (onPendingChange) onPendingChange(updated.map(function(p) { return p.path }))
    }

    async function handleSetCover(imgId) {
        await window.db.setCoverImage(carId, imgId)
        await loadSaved()
    }

    async function handleDelete(imgId) {
        if (!window.confirm('Supprimer cette image ?')) return
        await window.db.deleteImage(imgId)
        await loadSaved()
    }

    var total = saved.length + pending.length

    return (
        <div className="ci-wrapper">
            <div className="ci-header">
                <h3>Photos du véhicule ({total})</h3>
                <button className="ci-btn-add" onClick={handlePick} disabled={loading}>
                    {loading ? 'Chargement...' : '+ Ajouter des photos'}
                </button>
            </div>

            {total === 0 && (
                <div className="ci-no-images">
                    <span>📷</span>
                    <p>Aucune photo. Cliquez sur "Ajouter des photos".</p>
                </div>
            )}

            <div className="ci-grid">
                {/* Saved images from DB */}
                {saved.map(function(img) {
                    return (
                        <div key={img.id} className={'ci-card' + (img.is_primary ? ' ci-card--cover' : '')}>
                            <img src={img.previewUrl} alt="" className="ci-img"
                                onError={function(e) { e.target.src = '' }} />
                            {img.is_primary && <span className="ci-badge">Couverture</span>}
                            <div className="ci-actions">
                                {!img.is_primary && (
                                    <button className="ci-btn ci-btn--cover" title="Définir couverture"
                                        onClick={function() { handleSetCover(img.id) }}>⭐</button>
                                )}
                                <button className="ci-btn ci-btn--delete" title="Supprimer"
                                    onClick={function() { handleDelete(img.id) }}>🗑</button>
                            </div>
                        </div>
                    )
                })}

                {/* Pending — picked before car was saved */}
                {pending.map(function(p, i) {
                    return (
                        <div key={'pnd-' + i} className="ci-card ci-card--pending">
                            <img src={p.previewUrl} alt="" className="ci-img" />
                            <span className="ci-badge" style={{background:'#f59e0b'}}>En attente</span>
                            <div className="ci-actions">
                                <button className="ci-btn ci-btn--delete" title="Retirer"
                                    onClick={function() { removePending(i) }}>🗑</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}