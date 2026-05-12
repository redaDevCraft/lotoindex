// @ts-nocheck
import React, { useState, useEffect } from 'react'

export default function CarImages({ carId }) {
    const [images, setImages]   = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(function() {
        if (carId) loadImages()
    }, [carId])

    async function loadImages() {
        var imgs = await window.db.getCarImages(carId)
        setImages(imgs || [])
    }

    async function handlePick() {
        setLoading(true)
        try {
            var paths = await window.db.pickImages()
            if (paths && paths.length > 0) {
                await window.db.uploadImages(carId, paths)
                await loadImages()
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleSetCover(imgId) {
        await window.db.setCoverImage(carId, imgId)
        await loadImages()
    }

    async function handleDelete(imgId) {
        if (!window.confirm('Supprimer cette image ?')) return
        await window.db.deleteImage(imgId)
        await loadImages()
    }

    if (!carId) return (
        <div className="ci-empty">Enregistrez le véhicule d'abord pour ajouter des images.</div>
    )

    return (
        <div className="ci-wrapper">
            <div className="ci-header">
                <h3>Photos du véhicule ({images.length})</h3>
                <button className="ci-btn-add" onClick={handlePick} disabled={loading}>
                    {loading ? 'Chargement...' : '+ Ajouter des photos'}
                </button>
            </div>

            {images.length === 0 && (
                <div className="ci-no-images">
                    <span>📷</span>
                    <p>Aucune photo. Cliquez sur "Ajouter des photos".</p>
                </div>
            )}

            <div className="ci-grid">
                {images.map(function(img) {
                    return (
                        <div key={img.id} className={'ci-card' + (img.is_cover ? ' ci-card--cover' : '')}>
                            <img
                                src={img.url}
                                alt={img.filename}
                                className="ci-img"
                                onError={function(e) { e.target.src = '' }}
                            />
                            {img.is_cover && <span className="ci-badge">Couverture</span>}
                            <div className="ci-actions">
                                {!img.is_cover && (
                                    <button
                                        className="ci-btn ci-btn--cover"
                                        title="Définir comme couverture"
                                        onClick={function() { handleSetCover(img.id) }}
                                    >⭐</button>
                                )}
                                <button
                                    className="ci-btn ci-btn--delete"
                                    title="Supprimer"
                                    onClick={function() { handleDelete(img.id) }}
                                >🗑</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}